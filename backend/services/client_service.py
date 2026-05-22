from database.models.client import Client
from data_access.client_data_access import ClientDataAccess
from data_access.site_data_access import SiteDataAccess
from data_access.user_data_access import UserDataAccess

class ClientService:
    def __init__(self, db):
        self.client_da = ClientDataAccess(db)
        self.site_da = SiteDataAccess(db)
        self.user_da = UserDataAccess(db)

    def _attach_user(self, client):
        user = self.user_da.get_user_by_client_id(client.id)
        return {
            "id": client.id,
            "name": client.name,
            "address": client.address,
            "contact_number": client.contact_number,
            "is_active": client.is_active,
            "login_user": {
                "id": user.id,
                "email": user.email,
                "is_active": user.is_active,
                "is_invited": user.is_invited,
            } if user else None,
        }

    def get_clients(self, current_user, show_inactive: bool = False):
        if current_user.role.name not in ["admin", "super_admin", "site_manager"]:
            raise PermissionError(
                "Not allowed"
            )

        clients = self.client_da.get_all_clients() if show_inactive else self.client_da.get_active_clients()
        return [self._attach_user(c) for c in clients]
    
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