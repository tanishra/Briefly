"""
Enhanced email sending with HTML templates and embedded images
using Resend API and local file paths for attachments
"""
import os
from datetime import datetime
from .html_email_template import create_html_email
import requests

def send_html_email_with_charts(report_files, chart_files, recipient_email, user_name):
    """Send beautiful HTML email with embedded charts and report attachments via Resend API"""
    
    RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
    FROM_EMAIL = os.environ.get("GMAIL_USER", "no-reply@example.com")

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
"""
        for report_file in report_files:
            text_body += f"- {os.path.basename(report_file)}\n"

        text_body += "\nBest regards,\nAutomated Report System"

        # HTML version
        html_body = create_html_email(user_name)

        # Prepare attachments (reports + charts) using paths
        attachments = []

        # Attach reports
        for report_file in report_files:
            if os.path.exists(report_file):
                attachments.append({
                    "name": os.path.basename(report_file),
                    "type": "text/plain",
                    "path": os.path.abspath(report_file) 
                })
                print(f"✓ Prepared report attachment: {os.path.basename(report_file)}")

        # Embed chart images as attachments (inline via cid)
        chart_mapping = {
            'sales_by_region.png': 'sales_by_region',
            'quarterly_performance.png': 'quarterly_performance',
            'product_performance.png': 'product_performance',
            'marketing_roi.png': 'marketing_roi',
            'channel_performance.png': 'channel_performance'
        }

        for chart_file in chart_files:
            if os.path.exists(chart_file):
                cid = chart_mapping.get(os.path.basename(chart_file), os.path.basename(chart_file).replace('.png', ''))
                attachments.append({
                    "name": os.path.basename(chart_file),
                    "type": "image/png",
                    "path": os.path.abspath(chart_file),  
                    "cid": cid
                })
                print(f"✓ Prepared chart attachment: {os.path.basename(chart_file)}")

        # Prepare payload
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

        # Send via Resend API
        print(f"\n📧 Sending email via Resend to {recipient_email}...")
        response = requests.post("https://api.resend.com/emails", json=payload, headers=headers)

        if response.status_code in (200, 202):
            print(f"\n✓ Beautiful HTML email sent successfully to {recipient_email}!")
            return True
        else:
            print(f"\n✗ Failed to send email: {response.status_code} {response.text}")
            return False

    except Exception as e:
        print(f"\n✗ Error sending email: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
