from database.models.google_token import GoogleToken
from data_access.base_data_access import BaseDataAccess
from sqlalchemy.orm import Session

class GoogleTokenDataAccess(BaseDataAccess):

    def __init__(self, db: Session):
        super().__init__(db)

    def get_token(self):
        return self.db.query(GoogleToken).first()

    def save_token(self, token_json: str):
        token_row = self.get_token()

        if token_row:
            token_row.token_data = token_json
        else:
            token_row = GoogleToken(
                token_data=token_json
            )
            self.add(token_row)

        self.commit()

        return token_row