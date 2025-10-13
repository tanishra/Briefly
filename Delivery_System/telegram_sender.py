"""Telegram bot for sending reports - Simple working version"""
from telethon import TelegramClient
from AI_Agent_System.config import TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_PHONE
import os

# Create the client
client = TelegramClient('sudhreport123_session', TELEGRAM_API_ID, TELEGRAM_API_HASH)

async def send_telegram_reports(report_files, chart_files):
    """Send all reports and charts to Telegram"""
    print("\n" + "="*80)
    print("SENDING TO TELEGRAM")
    print("="*80)
    
    from datetime import datetime
    today = datetime.now().strftime("%B %d, %Y at %I:%M %p IST")
    
    # Send header message
    await client.send_message(TELEGRAM_PHONE, 
        f"📊 **Daily Sales & Marketing Report**\n\n"
        f"Generated: {today}\n"
        f"Data: 1000 sales + 1000 marketing records\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    )
    print("✓ Sent header message")
    
    # Send charts with captions
    for chart in chart_files:
        if os.path.exists(chart):
            chart_name = os.path.basename(chart).replace('.png', '').replace('_', ' ').title()
            await client.send_file(TELEGRAM_PHONE, chart, caption=f"📈 {chart_name}")
            print(f"✓ Sent {os.path.basename(chart)}")
    
    # Send reports with captions
    for report in report_files:
        if os.path.exists(report):
            report_name = os.path.basename(report).replace('.txt', '').replace('_', ' ').title()
            await client.send_file(TELEGRAM_PHONE, report, caption=f"📄 {report_name}")
            print(f"✓ Sent {os.path.basename(report)}")
    
    # Send footer message
    await client.send_message(TELEGRAM_PHONE, 
        "✅ All reports delivered successfully!\n\n"
        "🤖 Powered by AI • Generated with Python + AutoGen + RAG"
    )
    print("✓ Sent footer message")
    
    print("\n✓ All files sent to Telegram!\n")

def send_to_telegram(report_files, chart_files):
    """Wrapper function to send reports"""
    with client:
        client.loop.run_until_complete(send_telegram_reports(report_files, chart_files))

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
