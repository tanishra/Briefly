"""
FastAPI backend for Briefly - wraps existing report-generation + delivery pipeline,
runs a background scheduler (daily at SCHEDULE_TIME), and exposes REST endpoints
for the frontend to trigger/report results and fetch visualizations.
"""

import os
import shutil
import glob
import base64
import threading
import time
from datetime import datetime
from typing import List, Optional

import pytz
import schedule
from fastapi import FastAPI, BackgroundTasks, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Import your existing functions / config
from AI_Agent_System.config import SCHEDULE_TIME, TIMEZONE, RECIPIENT_EMAIL
from Data.report_generator import (
    generate_sales_performance_report,
    generate_marketing_campaign_report,
    generate_quarterly_summary_report,
    generate_custom_analysis_report,
    save_report_to_file,
)
from Visualizations.visualizations import generate_all_charts
from backend.utils.email_sender import send_html_email_with_charts
from Delivery_System.telegram_sender import send_to_telegram
from backend.routes.settings import router as settings_router
from backend.routes.dataset import router as dataset_router
from backend.routes.email import router as email_router

# If you also have a scheduler.py with generate_and_send_daily_reports, you can import it instead but here we'll reuse the core functions and a pipeline implemented below
# from scheduler import generate_and_send_daily_reports  # optional

# Directories for static serving
REPORTS_DIR = os.path.abspath("./reports")
CHARTS_DIR = os.path.abspath("./charts")
os.makedirs(REPORTS_DIR, exist_ok=True)
os.makedirs(CHARTS_DIR, exist_ok=True)

app = FastAPI(title="Briefly")

# Allow your frontend origin(s) here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directories for frontend to consume generated files
app.mount("/static/reports", StaticFiles(directory=REPORTS_DIR), name="reports")
app.mount("/static/charts", StaticFiles(directory=CHARTS_DIR), name="charts")
app.include_router(email_router)
app.include_router(settings_router)
app.include_router(dataset_router)


# -------------------------
# Helpers - file operations
# -------------------------
def _safe_move_to_dir(src_path: str, dest_dir: str) -> str:
    """
    Move file to dest_dir preserving filename. Returns new absolute path.
    If src_path already in dest_dir, return absolute path.
    """
    src_path = os.path.abspath(src_path)
    dest_dir = os.path.abspath(dest_dir)
    os.makedirs(dest_dir, exist_ok=True)
    filename = os.path.basename(src_path)
    dest_path = os.path.join(dest_dir, filename)
    if os.path.abspath(os.path.dirname(src_path)) == dest_dir:
        return src_path
    # if destination exists, add timestamp suffix
    if os.path.exists(dest_path):
        base, ext = os.path.splitext(filename)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{base}_{timestamp}{ext}"
        dest_path = os.path.join(dest_dir, filename)
    shutil.move(src_path, dest_path)
    return dest_path


def _find_latest_report(patterns: List[str] = None) -> Optional[str]:
    """
    Search REPORTS_DIR and current dir for daily report files and return the latest by mtime.
    Patterns defaults to common prefixes used in your scheduler: daily_sales_report_*, daily_marketing_report_*, daily_executive_summary_*
    """
    # patterns = patterns or ["daily_*report_*.txt", "*.txt"]
    patterns = patterns or ["daily_*report_*.txt"]
    candidates = []
    # Search reports directory first
    for pat in patterns:
        candidates.extend(glob.glob(os.path.join(REPORTS_DIR, pat)))
    # Also search current dir if needed
    for pat in patterns:
        candidates.extend(glob.glob(pat))
    if not candidates:
        return None
    candidates = list(set(candidates))
    latest = max(candidates, key=lambda p: os.path.getmtime(p))
    return os.path.abspath(latest)


def _report_to_response(report_path: str) -> dict:
    """
    Return metadata + static URL and text content (short) for a report file.
    """
    if not os.path.exists(report_path):
        raise FileNotFoundError(report_path)
    filename = os.path.basename(report_path)
    url = f"/static/reports/{filename}"
    with open(report_path, "r", encoding="utf-8") as f:
        content = f.read()
    preview = content[:500] + ("..." if len(content) > 500 else "")
    return {
        "filename": filename,
        "path": report_path,
        "url": url,
        "size_bytes": os.path.getsize(report_path),
        "modified_at": datetime.fromtimestamp(os.path.getmtime(report_path)).isoformat(),
        "preview": preview,
        "full_text": content,
    }


