from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class RegisterUserRequest(BaseModel):
    token: str
    password: str = Field(min_length=6)