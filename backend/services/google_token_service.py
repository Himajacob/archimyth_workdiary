import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from sqlalchemy.orm import Session
from backend.database.models.google_token import GoogleToken

from data_access.google_token_data_access import GoogleTokenDataAccess


SCOPES = ["https://www.googleapis.com/auth/drive"]


class GoogleTokenService:

    def __init__(self, db: Session):
        self.token_dal = GoogleTokenDataAccess(db)

    def save_credentials(self, creds: Credentials):

        self.token_dal.save_token(
            creds.to_json()
        )

    def load_credentials(self) -> Credentials | None:

        token_row = self.token_dal.get_token()

        if not token_row:
            return None

        try:
            data = json.loads(token_row.token_data)

            return Credentials.from_authorized_user_info(
                data,
                SCOPES
            )

        except Exception as e:
            print("Google credential error:", e)
            return None

    def get_valid_credentials(self) -> Credentials:

        creds = self.load_credentials()

        if not creds:
            raise Exception("Google not authenticated")

        if creds.expired and creds.refresh_token:

            try:
                creds.refresh(Request())

                # save refreshed token
                self.save_credentials(creds)

            except Exception as e:
                print("Refresh error:", e)
                raise

        return creds