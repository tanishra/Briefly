# """
# Enhanced email sending with HTML templates and embedded images
# """
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# from email.mime.application import MIMEApplication
# from email.mime.image import MIMEImage
# from datetime import datetime
# from AI_Agent_System.config import GMAIL_USER, GMAIL_APP_PASSWORD
# from .html_email_template import create_html_email
# import os


# def send_html_email_with_charts(report_files, chart_files,recipient_email, user_name):
#     """Send beautiful HTML email with embedded charts and report attachments"""
    
#     if not GMAIL_USER or not GMAIL_APP_PASSWORD:
#         print("Error: Email credentials not configured!")
#         return False
    
#     today = datetime.now().strftime("%B %d, %Y")
#     subject = f"📊 Sales & Marketing Report - {today}"
    
#     try:
#         # Create message
#         msg = MIMEMultipart('related')
#         msg['From'] = GMAIL_USER
#         msg['To'] = recipient_email
#         msg['Subject'] = subject
        
#         # Create alternative part for HTML
#         msg_alternative = MIMEMultipart('alternative')
#         msg.attach(msg_alternative)
        
#         # Plain text version (fallback)
#         text_body = f"""Daily Sales & Marketing Report - {today}

# Hello,

# Please find attached your daily sales and marketing reports with comprehensive visualizations.

# Reports included:
# """
#         for report_file in report_files:
#             text_body += f"- {os.path.basename(report_file)}\n"
        
#         text_body += """
# Best regards,
# Automated Report System
# """
        
#         msg_alternative.attach(MIMEText(text_body, 'plain'))
        
#         # HTML version with charts
#         html_body = create_html_email(user_name)
#         msg_alternative.attach(MIMEText(html_body, 'html'))
        
#         # Embed chart images
#         chart_mapping = {
#             'sales_by_region.png': 'sales_by_region',
#             'quarterly_performance.png': 'quarterly_performance',
#             'product_performance.png': 'product_performance',
#             'marketing_roi.png': 'marketing_roi',
#             'channel_performance.png': 'channel_performance'
#         }
        
#         for chart_file in chart_files:
#             if os.path.exists(chart_file):
#                 filename = os.path.basename(chart_file)
#                 with open(chart_file, 'rb') as f:
#                     img = MIMEImage(f.read())
#                     cid = chart_mapping.get(filename, filename.replace('.png', ''))
#                     img.add_header('Content-ID', f'<{cid}>')
#                     img.add_header('Content-Disposition', 'inline', filename=filename)
#                     msg.attach(img)
#                 print(f"✓ Embedded chart: {filename}")
        
#         # Attach report files
#         for report_file in report_files:
#             if os.path.exists(report_file):
#                 with open(report_file, 'rb') as f:
#                     attach = MIMEApplication(f.read(), _subtype="txt")
#                     attach.add_header('Content-Disposition', 'attachment', 
#                                     filename=os.path.basename(report_file))
#                     msg.attach(attach)
#                 print(f"✓ Attached report: {os.path.basename(report_file)}")
        
#         # Send email via Gmail SMTP
#         app_password = GMAIL_APP_PASSWORD.replace(" ", "")
        
#         print("\nConnecting to Gmail SMTP server...")
#         server = smtplib.SMTP('smtp.gmail.com', 587)
#         server.starttls()
        
#         print("Logging in...")
#         server.login(GMAIL_USER, app_password)
        
#         print("Sending beautiful HTML email...")
#         server.send_message(msg)
#         server.quit()
        
#         print(f"\n✓ Beautiful HTML email sent successfully to {recipient_email}!")
#         return True
        
#     except Exception as e:
#         print(f"\n✗ Error sending email: {str(e)}")
#         import traceback
#         traceback.print_exc()
#         return False


# if __name__ == "__main__":
#     print("Testing HTML email with visualizations...")
    
#     # Test with existing demo reports
#     report_files = [
#         "demo_sales_north_america.txt",
#         "demo_marketing_q2_2024.txt",
#         "demo_product_cloud_storage.txt"
#     ]
    
#     # Generate charts first
#     from Visualizations.visualizations import generate_all_charts
#     chart_files = generate_all_charts()
    
#     # Send email
#     send_html_email_with_charts(report_files, chart_files)


"""
Enhanced email sending with HTML templates and embedded images
using Resend API instead of SMTP
"""
import os
import base64
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

        text_body += "\nBest regards,\n Briefly - Multi AI Automated Report System"

        # HTML version
        html_body = create_html_email(user_name)

        # Prepare attachments (reports + charts)
        attachments = []

        # Attach reports
        for report_file in report_files:
            if os.path.exists(report_file):
                with open(report_file, "rb") as f:
                    content = base64.b64encode(f.read()).decode("utf-8")
                attachments.append({
                    "name": os.path.basename(report_file),
                    "type": "text/plain",
                    "data": content
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
                with open(chart_file, "rb") as f:
                    content = base64.b64encode(f.read()).decode("utf-8")
                cid = chart_mapping.get(os.path.basename(chart_file), os.path.basename(chart_file).replace('.png', ''))
                attachments.append({
                    "name": os.path.basename(chart_file),
                    "type": "image/png",
                    "data": content,
                    "cid": cid  # Resend supports embedding via cid
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
