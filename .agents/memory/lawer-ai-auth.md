---
name: Lawer-AI Auth
description: Password hashing approach for Lawer-AI; passlib is broken with bcrypt 5.x
---

## Rule
Use `bcrypt` library directly for password hashing, NOT `passlib[bcrypt]`.

## Implementation
```python
import bcrypt

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
```

**Why:** passlib 1.7.4 + bcrypt 5.x has an AttributeError on `__about__.__version__` and a ValueError on long passwords — incompatible versions in Replit's environment as of May 2026.
