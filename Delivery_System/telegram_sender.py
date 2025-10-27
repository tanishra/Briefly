"""
Telegram bot for sending reports - Render-safe version
Handles non-interactive login (no EOF) and uses pre-saved .session file.
"""

import os
from datetime import datetime
from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from AI_Agent_System.config import TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_PHONE

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SESSION_PATH = os.path.join(CURRENT_DIR, "tanishrajput123")

# Create Telegram client using session file
client = TelegramClient(SESSION_PATH, TELEGRAM_API_ID, TELEGRAM_API_HASH)

async def init_telegram_client():
    """Connect to Telegram using saved session (no input prompts)."""
    await client.connect()
    if not await client.is_user_authorized():
        raise Exception(
            "❌ Telegram session invalid or expired.\n"
            "Regenerate the 'tanishrajput123.session' file locally using client.start()."
        )


async def send_telegram_reports(report_files, chart_files, recipient):
    """
    Send selected charts and all reports to Telegram.
    `recipient` can be a phone number (+123...) or a chat_id (int).
    """
    await init_telegram_client()

    print("\n" + "=" * 80)
    print(f"SENDING TO TELEGRAM → {recipient}")
    print("=" * 80)

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

    # Send charts
    for chart in chart_files:
        if os.path.exists(chart):
            chart_name = os.path.basename(chart)
            if chart_name in allowed_charts:
                display_name = chart_name.replace(".png", "").replace("_", " ").title()
                await client.send_file(recipient, chart, caption=f"📈 {display_name}")
                print(f"✓ Sent {chart_name}")

    # Send reports
    for report in report_files:
        if os.path.exists(report):
            report_name = os.path.basename(report).replace(".txt", "").replace("_", " ").title()
            await client.send_file(recipient, report, caption=f"📄 {report_name}")
            print(f"✓ Sent {os.path.basename(report)}")

    # Footer
    await client.send_message(
        recipient,
        "✅ All charts and reports delivered successfully!\n\n"
        "🤖 Powered by AI • Generated with Python + AutoGen + RAG"
    )
    print("✓ Sent footer message")
    print("\n✓ All selected files sent to Telegram!\n")


async def send_to_telegram(report_files, chart_files, phone_or_chat):
    """Async wrapper that ensures client is connected before sending."""
    await init_telegram_client()
    async with client:
        await send_telegram_reports(report_files, chart_files, phone_or_chat)


async def test_telegram():
    """Test Telegram connection."""
    await init_telegram_client()
    await client.send_message(
        TELEGRAM_PHONE,
        '🚀 Test Message from Report System!\n\n'
        'If you see this, Telegram integration is working perfectly! ✅'
    )
    print("✅ Test message sent successfully!")


if __name__ == "__main__":
    import asyncio

    print("Testing Telegram connection...")
    print(f"Sending to: {TELEGRAM_PHONE}")

    async def main():
        await test_telegram()
        await client.disconnect()

    asyncio.run(main())
