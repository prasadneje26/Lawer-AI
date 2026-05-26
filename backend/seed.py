"""Seed script to create demo users for testing."""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import engine, Base, SessionLocal
import models.db_models  # noqa: F401 — registers all ORM models
from models.db_models import User
from auth import get_password_hash

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        demo_users = [
            {
                "name": "Demo Lawyer",
                "email": "demo@lawer.ai",
                "password": "demo123",
                "role": "lawyer",
                "organization": "Demo Law Associates",
                "specialization": "Criminal",
                "experience_years": 5,
            },
            {
                "name": "Admin User",
                "email": "admin@lawer.ai",
                "password": "admin123",
                "role": "admin",
                "organization": "Lawer-AI Platform",
                "specialization": None,
                "experience_years": None,
            },
            {
                "name": "Adv. Priya Sharma",
                "email": "priya@lawer.ai",
                "password": "demo123",
                "role": "lawyer",
                "organization": "Sharma & Associates",
                "specialization": "Family",
                "experience_years": 8,
            },
        ]

        created = 0
        for u in demo_users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                user = User(
                    name=u["name"],
                    email=u["email"],
                    password_hash=get_password_hash(u["password"]),
                    role=u["role"],
                    organization=u["organization"],
                    specialization=u.get("specialization"),
                    experience_years=u.get("experience_years"),
                    is_active=True,
                )
                db.add(user)
                created += 1
                print(f"  Created: {u['name']} ({u['email']}) [{u['role']}]")
            else:
                print(f"  Exists:  {u['email']}")

        db.commit()
        print(f"\nSeed complete. {created} users created.")
        print("\nDemo credentials:")
        print("  Lawyer: demo@lawer.ai / demo123")
        print("  Admin:  admin@lawer.ai / admin123")
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding database...")
    seed()
