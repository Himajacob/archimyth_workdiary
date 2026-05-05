import os
import uuid
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload


class DriveService:
    def __init__(self, credentials):
        self.service = build('drive', 'v3', credentials=credentials)

        self.root_folder_id = os.getenv("GOOGLE_DRIVE_FOLDER_ID")
        if not self.root_folder_id:
            raise ValueError("GOOGLE_DRIVE_FOLDER_ID not set")

    def create_folder(self, name: str, parent_id: str) -> str:
        file_metadata = {
            "name": name,
            "mimeType": "application/vnd.google-apps.folder",
            "parents": [parent_id]
        }

        folder = self.service.files().create(
            body=file_metadata,
            fields="id"
        ).execute()

        return folder.get("id")

    def upload_work_entry_file(
        self,
        file,
        filename: str,
        content_type: str,
        folder_id: str,
        entry_date: str,
        work_type: str | None,
        item_id: int
    ) -> str:

        ext = filename.split(".")[-1] if "." in filename else "jpg"
        unique = uuid.uuid4().hex[:6]

        safe_work_type = (work_type or "general").replace(" ", "_")

        final_name = f"{entry_date}_{safe_work_type}_{item_id}_{unique}.{ext}"

        file_metadata = {
            "name": final_name,
            "parents": [folder_id]
        }

        media = MediaIoBaseUpload(file, mimetype=content_type)

        uploaded_file = self.service.files().create(
            body=file_metadata,
            media_body=media,
            fields="id"
        ).execute()

        file_id = uploaded_file.get("id")

        self.service.permissions().create(
            fileId=file_id,
            body={"type": "anyone", "role": "reader"}
        ).execute()

        return f"https://drive.google.com/uc?id={file_id}"