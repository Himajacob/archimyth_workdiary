from pydantic import BaseModel, EmailStr, Field

class InviteUserRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr
    role: str

class RegisterUserRequest(BaseModel):
    token: str
    password: str = Field(min_length=6)