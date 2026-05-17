from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.client import CreateClientRequest
from services.client_service import ClientService
from data_access.client_data_access import ClientDataAccess

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
    show_inactive: bool = False,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = ClientService(db)

    try:

        clients = service.get_clients(
            current_user,
            show_inactive
        )

        return [
            {
                "id": c.id,
                "name": c.name,
                "contact_number":
                    c.contact_number,
                "address":
                    c.address,
                "is_active":
                    c.is_active
            }
            for c in clients
        ]

    except PermissionError:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

@router.get("/{client_id}")
def get_client(
    client_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["admin", "site_manager"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    client_da = ClientDataAccess(db)
    client = client_da.get_client_by_id(client_id)

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    return {
        "id": client.id,
        "name": client.name,
        "contact_number": client.contact_number,
        "address": client.address,
        "is_active": client.is_active
    }


@router.patch("/{client_id}")
def update_client(
    client_id: int,
    data: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = ClientService(db)

    try:

        return service.update_client(
            current_user,
            client_id,
            data
        )

    except PermissionError:

        raise HTTPException(
            status_code=403,
            detail="Only admins allowed"
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )