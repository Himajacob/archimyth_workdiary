import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

from pathlib import Path
import os

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

TOKEN_FILE = BASE_DIR / "google_token.json"

SCOPES = ["https://www.googleapis.com/auth/drive"]


def save_credentials(creds: Credentials):
    with open(TOKEN_FILE, "w") as f:
        f.write(creds.to_json())


def load_credentials() -> Credentials | None:
    try:
        with open(TOKEN_FILE, "r") as f:
            data = json.load(f)
            return Credentials.from_authorized_user_info(data, SCOPES)
    except Exception as e:
        print("Google credential error:", e)
        return None

def get_valid_credentials() -> Credentials:
    creds = load_credentials()

    if not creds:
        raise Exception("Google not authenticated")

    if creds.expired and creds.refresh_token:
        try:
            creds.refresh(Request())
            save_credentials(creds)
        except Exception as e:
            print("Refresh error:", e)
            raise

    return creds