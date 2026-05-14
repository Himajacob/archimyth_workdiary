from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt", "argon2"],
    default="bcrypt",
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    valid, new_hash = pwd_context.verify_and_update(plain_password, hashed_password)
    return valid, new_hash