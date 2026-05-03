from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import auth, users, client, site

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(users.router) 
app.include_router(client.router)
app.include_router(site.router)


@app.get("/")
def root():
    return {"message": "API running"}