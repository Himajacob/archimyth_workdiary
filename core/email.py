import smtplib
from email.mime.text import MIMEText
import os


def send_invite_email(to_email: str, token: str):
    sender = os.getenv("EMAIL_USER")
    password = os.getenv("EMAIL_PASSWORD")

    register_link = f"http://localhost:5173/register?token={token}"

    subject = "You're invited!"
    body = f"""
    You have been invited to join the system.

    Click the link below to register:
    {register_link}

    This link will expire in 48 hours.
    """

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email

    try:
        server = smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT")))
        server.starttls()
        server.login(sender, password)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print("Email send failed:", e)

def send_reset_password_email(
    to_email: str,
    token: str
):

    sender = os.getenv("EMAIL_USER")
    password = os.getenv("EMAIL_PASSWORD")

    reset_link = (
        f"http://localhost:5173/reset-password?token={token}"
    )

    subject = "Reset Your Password"

    body = f"""
    You requested a password reset.

    Click the link below to reset your password:

    {reset_link}

    This link will expire in 48 hours.

    If you did not request this,
    please ignore this email.
    """

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email

    try:

        server = smtplib.SMTP(
            os.getenv("EMAIL_HOST"),
            int(os.getenv("EMAIL_PORT"))
        )

        server.starttls()

        server.login(sender, password)

        server.send_message(msg)

        server.quit()

    except Exception as e:

        print(
            "Reset email failed:",
            e
        )