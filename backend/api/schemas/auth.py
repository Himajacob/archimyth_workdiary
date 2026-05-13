from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterUserRequest(BaseModel):
    token: str
    password: str = Field(min_length=6)