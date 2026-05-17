from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import select

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.site import CreateSiteRequest, SiteResponse
from services.site_service import SiteService
from database.models.client import Client

router = APIRouter(prefix="/sites", tags=["Sites"])




@router.post("/")
def create_site(
    request: Request,
    data: CreateSiteRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = SiteService(db)

    try:
        site = service.create_site(
            request=request,
            current_user=current_user,
            data=data.dict()
        )

        return {
            "id": site.id,
            "project_name": site.project_name,
            "location": site.location,
            "status": site.status
        }

    except PermissionError:
        raise HTTPException(status_code=403, detail="Only admins can create sites")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def get_sites(
    show_inactive: bool = False,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = SiteService(db)

    try:

        sites = service.get_sites(
            current_user,
            show_inactive
        )

        client_ids = {s.client_id for s in sites}
        clients = db.execute(
            select(Client).where(Client.id.in_(client_ids))
        ).scalars().all()
        client_names = {c.id: c.name for c in clients}

        return [
            {
                "id": s.id,
                "project_name":
                    s.project_name,

                "location":
                    s.location,

                "status":
                    s.status,

                "client_id":
                    s.client_id,

                "client_name":
                    client_names.get(s.client_id),

                "duration_days":
                    s.duration_days,

                "start_date":
                    s.start_date,

                "is_active":
                    s.is_active
            }
            for s in sites
        ]

    except PermissionError:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

@router.patch("/{site_id}")
def update_site(
    site_id: int,
    data: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = SiteService(db)

    try:

        return service.update_site(
            current_user,
            site_id,
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

@router.get(
    "/client/{client_id}",
    response_model=list[SiteResponse]
)
def get_sites_by_client(
    client_id: int,
    show_inactive: bool = False,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = SiteService(db)

    try:

        return service.get_sites_by_client(
            current_user,
            client_id,
            show_inactive
        )

    except PermissionError:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )