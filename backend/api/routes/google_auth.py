from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from services.google_token_service import save_credentials
import os

router = APIRouter()

BACKEND_URL = os.getenv("BACKEND_URL")
GOOGLE_OAUTH_CREDENTIALS_FILE = os.getenv("GOOGLE_OAUTH_CREDENTIALS_FILE")

SCOPES = ["https://www.googleapis.com/auth/drive"]
REDIRECT_URI = f"{BACKEND_URL}/auth/google/callback"


def create_flow(state=None):
    return Flow.from_client_secrets_file(
        GOOGLE_OAUTH_CREDENTIALS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
        state=state
    )


@router.get("/auth/google/login")
def login(request: Request):

    flow = create_flow()

    auth_url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent"
    )

    print("SETTING STATE:", state)
    print("CODE VERIFIER:", flow.code_verifier)

    request.session["oauth_state"] = state
    request.session["code_verifier"] = flow.code_verifier

    return RedirectResponse(auth_url, status_code=303)

@router.get("/auth/google/callback")
async def callback(request: Request):

    state = request.session.get("oauth_state")
    code_verifier = request.session.get("code_verifier")

    print("SESSION STATE:", state)
    print("CODE VERIFIER:", code_verifier)

    flow = Flow.from_client_secrets_file(
        GOOGLE_OAUTH_CREDENTIALS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
        state=state
    )

    flow.code_verifier = code_verifier

    flow.fetch_token(
        authorization_response=str(request.url)
    )

    creds = flow.credentials

    save_credentials(creds)

    request.session.pop("oauth_state", None)
    request.session.pop("code_verifier", None)

    return {"message": "Google Drive connected successfully"}