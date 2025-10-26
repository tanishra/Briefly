from fastapi import APIRouter, HTTPException
from typing import Optional
import os
import glob

router = APIRouter(prefix="/email", tags=["email"])


def get_latest_reports():
    """Find the latest report files"""
    reports_dir = "reports"
    report_files = []
    
    # Look for common report patterns
    patterns = [
        "*sales*.txt",
        "*marketing*.txt", 
        "*summary*.txt",
        "*executive*.txt"
    ]
    
    for pattern in patterns:
        files = glob.glob(os.path.join(reports_dir, pattern))
        if files:
            # Get the most recent file for this pattern
            latest = max(files, key=os.path.getctime)
            report_files.append(latest)

    if not report_files:
        raise HTTPException(status_code=404, detail="No reports found.")
    
    return report_files


CHARTS_DIR = os.path.abspath("./charts")

def get_latest_charts():
    """Find the latest chart files based on selected filenames."""

    selected_charts = [
        "channel_performance.png",
        "marketing_roi.png",
        "product_performance.png",
        "quarterly_performance.png",
        "sales_by_region.png"
    ]

    chart_files = []

    if not os.path.exists(CHARTS_DIR):
        raise HTTPException(status_code=404, detail=f"Charts directory '{CHARTS_DIR}' does not exist")

    png_files = glob.glob(os.path.join(CHARTS_DIR, "*.png"))

    for file in png_files:
        file_name = os.path.basename(file)
        if file_name in selected_charts:
            chart_files.append(file)
    
    if not chart_files:
        raise HTTPException(status_code=404, detail="No selected charts found in the directory")
    
    chart_files = sorted(chart_files, key=os.path.getctime, reverse=True)

    return chart_files





@router.post("/send")
async def send_email_manually():
    """
    POST /email/send
    Manually send email with latest reports and charts
    """
    try:
        # Import here to avoid circular imports
        from Delivery_System.email_sender_html import send_html_email_with_charts
        from backend.config.user_settings import load_email_settings
        
        # Check if email is configured
        settings = load_email_settings()
        print(settings)
        
        if not settings.notifications_enabled:
            return {
                "ok": False,
                "message": "Email notifications are disabled in settings"
            }
        
        if settings.recipient_email == "default@example.com":
            return {
                "ok": False,
                "message": "Please configure your email address in Settings first"
            }
        
        # Get latest reports and charts
        report_files = get_latest_reports()
        chart_files = get_latest_charts()
        
        if not report_files:
            return {
                "ok": False,
                "message": "No reports found. Please generate reports first."
            }
        
        if not chart_files:
            return {
                "ok": False,
                "message": "No charts found. Please generate reports first."
            }
        
        # Send email
        print(f"\n📧 Manually sending email to {settings.recipient_email}...")
        success = send_html_email_with_charts(report_files, chart_files)
        
        if success:
            return {
                "ok": True,
                "message": f"Email sent successfully to {settings.recipient_email}!",
                "recipient": settings.recipient_email,
                "reports_sent": len(report_files),
                "charts_sent": len(chart_files)
            }
        else:
            return {
                "ok": False,
                "message": "Failed to send email. Check backend logs for details."
            }
    
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/preview")
async def preview_email_content():
    """
    GET /email/preview
    Preview what will be sent in the email
    """
    try:
        from backend.config.user_settings import load_email_settings
        
        settings = load_email_settings()
        report_files = get_latest_reports()
        chart_files = get_latest_charts()
        
        return {
            "ok": True,
            "recipient": settings.recipient_email,
            "user_name": settings.user_name,
            "notifications_enabled": settings.notifications_enabled,
            "reports": [os.path.basename(f) for f in report_files],
            "charts": [os.path.basename(f) for f in chart_files],
            "ready_to_send": bool(report_files and chart_files and settings.notifications_enabled)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))