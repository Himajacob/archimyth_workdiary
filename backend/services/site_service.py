from data_access.site_data_access import SiteDataAccess
from data_access.client_data_access import ClientDataAccess
from services.drive_service import DriveService
from services.google_token_service import get_valid_credentials
from fastapi import Request


class SiteService:
    def __init__(self, db):
        self.db = db
        self.site_da = SiteDataAccess(db)
        self.client_da = ClientDataAccess(db)

    def create_site(self, request: Request, current_user, data: dict):
        if current_user.role != "admin":
            raise PermissionError("Only admins can create sites")

        client = self.client_da.get_client_by_id(data.get("client_id"))
        if not client:
            raise ValueError("Invalid client")
        
        if not client.is_active:
            raise ValueError(
                "Cannot create site for inactive client"
            )

        project_name = data.get("project_name")
        location = data.get("location")

        if not project_name or not project_name.strip():
            raise ValueError("Project name is required")

        if not location or not location.strip():
            raise ValueError("Location is required")

        duration_days = data.get("duration_days")
        if duration_days is not None and duration_days <= 0:
            raise ValueError("Duration must be positive")

        creds = get_valid_credentials()
        if not creds:
            raise ValueError("Google Drive not connected")

        drive = DriveService(creds)

        safe_client = client.name.replace(" ", "_")
        safe_site = project_name.strip().replace(" ", "_")

        folder_name = f"{safe_client}_{safe_site}"

        folder_id = drive.create_folder(
            folder_name,
            drive.root_folder_id
        )

        site_data = {
            "client_id": data["client_id"],
            "project_name": project_name.strip(),
            "location": location.strip(),
            "start_date": data["start_date"],
            "duration_days": duration_days,
            "status": "in_progress",
            "created_by": current_user.id,
            "updated_by": current_user.id,
            "drive_folder_id": folder_id
        }

        site = self.site_da.create_site(site_data)

        return site

    def get_sites(self, current_user, show_inactive: bool = False):
        if current_user.role not in [
            "admin",
            "site_manager"
        ]:
            raise PermissionError(
                "Not allowed to view sites"
            )

        if show_inactive:
            return self.site_da.get_all_sites()

        return self.site_da.get_active_sites()
    
    def update_site(self, current_user, site_id: int, data: dict):

        if current_user.role != "admin":
            raise PermissionError(
                "Only admins can update sites"
            )

        site = self.site_da.get_site_by_id(
            site_id
        )

        if not site:
            raise ValueError(
                "Site not found"
            )

        project_name = data.get(
            "project_name"
        )

        location = data.get(
            "location"
        )

        if not project_name or not project_name.strip():
            raise ValueError(
                "Project name required"
            )

        if not location or not location.strip():
            raise ValueError(
                "Location required"
            )
        
        client = self.client_da.get_client_by_id(site.client_id)

        if not client:
            raise ValueError(
                "Client not found"
            )

        if client.is_active is False:
            raise ValueError(
                "Cannot update site because client is inactive"
            )

        update_data = {
            "project_name":
                project_name.strip(),

            "location":
                location.strip(),

            "status":
                data.get("status"),

            "duration_days":
                data.get("duration_days"),

            "is_active":
                data.get("is_active"),

            "updated_by":
                current_user.id
        }

        return self.site_da.update_site(
            site,
            update_data
        )
    
    def get_sites_by_client(self, current_user, client_id: int, show_inactive: bool = False):

        if current_user.role not in [
            "admin",
            "site_manager"
        ]:
            raise PermissionError(
                "Not allowed"
            )

        client = self.client_da.get_client_by_id(
            client_id
        )

        if not client:
            raise ValueError(
                "Client not found"
            )

        sites = self.site_da.get_sites_by_client(
            client_id
        )

        if not show_inactive:
            sites = [
                s for s in sites
                if s.is_active
            ]

        return sites