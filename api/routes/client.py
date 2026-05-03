from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.client import CreateClientRequest
from services.client_service import ClientService

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.post("/")
def create_client(data: CreateClientRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ClientService(db)

    try:
        client = service.create_client(current_user, data.dict())

        return {
            "id": client.id,
            "name": client.name,
            "address": client.address,
            "contact_number": client.contact_number,
            "is_active": client.is_active,
            "created_at": client.created_at
        }

    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail="Only admins can create clients"
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        print("Create client error:", e)

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@router.get("/")
def get_clients(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ClientService(db)

    try:
        clients = service.get_clients(current_user)

        return [
            {
                "id": c.id,
                "name": c.name,
                "address": c.address,
                "contact_number": c.contact_number,
                "is_active": c.is_active
            }
            for c in clients
        ]

    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail="Not allowed to view clients"
        )

    except Exception as e:
        print("Get clients error:", e)

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )