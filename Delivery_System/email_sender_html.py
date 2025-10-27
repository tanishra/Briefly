"""
Send HTML email with reports and embedded charts using Resend API
Attachments are directly referenced via public GitHub URLs
"""
from datetime import datetime
from .html_email_template import create_html_email
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def send_html_email_with_charts(recipient_email, user_name):
    """Send beautiful HTML email with embedded charts and report attachments via Resend API"""
    
    RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
    FROM_EMAIL = os.environ.get("GMAIL_USER")
    print(RESEND_API_KEY)

    if not RESEND_API_KEY:
        print("Error: Resend API key not configured!")
        return False

    today = datetime.now().strftime("%B %d, %Y")
    subject = f"Sales & Marketing Report - {today}"

    try:
        # Plain text version (fallback)
        text_body = f"""Daily Sales & Marketing Report - {today}

Hello {user_name},

Please find attached your daily sales and marketing reports with comprehensive visualizations.

Reports included:
- daily_executive_summary_20251017.txt
- daily_marketing_report_20251017.txt
- daily_sales_report_20251017.txt

Best regards,
Automated Report System
"""

        # HTML version
        html_body = create_html_email(user_name)

        # Report URLs
        report_files = [
            "https://raw.githubusercontent.com/tanishra/Briefly/main/reports/daily_executive_summary_20251017.txt",
            "https://raw.githubusercontent.com/tanishra/Briefly/main/reports/daily_marketing_report_20251017.txt",
            "https://raw.githubusercontent.com/tanishra/Briefly/main/reports/daily_sales_report_20251017.txt"
        ]

        # Chart URLs
        chart_files = [
            "https://raw.githubusercontent.com/tanishra/Briefly/main/charts/channel_performance.png",
            "https://raw.githubusercontent.com/tanishra/Briefly/main/charts/marketing_roi.png",
            "https://raw.githubusercontent.com/tanishra/Briefly/main/charts/product_performance.png",
            "https://raw.githubusercontent.com/tanishra/Briefly/main/charts/quarterly_performance.png",
            "https://raw.githubusercontent.com/tanishra/Briefly/main/charts/sales_by_region.png"
        ]

        # Mapping for chart cids
        chart_mapping = {
            "channel_performance.png": "channel_performance",
            "marketing_roi.png": "marketing_roi",
            "product_performance.png": "product_performance",
            "quarterly_performance.png": "quarterly_performance",
            "sales_by_region.png": "sales_by_region"
        }

        # Prepare attachments
        attachments = []

        # Add report attachments
        for report_url in report_files:
            attachments.append({
                "name": report_url.split("/")[-1],
                "type": "text/plain",
                "path": report_url
            })

        # Add chart attachments with cid
        for chart_url in chart_files:
            filename = chart_url.split("/")[-1]
            attachments.append({
                "name": filename,
                "type": "image/png",
                "path": chart_url,
                "cid": chart_mapping.get(filename, filename.replace(".png", ""))
            })

        # Payload
        payload = {
            "from": FROM_EMAIL,
            "to": [recipient_email],
            "subject": subject,
            "html": html_body,
            "text": text_body,
            "attachments": attachments
        }

        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        }

        # Send email
        print(f"📧 Sending email to {recipient_email} via Resend...")
        response = requests.post("https://api.resend.com/emails", json=payload, headers=headers)

        if response.status_code in (200, 202):
            print(f"✓ Email sent successfully to {recipient_email}!")
            return True
        else:
            print(f"✗ Failed to send email: {response.status_code} {response.text}")
            return False

    except Exception as e:
        print(f"✗ Error sending email: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    recipient = "tanishrajput9@gmail.com"
    user_name = "Tanish"
    send_html_email_with_charts(recipient, user_name)
