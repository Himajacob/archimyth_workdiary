from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.client import Client


class ClientDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def create_client(self, data: dict) -> Client:
        client = Client(**data)
        self.db.add(client)
        self.db.commit()
        self.db.refresh(client)
        return client

    def update_client(self, client: Client, data: dict) -> Client:
        for key, value in data.items():
            setattr(client, key, value)

        self.db.commit()
        self.db.refresh(client)
        return client

    def get_client_by_id(self, client_id: int) -> Client | None:
        result = self.db.execute(
            select(Client).where(Client.id == client_id)
        )
        return result.scalar_one_or_none()


    def get_all_clients(self):
        result = self.db.execute(select(Client))
        return result.scalars().all()


    def get_active_clients(self):
        result = self.db.execute(
            select(Client).where(Client.is_active == True)
        )
        return result.scalars().all()


    def activate_client(self, client: Client):
        client.is_active = True
        self.db.commit()
        self.db.refresh(client)
        return client


    def deactivate_client(self, client: Client):
        client.is_active = False
        self.db.commit()
        return client