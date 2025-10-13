"""
Configuration file for the report generation system
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# OpenAI Configuration
EURI_API_KEY = os.getenv("EURI_API_KEY", "").strip()

# ChromaDB Configuration
CHROMA_DB_PATH = "./chroma_db"
COLLECTION_NAME = "Sales_Marketing_Data"

# AutoGen Configuration
AUTOGEN_CONFIG = {
    "config_list": [
        {
            "model": "gpt-4.1-mini",
            "api_key": EURI_API_KEY,
        }
    ],
    "temperature": 0.7,
}

# Email Configuration
GMAIL_USER = os.getenv("GMAIL_USER", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", "")

# Scheduler Configuration
SCHEDULE_TIME = "09:00"  # 9 AM IST
TIMEZONE = "Asia/Kolkata"

# Telegram Configuration
TELEGRAM_API_ID = int(os.getenv("TELEGRAM_API_ID"))
TELEGRAM_API_HASH = os.getenv("TELEGRAM_API_HASH")
TELEGRAM_PHONE = os.getenv("TELEGRAM_PHONE")

