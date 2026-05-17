from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

import os

from api.routes import auth, client, site, users, work_entry, work_entry_photo
from api.dependencies.db import get_db
# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

SESSION_SECRET = os.getenv("SESSION_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")

from api.routes import work_type
from api.routes.google_auth import router as google_auth_router
app = FastAPI()
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(users.router) 
app.include_router(client.router)
app.include_router(site.router)
app.include_router(work_type.router)
app.include_router(work_entry.router)
app.include_router(work_entry_photo.router)
app.include_router(google_auth_router)
@app.get("/")
def root():
    return {"message": "API running"}

@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}