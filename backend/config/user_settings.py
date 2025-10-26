class EmailSettings:
    def __init__(self, recipient_email: str, user_name: str, notifications_enabled: bool):
        self.recipient_email = recipient_email
        self.user_name = user_name
        self.notifications_enabled = notifications_enabled

    def __repr__(self):
        return f"<EmailSettings recipient_email={self.recipient_email}, user_name={self.user_name}, notifications_enabled={self.notifications_enabled}>"


def load_email_settings() -> EmailSettings:
    return EmailSettings(
        recipient_email="tanishrajput9@gmail.com",
        user_name="Tanish Rajput",
        notifications_enabled=True
    )
