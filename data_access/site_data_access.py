from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.site import Site


class SiteDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def create_site(self, data: dict) -> Site:
        site = Site(**data)
        self.db.add(site)
        self.db.commit()
        self.db.refresh(site)
        return site

    def update_site(self, site: Site, data: dict) -> Site:
        for key, value in data.items():
            setattr(site, key, value)

        self.db.commit()
        self.db.refresh(site)
        return site

    def get_site_by_id(self, site_id: int) -> Site | None:
        result = self.db.execute(
            select(Site).where(Site.id == site_id)
        )
        return result.scalar_one_or_none()

    def get_sites_by_client(self, client_id: int):
        result = self.db.execute(
            select(Site).where(Site.client_id == client_id)
        )
        return result.scalars().all()


    def get_active_sites(self):
        result = self.db.execute(
            select(Site).where(Site.is_active == True)
        )
        return result.scalars().all()


    def activate_site(self, site: Site):
        site.is_active = True
        self.db.commit()
        self.db.refresh(site)
        return site


    def deactivate_site(self, site: Site):
        site.is_active = False
        self.db.commit()
        return site