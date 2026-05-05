import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

TOKEN_FILE = "google_token.json"

SCOPES = ["https://www.googleapis.com/auth/drive"]


def save_credentials(creds: Credentials):
    with open(TOKEN_FILE, "w") as f:
        f.write(creds.to_json())


def load_credentials() -> Credentials | None:
    try:
        with open(TOKEN_FILE, "r") as f:
            data = json.load(f)
            return Credentials.from_authorized_user_info(data, SCOPES)
    except:
        return None


def get_valid_credentials() -> Credentials:
    creds = load_credentials()

    if not creds:
        raise Exception("Google not authenticated")

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        save_credentials(creds)

    return creds