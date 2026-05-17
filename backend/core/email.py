import os
import requests

FRONTEND_URL = os.getenv("FRONTEND_URL")
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("EMAIL_USER", "am.projectdesk@gmail.com")
SENDER_NAME = "Archimyth"

def _send(to_email: str, subject: str, body: str):
    if not BREVO_API_KEY:
        print("Email not sent: BREVO_API_KEY not set")
        return
    try:
        resp = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
            },
            json={
                "sender": {"email": SENDER_EMAIL, "name": SENDER_NAME},
                "to": [{"email": to_email}],
                "subject": subject,
                "textContent": body,
            },
            timeout=10,
        )
        if not resp.ok:
            print("Email send failed:", resp.status_code, resp.text)
    except Exception as e:
        print("Email send failed:", e)


def send_invite_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/#/register?token={token}"
    _send(
        to_email=to_email,
        subject="You're invited to Archimyth",
        body=(
            f"You have been invited to join Archimyth.\n\n"
            f"Click the link below to set your password and complete registration:\n"
            f"{link}\n\n"
            f"This link will expire in 48 hours."
        ),
    )


def send_reset_password_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/#/reset-password?token={token}"
    _send(
        to_email=to_email,
        subject="Reset your Archimyth password",
        body=(
            f"You requested a password reset.\n\n"
            f"Click the link below to set a new password:\n"
            f"{link}\n\n"
            f"This link will expire in 48 hours.\n\n"
            f"If you did not request this, please ignore this email."
        ),
    )
