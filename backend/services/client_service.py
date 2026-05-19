from database.models.client import Client
from data_access.client_data_access import ClientDataAccess
from data_access.site_data_access import SiteDataAccess

class ClientService:
    def __init__(self, db):
        self.client_da = ClientDataAccess(db)
        self.site_da = SiteDataAccess(db)

    def get_clients(self, current_user, show_inactive: bool = False):
        if current_user.role.name not in ["admin", "super_admin", "site_manager"]:
            raise PermissionError(
                "Not allowed"
            )

        if show_inactive:
            return self.client_da.get_all_clients()

        return self.client_da.get_active_clients()
    
    def create_client(self, current_user, data: dict) -> Client:

        if current_user.role.name not in ["admin", "super_admin"]:
            raise PermissionError("Only admins can create clients")

        name = data.get("name")
        contact_number = data.get("contact_number")

        if not name or not name.strip():
            raise ValueError("Client name is required")

        if not contact_number or not contact_number.strip():
            raise ValueError("Contact number is required")

        name = name.strip()
        contact_number = contact_number.strip()

        existing = self.client_da.get_by_name_and_contact(name, contact_number)
        if existing:
            raise ValueError("Client already exists with same name and contact number")

        client_data = {
            "name": name,
            "address": data.get("address"),
            "contact_number": contact_number,
            "created_by": current_user.id,
            "updated_by": current_user.id
        }

        return self.client_da.create_client(client_data)
    
    def update_client(self, current_user, client_id: int, data: dict):

        if current_user.role.name not in ["admin", "super_admin"]:
            raise PermissionError(
                "Only admins allowed"
            )

        client = self.client_da.get_client_by_id(
            client_id
        )

        if not client:
            raise ValueError(
                "Client not found"
            )

        name = data.get("name")

        if not name or not name.strip():
            raise ValueError(
                "Name required"
            )

        update_data = {
            "name":
                name.strip(),

            "contact_number":
                data.get("contact_number"),

            "address":
                data.get("address"),

            "is_active":
                data.get("is_active"),

            "updated_by":
                current_user.id
        }

        updated_client = self.client_da.update_client(client, update_data)

        if updated_client.is_active is False:

            self.site_da.deactivate_sites_by_client(
                updated_client.id
            )

        return updated_client