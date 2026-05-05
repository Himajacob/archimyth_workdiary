from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

import os
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


from api.routes import auth, users, client, site, work_type, work_entry, work_entry_photo
from api.routes.google_auth import router as google_auth_router
app = FastAPI()
app.add_middleware(
    SessionMiddleware,
    secret_key="super-secret-key-change-this"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   
        "http://127.0.0.1:5173",
        "http://localhost:8000"
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