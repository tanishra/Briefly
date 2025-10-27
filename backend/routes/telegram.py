from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import os
import glob

router = APIRouter(prefix="/telegram", tags=["telegram"])

# Path to store telegram settings
TELEGRAM_SETTINGS_FILE = os.path.join("config", "telegram_settings.json")

# Ensure config directory exists
os.makedirs("config", exist_ok=True)


class TelegramSettings(BaseModel):
    """Telegram settings model"""
    phone_number: str
    chat_id: Optional[str] = None
    notifications_enabled: bool = True


class TelegramSettingsResponse(BaseModel):
    """API response model"""
    ok: bool
    message: str
    settings: Optional[TelegramSettings] = None


def load_telegram_settings() -> TelegramSettings:
    """Load telegram settings from JSON file"""
    if os.path.exists(TELEGRAM_SETTINGS_FILE):
        try:
            with open(TELEGRAM_SETTINGS_FILE, 'r') as f:
                data = json.load(f)
                return TelegramSettings(**data)
        except Exception as e:
            print(f"Error loading telegram settings: {e}")
    
    # Return default settings
    return TelegramSettings(
        phone_number="",
        chat_id=None,
        notifications_enabled=False
    )


def save_telegram_settings(settings: TelegramSettings) -> bool:
    """Save telegram settings to JSON file"""
    try:
        with open(TELEGRAM_SETTINGS_FILE, 'w') as f:
            json.dump(settings.dict(), f, indent=2)
        print(f"✅ Telegram settings saved: {settings.phone_number}")
        return True
    except Exception as e:
        print(f"❌ Error saving telegram settings: {e}")
        return False


def get_latest_reports():
    """Find the latest report files"""
    reports_dir = "reports"
    report_files = []
    
    patterns = [
        "*sales*.txt",
        "*marketing*.txt", 
        "*summary*.txt",
        "*executive*.txt"
    ]
    
    for pattern in patterns:
        files = glob.glob(os.path.join(reports_dir, pattern))
        if files:
            latest = max(files, key=os.path.getctime)
            report_files.append(latest)
    
    return report_files


def get_latest_charts():
    """Find the latest chart files"""
    charts_dir = "charts"
    chart_files = []
    
    if os.path.exists(charts_dir):
        png_files = glob.glob(os.path.join(charts_dir, "*.png"))
        chart_files = sorted(png_files, key=os.path.getctime, reverse=True)
    
    return chart_files


@router.get("/settings", response_model=TelegramSettingsResponse)
async def get_telegram_settings():
    """
    GET /telegram/settings
    Retrieve current telegram settings
    """
    try:
        settings = load_telegram_settings()
        return TelegramSettingsResponse(
            ok=True,
            message="Telegram settings retrieved successfully",
            settings=settings
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/settings", response_model=TelegramSettingsResponse)
async def update_telegram_settings(settings: TelegramSettings):
    """
    POST /telegram/settings
    Update telegram settings
    
    Request body:
    {
        "phone_number": "+1234567890",
        "chat_id": "optional_chat_id",
        "notifications_enabled": true
    }
    """
    try:
        # Validate phone number is not empty
        if not settings.phone_number or settings.phone_number.strip() == "":
            raise HTTPException(
                status_code=400,
                detail="Please provide a valid phone number"
            )
        
        # Save settings
        success = save_telegram_settings(settings)
        
        if success:
            return TelegramSettingsResponse(
                ok=True,
                message="Telegram settings updated successfully",
                settings=settings
            )
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to save telegram settings"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/settings")
async def reset_telegram_settings():
    """
    DELETE /telegram/settings
    Reset telegram settings to default
    """
    try:
        if os.path.exists(TELEGRAM_SETTINGS_FILE):
            os.remove(TELEGRAM_SETTINGS_FILE)
            print("🗑️  Telegram settings file deleted")
        
        return {
            "ok": True,
            "message": "Telegram settings reset to default"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send")
async def send_telegram_manually():
    """
    POST /telegram/send
    Manually send reports and charts via Telegram
    """
    try:
        from Delivery_System.telegram_sender import send_to_telegram
        # Load user Telegram settings
        settings = load_telegram_settings()

        if not settings.notifications_enabled:
            return {
                "ok": False,
                "message": "Telegram notifications are disabled in settings"
            }

        if not settings.phone_number:
            return {
                "ok": False,
                "message": "Please configure your phone number in Settings first"
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

        #  Async call to send reports
        print(f"\n📱 Manually sending to Telegram: {settings.phone_number}...")
        await send_to_telegram(report_files, chart_files)

        return {
            "ok": True,
            "message": f"Reports sent successfully to ({settings.phone_number})!",
            "phone_number": settings.phone_number,
            "reports_sent": len(report_files),
            "charts_sent": len(chart_files)
        }

    except Exception as e:
        print(f"❌ Error sending to Telegram: {e}")
        return {
            "ok": False,
            "message": f"Failed to send to Telegram: {str(e)}"
        }