# -------------------------
# Core pipeline functions
# -------------------------
def generate_single_report(report_type: str) -> dict:
    """
    Generate one of: 'sales', 'marketing', 'summary'
    Returns metadata similar to _report_to_response
    """
    ts = datetime.now().strftime("%Y%m%d")
    if report_type == "sales":
        data = generate_sales_performance_report()
        filename = f"daily_sales_report_{ts}.txt"
    elif report_type == "marketing":
        data = generate_marketing_campaign_report()
        filename = f"daily_marketing_report_{ts}.txt"
    elif report_type == "summary":
        # Default parameter used in your scheduler; change as needed
        data = generate_quarterly_summary_report("Q3 2024")
        filename = f"daily_executive_summary_{ts}.txt"
    else:
        raise ValueError("Invalid report type. Choose from 'sales', 'marketing', 'summary'.")

    # Save using your existing helper if available
    save_report_to_file(data, filename)
    # Move into REPORTS_DIR (safe)
    dest_path = _safe_move_to_dir(filename, REPORTS_DIR)
    return _report_to_response(dest_path)


def run_full_pipeline_and_send() -> dict:
    """
    Run full pipeline:
    - generate 3 reports
    - generate charts
    - send email
    - send telegram (best effort)
    Returns summary dict with created files and statuses.
    """
    results = {"reports": [], "charts": [], "email_sent": False, "telegram_sent": False}
    ts = datetime.now().strftime("%Y%m%d")

    # 1) Generate reports
    try:
        sales = generate_single_report("sales")
        results["reports"].append(sales)
    except Exception as e:
        results.setdefault("errors", []).append(f"sales_report_error: {str(e)}")

    try:
        marketing = generate_single_report("marketing")
        results["reports"].append(marketing)
    except Exception as e:
        results.setdefault("errors", []).append(f"marketing_report_error: {str(e)}")

    try:
        summary = generate_single_report("summary")
        results["reports"].append(summary)
    except Exception as e:
        results.setdefault("errors", []).append(f"summary_report_error: {str(e)}")

    # 2) Generate visualizations (assumes it returns list of file paths)
    try:
        chart_files = generate_all_charts()
        # Move charts into CHARTS_DIR and collect static URLs
        moved_charts = []
        for ch in chart_files:
            if not os.path.exists(ch):
                # If generate_all_charts returned just names, skip
                continue
            moved = _safe_move_to_dir(ch, CHARTS_DIR)
            moved_charts.append({
                "filename": os.path.basename(moved),
                "path": moved,
                "url": f"/static/charts/{os.path.basename(moved)}"
            })
        results["charts"] = moved_charts
    except Exception as e:
        results.setdefault("errors", []).append(f"charts_error: {str(e)}")

    # 3) Send HTML email with charts & attach reports
    # try:
    #     # prepare lists of file paths for email sender
    #     report_paths = [r["path"] for r in results["reports"]]
    #     chart_paths = [c["path"] for c in results["charts"]]
    #     print(report_paths)
    #     print(chart_paths)
    #     success = send_html_email_with_charts(report_paths, chart_paths)
    #     results["email_sent"] = bool(success)
    # except Exception as e:
    #     results.setdefault("errors", []).append(f"email_send_error: {str(e)}")

    # 4) Send to Telegram (best-effort)
    try:
        report_paths = [r["path"] for r in results["reports"]]
        chart_paths = [c["path"] for c in results["charts"]]
        send_to_telegram(report_paths, chart_paths)
        results["telegram_sent"] = True
    except Exception as e:
        results.setdefault("errors", []).append(f"telegram_send_error: {str(e)}")

    results["run_at"] = datetime.now(pytz.timezone(TIMEZONE)).isoformat()
    return results


# -------------------------
# FastAPI endpoints
# -------------------------
class AskRequest(BaseModel):
    query: str


@app.get("/")
def healthcheck():
    return {"status": "ok", "service": "Briefly Backend", "time": datetime.now().isoformat()}


@app.get("/generate-report")
def api_generate_report(type: str = Query("sales", regex="^(sales|marketing|summary)$")):
    """
    Generate a single report. Query param: type = sales|marketing|summary
    Returns report metadata and static URL to fetch file.
    """
    try:
        res = generate_single_report(type)
        return JSONResponse({"ok": True, "report": res})
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"generate_report_error: {str(e)}")


