"""
Enhanced email sending with HTML templates and embedded images
Now supports dynamic recipient from user settings!
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.image import MIMEImage
from datetime import datetime
from AI_Agent_System.config import GMAIL_USER, GMAIL_APP_PASSWORD, RECIPIENT_EMAIL
import os
import json


def get_user_settings():
    """
    Load user settings from config file
    Returns dict with email settings or None
    """
    settings_file = os.path.join("config", "user_settings.json")
    
    if os.path.exists(settings_file):
        try:
            with open(settings_file, 'r') as f:
                settings = json.load(f)
                return settings
        except Exception as e:
            print(f"Warning: Could not load user settings: {e}")
            return None
    return None


def get_recipient_email():
    """
    Get recipient email from user settings or fallback to config
    Priority: User Settings > Environment Variable
    """
    settings = get_user_settings()
    
    if settings:
        # Check if notifications are enabled
        if settings.get('notifications_enabled', False):
            email = settings.get('recipient_email', '')
            # Make sure it's not the default placeholder
            if email and email != 'default@example.com':
                print(f"📧 Using email from user settings: {email}")
                return email
    
    # Fallback to environment variable
    print(f"📧 Using email from config: {RECIPIENT_EMAIL}")
    return RECIPIENT_EMAIL


def get_user_name():
    """
    Get user name from settings for personalized emails
    """
    settings = get_user_settings()
    
    if settings:
        name = settings.get('user_name', 'User')
        if name and name != 'User':
            return name
    
    return 'User'


def send_html_email_with_charts(report_files, chart_files):
    """
    Send beautiful HTML email with embedded charts and report attachments
    Now uses dynamic recipient from user settings!
    """
    
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        print("❌ Error: Email credentials not configured!")
        return False
    
    # Get recipient from user settings (DYNAMIC!)
    recipient_email = get_recipient_email()
    user_name = get_user_name()
    
    # Check if notifications are enabled
    settings = get_user_settings()
    if settings and not settings.get('notifications_enabled', True):
        print("⚠️  Email notifications are disabled in user settings")
        return False
    
    today = datetime.now().strftime("%B %d, %Y")
    subject = f"📊 Daily Sales & Marketing Report - {today}"
    
    try:
        # Create message
        msg = MIMEMultipart('related')
        msg['From'] = GMAIL_USER
        msg['To'] = recipient_email  # DYNAMIC RECIPIENT!
        msg['Subject'] = subject
        
        # Create alternative part for HTML
        msg_alternative = MIMEMultipart('alternative')
        msg.attach(msg_alternative)
        
        # Plain text version (fallback) - PERSONALIZED!
        text_body = f"""Daily Sales & Marketing Report - {today}

Hello {user_name},

Please find attached your daily sales and marketing reports with comprehensive visualizations.

Reports included:
"""
        for report_file in report_files:
            text_body += f"- {os.path.basename(report_file)}\n"
        
        text_body += """
