from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.site import CreateSiteRequest
from services.site_service import SiteService
from fastapi import Request

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