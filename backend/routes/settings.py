# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel, EmailStr
# from typing import Optional
# import json
# import os

# router = APIRouter(prefix="/settings", tags=["settings"])

# # Path to store user settings
# SETTINGS_FILE = os.path.join("config", "user_settings.json")

# # Ensure config directory exists
# os.makedirs("config", exist_ok=True)


# class EmailSettings(BaseModel):
#     """Email settings model"""
#     recipient_email: EmailStr
#     user_name: Optional[str] = "User"
#     notifications_enabled: bool = True


# class EmailSettingsResponse(BaseModel):
#     """Response model"""
#     ok: bool
#     message: str
#     settings: Optional[EmailSettings] = None


# def load_email_settings() -> EmailSettings:
#     """Load email settings from file"""
#     if os.path.exists(SETTINGS_FILE):
#         try:
#             with open(SETTINGS_FILE, 'r') as f:
#                 data = json.load(f)
#                 return EmailSettings(**data)
#         except Exception as e:
#             print(f"Error loading settings: {e}")
    
#     # Return default settings
#     return EmailSettings(
#         recipient_email="default@example.com",
#         user_name="User",
#         notifications_enabled=False
#     )


# def save_email_settings(settings: EmailSettings) -> bool:
#     """Save email settings to file"""
#     try:
#         with open(SETTINGS_FILE, 'w') as f:
#             json.dump(settings.dict(), f, indent=2)
#         return True
#     except Exception as e:
#         print(f"Error saving settings: {e}")
#         return False


# @router.get("/email", response_model=EmailSettingsResponse)
# async def get_email_settings():
#     """Get current email settings"""
#     try:
#         settings = load_email_settings()
#         return EmailSettingsResponse(
#             ok=True,
#             message="Settings retrieved successfully",
#             settings=settings
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/email", response_model=EmailSettingsResponse)
# async def update_email_settings(settings: EmailSettings):
#     """Update email settings"""
#     try:
#         success = save_email_settings(settings)
        
#         if success:
#             return EmailSettingsResponse(
#                 ok=True,
#                 message="Email settings updated successfully",
#                 settings=settings
#             )
#         else:
#             raise HTTPException(status_code=500, detail="Failed to save settings")
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.delete("/email")
# async def reset_email_settings():
#     """Reset email settings to default"""
#     try:
#         if os.path.exists(SETTINGS_FILE):
#             os.remove(SETTINGS_FILE)
        
#         return {
#             "ok": True,
#             "message": "Email settings reset to default"
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))





from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import json
import os

router = APIRouter(prefix="/settings", tags=["settings"])

# Path to store user settings
SETTINGS_FILE = os.path.join("config", "user_settings.json")

# Ensure config directory exists
os.makedirs("config", exist_ok=True)


class EmailSettings(BaseModel):
    """Email settings model with validation"""
    recipient_email: EmailStr
    user_name: Optional[str] = "User"
    notifications_enabled: bool = True


class EmailSettingsResponse(BaseModel):
    """API response model"""
    ok: bool
    message: str
    settings: Optional[EmailSettings] = None


def load_email_settings() -> EmailSettings:
    """
    Load email settings from JSON file
    Returns default settings if file doesn't exist
    """
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, 'r') as f:
                data = json.load(f)
                return EmailSettings(**data)
        except Exception as e:
            print(f"Error loading settings: {e}")
    
    # Return default settings
    return EmailSettings(
        recipient_email="default@example.com",
        user_name="User",
        notifications_enabled=False
    )


def save_email_settings(settings: EmailSettings) -> bool:
    """
    Save email settings to JSON file
    Returns True if successful
    """
    try:
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(settings.dict(), f, indent=2)
        print(f"✅ Settings saved: {settings.recipient_email}")
        return True
    except Exception as e:
        print(f"❌ Error saving settings: {e}")
        return False


@router.get("/email", response_model=EmailSettingsResponse)
async def get_email_settings():
    """
    GET /settings/email
    Retrieve current email settings
    """
    try:
        settings = load_email_settings()
        return EmailSettingsResponse(
            ok=True,
            message="Settings retrieved successfully",
            settings=settings
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/email", response_model=EmailSettingsResponse)
async def update_email_settings(settings: EmailSettings):
    """
    POST /settings/email
    Update email settings with new values
    
    Request body:
    {
        "recipient_email": "user@example.com",
        "user_name": "John Doe",
        "notifications_enabled": true
    }
    """
    try:
        # Validate email is not default
        if settings.recipient_email == "default@example.com":
            raise HTTPException(
                status_code=400,
                detail="Please provide a valid email address"
            )
        
        # Save settings
        success = save_email_settings(settings)
        
        if success:
            return EmailSettingsResponse(
                ok=True,
                message="Email settings updated successfully",
                settings=settings
            )
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to save settings"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/email")
async def reset_email_settings():
    """
    DELETE /settings/email
    Reset email settings to default
    """
    try:
        if os.path.exists(SETTINGS_FILE):
            os.remove(SETTINGS_FILE)
            print("🗑️  Settings file deleted")
        
        return {
            "ok": True,
            "message": "Email settings reset to default"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/email/test")
async def test_email_settings():
    """
    Test endpoint to verify settings are working
    """
    settings = load_email_settings()
    
    return {
        "ok": True,
        "settings_file_exists": os.path.exists(SETTINGS_FILE),
        "settings_file_path": os.path.abspath(SETTINGS_FILE),
        "current_settings": settings.dict(),
        "notifications_enabled": settings.notifications_enabled,
        "is_default_email": settings.recipient_email == "default@example.com"
    }