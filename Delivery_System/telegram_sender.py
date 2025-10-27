"""Telegram bot for sending reports - Simple working version"""
from telethon import TelegramClient
from AI_Agent_System.config import TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_PHONE
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SESSION_PATH = os.path.join(CURRENT_DIR, "tanishrajput123")

# Create the client
client = TelegramClient('tanishrajput123', TELEGRAM_API_ID, TELEGRAM_API_HASH)

async def send_telegram_reports(report_files, chart_files, recipient):
    """
    Send selected charts and all reports to Telegram.
    `recipient` can be a phone number (+123...) or a chat_id (int).
    """
    print("\n" + "=" * 80)
    print(f"SENDING TO TELEGRAM → {recipient}")
    print("=" * 80)

    from datetime import datetime
    today = datetime.now().strftime("%B %d, %Y at %I:%M %p IST")

    # Header message
    await client.send_message(
        recipient,
        f"📊 **Sales & Marketing Report**\n\nGenerated: {today}"
    )
    print("✓ Sent header message")

    allowed_charts = {
        "channel_performance.png",
        "marketing_roi.png",
        "product_performance.png",
        "quarterly_performance.png",
        "sales_by_region.png",
    }

    for chart in chart_files:
        if os.path.exists(chart):
            chart_name = os.path.basename(chart)
            if chart_name in allowed_charts:
                display_name = chart_name.replace(".png", "").replace("_", " ").title()
                await client.send_file(recipient, chart, caption=f"📈 {display_name}")
                print(f"✓ Sent {chart_name}")

    # Reports
    for report in report_files:
        if os.path.exists(report):
            report_name = os.path.basename(report).replace(".txt", "").replace("_", " ").title()
            await client.send_file(recipient, report, caption=f"📄 {report_name}")
            print(f"✓ Sent {os.path.basename(report)}")

    # Footer
    await client.send_message(
        recipient,
        "✅ All charts and reports delivered successfully!\n\n🤖 Powered by AI • Generated with Python + AutoGen + RAG"
    )
    print("✓ Sent footer message")
    print("\n✓ All selected files sent to Telegram!\n")


# async compatible (takes phone/chat dynamically)
async def send_to_telegram(report_files, chart_files, phone_or_chat):
    async with client:
        await send_telegram_reports(report_files, chart_files, phone_or_chat)


async def test_telegram():
    """Test Telegram connection"""
    await client.send_message(TELEGRAM_PHONE, 
        '🚀 Test Message from Report System!\n\n'
        'If you see this, Telegram integration is working perfectly! ✅'
    )
    print("✅ Test message sent successfully!")

if __name__ == "__main__":
    print("Testing Telegram connection...")
    print(f"Sending to: {TELEGRAM_PHONE}")
    
    with client:
        client.loop.run_until_complete(test_telegram())
