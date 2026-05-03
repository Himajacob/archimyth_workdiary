from pydantic import BaseModel, EmailStr

class InviteUserRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr
    role: str
