from database.models.client import Client
from data_access.client_data_access import ClientDataAccess

class ClientService:
    def __init__(self, db):
        self.client_da = ClientDataAccess(db)

    def get_clients(self, current_user):
        if current_user.role not in ["admin", "site_manager"]:
            raise PermissionError("Not allowed to view clients")
        return self.client_da.get_active_clients()
    
    def create_client(self, current_user, data: dict) -> Client:

        if current_user.role != "admin":
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

        return self.client_dao.create(client_data)