Best regards,
Briefly AI - Automated Report System
"""
        
        msg_alternative.attach(MIMEText(text_body, 'plain'))
        
        # HTML version with charts - PERSONALIZED!
        html_body = create_html_email_with_user_name(user_name)
        msg_alternative.attach(MIMEText(html_body, 'html'))
        
        # Embed chart images
        chart_mapping = {
            'sales_by_region.png': 'sales_by_region',
            'quarterly_performance.png': 'quarterly_performance',
            'product_performance.png': 'product_performance',
            'marketing_roi.png': 'marketing_roi',
            'channel_performance.png': 'channel_performance'
        }
        
        for chart_file in chart_files:
            if os.path.exists(chart_file):
                filename = os.path.basename(chart_file)
                with open(chart_file, 'rb') as f:
                    img = MIMEImage(f.read())
                    cid = chart_mapping.get(filename, filename.replace('.png', ''))
                    img.add_header('Content-ID', f'<{cid}>')
                    img.add_header('Content-Disposition', 'inline', filename=filename)
                    msg.attach(img)
                print(f"✓ Embedded chart: {filename}")
                print(f"Embedding image with CID: {cid}")
        
        
        # Attach report files
        for report_file in report_files:
            if os.path.exists(report_file):
                with open(report_file, 'rb') as f:
                    attach = MIMEApplication(f.read(), _subtype="txt")
                    attach.add_header('Content-Disposition', 'attachment',
                                    filename=os.path.basename(report_file))
                    msg.attach(attach)
                print(f"✓ Attached report: {os.path.basename(report_file)}")
        
        # Send email via Gmail SMTP
        app_password = GMAIL_APP_PASSWORD.replace(" ", "")
        print("\n📤 Connecting to Gmail SMTP server...")
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        
        print("🔐 Logging in...")
        server.login(GMAIL_USER, app_password)
        
        print(f"📧 Sending beautiful HTML email to {recipient_email}...")
        server.send_message(msg)
        server.quit()
        
        print(f"\n✅ Beautiful HTML email sent successfully to {recipient_email}!")
        print(f"👤 Personalized for: {user_name}")
        return True
        
    except Exception as e:
        print(f"\n❌ Error sending email: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def create_html_email_with_user_name(user_name):
    """
    Create personalized HTML email template with user's name
    """
    today = datetime.now().strftime("%B %d, %Y")
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Arial, sans-serif;
                background: #f4f4f4;
                margin: 0;
                padding: 20px;
            }}
            .container {{
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
            }}
            .content {{
                padding: 30px;
            }}
            .greeting {{
                font-size: 18px;
                color: #333;
                margin-bottom: 20px;
            }}
            .chart {{
                margin: 20px 0;
                text-align: center;
            }}
            .chart h3 {{
                color: #8b5cf6;
                font-size: 18px;
                margin-bottom: 10px;
            }}
            .chart img {{
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .footer {{
                background: #f9fafb;
                padding: 20px;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Daily Business Intelligence Report</h1>
                <p>{today}</p>
            </div>
            <div class="content">
                <div class="greeting">
                    <strong>Hello {user_name},</strong>
                    <p>Your automated daily report is ready with comprehensive insights and visualizations.</p>
                </div>
                
                <h2 style="color: #8b5cf6;">📈 Key Visualizations</h2>
                
                <div class="chart">
                    <h3>Sales by Region</h3>
                    <img src="cid:sales_by_region" alt="Sales by Region">
                </div>
                
                <div class="chart">
                    <h3>Quarterly Performance</h3>
                    <img src="cid:quarterly_performance" alt="Quarterly Performance">
                </div>
                
                <div class="chart">
                    <h3>Product Performance</h3>
                    <img src="cid:product_performance" alt="Product Performance">
                </div>
                
                <div class="chart">
                    <h3>Marketing ROI</h3>
                    <img src="cid:marketing_roi" alt="Marketing ROI">
                </div>
                
                <div class="chart">
                    <h3>Channel Performance</h3>
                    <img src="cid:channel_performance" alt="Channel Performance">
                </div>
            </div>
            <div class="footer">
                <p>This is an automated report from <strong>Briefly AI</strong></p>
                <p>© {datetime.now().year} Briefly AI. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html


if __name__ == "__main__":
    print("🧪 Testing HTML email with visualizations...")
    print("=" * 60)
    
    # Show current settings
    settings = get_user_settings()
    if settings:
        print(f"📧 Recipient: {settings.get('recipient_email')}")
        print(f"👤 User Name: {settings.get('user_name')}")
        print(f"🔔 Notifications: {settings.get('notifications_enabled')}")
    else:
        print("⚠️  No user settings found, using defaults")
    
    print("=" * 60)
    
    # Test with existing demo reports
    report_files = [
        "demo_sales_north_america.txt",
        "demo_marketing_q2_2024.txt",
        "demo_product_cloud_storage.txt"
    ]
    
    # Generate charts first
    from Visualizations.visualizations import generate_all_charts
    chart_files = generate_all_charts()
    
    # Send email
    success = send_html_email_with_charts(report_files, chart_files)
    
    if success:
        print("\n✅ Test completed successfully!")
    else:
        print("\n❌ Test failed!")