@app.get("/generate-all-reports")
def api_generate_all_reports(background_tasks: BackgroundTasks):
    """
    Trigger the full pipeline. This endpoint returns immediately and runs the full pipeline
    in the background (since sending email/telegram may take time).
    """
    # Start background execution to avoid blocking HTTP response
    def _bg():
        # run full pipeline in background thread (synchronous work)
        run_full_pipeline_and_send()

    background_tasks.add_task(_bg)
    return {"ok": True, "message": "Full report pipeline started in background. Check logs for details."}


@app.get("/latest-report")
def api_latest_report():
    """
    Return latest report metadata and file content (preview + static URL).
    """
    latest = _find_latest_report()
    if not latest:
        raise HTTPException(status_code=404, detail="No report files found.")
    try:
        info = _report_to_response(latest)
        return {"ok": True, "report": info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"latest_report_error: {str(e)}")


@app.get("/visualizations")
def api_visualizations():
    """
    Returns a list of available chart files (metadata + static URLs).
    """
    # list files from CHARTS_DIR
    files = sorted(glob.glob(os.path.join(CHARTS_DIR, "*.*")))
    charts = []
    for f in files:
        charts.append({
            "filename": os.path.basename(f),
            "path": f,
            "url": f"/static/charts/{os.path.basename(f)}",
            "modified_at": datetime.fromtimestamp(os.path.getmtime(f)).isoformat()
        })
    return {"ok": True, "charts": charts}


@app.post("/ask")
def api_ask(payload: AskRequest):
    """
    Placeholder for future 'ask' integration.
    Currently returns 501 Not Implemented. Replace the body to call your agent's
    generate_custom_analysis_report(payload.query) to actually run.
    """
    # TODO: integrate with your RAG/AutoGen custom query function:
    # report_text = generate_custom_analysis_report(payload.query)
    # filename = f"custom_query_{datetime.now().strftime('%Y%m%d%H%M%S')}.txt"
    # save_report_to_file(report_text, filename)
    # dest_path = _safe_move_to_dir(filename, REPORTS_DIR)
    # return {"ok": True, "report": _report_to_response(dest_path)}

    raise HTTPException(status_code=501, detail="Ask integration not implemented. Placeholder only.")


@app.get("/download-report")
def download_report(filename: str):
    """
    Download a specific report file (must exist in REPORTS_DIR).
    Example: /download-report?filename=daily_sales_report_20251014.txt
    """
    safe_name = os.path.basename(filename)
    path = os.path.join(REPORTS_DIR, safe_name)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Report not found.")
    return FileResponse(path, media_type="text/plain", filename=safe_name)


# -------------------------
# Scheduler: run daily at SCHEDULE_TIME in background
# -------------------------
def _schedule_job():
    """
    Schedule the run_full_pipeline_and_send() job at SCHEDULE_TIME (24h format e.g. "09:00")
    Uses python-schedule and a background thread to execute schedule.run_pending()
    """
    try:
        # ensure the job is scheduled only once
        schedule.clear("daily-report-job")
        # schedule.every().day.at(SCHEDULE_TIME).do(run_full_pipeline_and_send).tag("daily-report-job")
        # We tag job to identify
        schedule.every().day.at(SCHEDULE_TIME).do(run_full_pipeline_and_send).tag("daily-report-job")
        print(f"[Scheduler] Scheduled daily job at {SCHEDULE_TIME} {TIMEZONE}")
    except Exception as e:
        print(f"[Scheduler] Error scheduling job: {e}")


def _scheduler_worker():
    """
    Background thread function that runs schedule.run_pending periodically.
    """
    print("[Scheduler] Background scheduler thread started.")
    tz = pytz.timezone(TIMEZONE)
    while True:
        try:
            schedule.run_pending()
        except Exception as e:
            print(f"[Scheduler] Exception in run_pending: {e}")
        time.sleep(30)  # check every 30 seconds


@app.on_event("startup")
def startup_event():
    # Ensure directories exist
    os.makedirs(REPORTS_DIR, exist_ok=True)
    os.makedirs(CHARTS_DIR, exist_ok=True)

    # Prepare scheduler job
    _schedule_job()

    # Start scheduler thread
    thread = threading.Thread(target=_scheduler_worker, daemon=True, name="Briefly-Scheduler")
    thread.start()

    print(f"[Startup] Briefly Backend started. Scheduler running. Reports will be generated at {SCHEDULE_TIME} {TIMEZONE}.")
    print(f"[Startup] Email recipient configured: {RECIPIENT_EMAIL}")


# -------------------------
# Run guard (optional)
# -------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
