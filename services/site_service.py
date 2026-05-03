from data_access.site_data_access import SiteDataAccess
from data_access.client_data_access import ClientDataAccess


class SiteService:
    def __init__(self, db):
        self.site_da = SiteDataAccess(db)
        self.client_da = ClientDataAccess(db)

    def create_site(self, current_user, data: dict) :
        if current_user.role != "admin":
            raise PermissionError("Only admins can create sites")

        client = self.client_da.get_client_by_id(data.get("client_id"))
        if not client:
            raise ValueError("Invalid client")

        project_name = data.get("project_name")
        location = data.get("location")

        if not project_name or not project_name.strip():
            raise ValueError("Project name is required")

        if not location or not location.strip():
            raise ValueError("Location is required")

        duration_days = data.get("duration_days")
        if duration_days is not None and duration_days <= 0:
            raise ValueError("Duration must be positive")

        site_data = {
            "client_id": data["client_id"],
            "project_name": project_name.strip(),
            "location": location.strip(),
            "start_date": data["start_date"],
            "duration_days": duration_days,
            "status": "in_progress", 
            "created_by": current_user.id,
            "updated_by": current_user.id
        }

        return self.site_da.create_site(site_data)

    def get_sites(self, current_user):
        if current_user.role not in ["admin", "site_manager"]:
            raise PermissionError("Not allowed to view sites")

        return self.site_da.get_active_sites()