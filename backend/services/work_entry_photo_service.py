from fastapi import Request
from services.drive_service import DriveService

from data_access.work_entry_photo_data_access import WorkEntryPhotoDataAccess
from data_access.work_entry_item_data_access import WorkEntryItemDataAccess
from data_access.work_entry_data_access import WorkEntryDataAccess
from data_access.site_data_access import SiteDataAccess
from services.google_token_service import GoogleTokenService
from data_access.work_type_data_access import WorkTypeDataAccess


class WorkEntryPhotoService:
    def __init__(self, db):
        self.db = db
        self.photo_da = WorkEntryPhotoDataAccess(db)
        self.item_da = WorkEntryItemDataAccess(db)
        self.entry_da = WorkEntryDataAccess(db)
        self.site_da = SiteDataAccess(db)
        self.google_service = GoogleTokenService(db)
        self.work_type_da = WorkTypeDataAccess(db)

   
    def upload_photo(self, request: Request, current_user, work_entry_item_id, file):

        item = self.item_da.get_item_by_id(work_entry_item_id)
        if not item:
            raise ValueError("Invalid work entry item")
        
        entry = self.entry_da.get_work_entry_by_id(item.work_entry_id)
        if not entry:
            raise ValueError("Work entry not found")
        
        type = self.work_type_da.get_work_type_by_id(item.work_type_id)

        creds = self.google_service.get_valid_credentials()
        if not creds:
            raise ValueError("Google Drive not connected")
        
        site = self.site_da.get_site_by_id(entry.site_id)
        if not site:
            raise ValueError("Site not found")

        drive = DriveService(creds)

        folder_id = site.drive_folder_id
        if not folder_id:
            raise ValueError("Drive folder not configured for this site")

        file_url = drive.upload_work_entry_file(
            file=file.file,
            filename=file.filename,
            content_type=file.content_type,
            folder_id=folder_id,
            entry_date=str(entry.entry_date),
            work_type=type.name if type and type.name else None,
            item_id=item.id
        )

        photo_data = {
            "work_entry_id": work_entry_item_id,
            "photo_url": file_url,
            "created_by": current_user.id,
            "updated_by": current_user.id
        }

        photo = self.photo_da.create_photo(photo_data)

        return photo

   
    def extract_file_id(self, photo_url: str) -> str | None:
        if not photo_url:
            return None

        if "/d/" in photo_url:
            return photo_url.split("/d/")[1]

        return None

 
    def delete_photo(self, current_user, photo_id: int):

        photo = self.photo_da.get_photo_by_id(photo_id)
        if not photo:
            raise ValueError("Photo not found")

        file_id = self.extract_file_id(photo.photo_url)

        if file_id:
            try:
                creds = get_valid_credentials()
                drive = DriveService(creds)

                drive.delete_file(file_id)

            except Exception as e:
                print("Drive delete failed:", e)

        self.photo_da.delete_photo(photo)

        return {"message": "Photo deleted"}

    def delete_photos_by_item(self, work_entry_item_id: int):

        photos = self.photo_da.get_photos_by_work_entry(work_entry_item_id)

        for photo in photos:

            file_id = self.extract_file_id(photo.photo_url)

            if file_id:
                try:
                    creds = get_valid_credentials()

                    if creds:
                        drive = DriveService(creds)
                        drive.delete_file(file_id)

                except Exception as e:
                    print("Drive delete failed:", e)

            self.photo_da.delete_photo(photo)
    

    def get_site_gallery(self, site_id: int):

        entries = self.entry_da.get_entries_by_site(site_id)

        gallery = []

        for entry in entries:

            items = self.item_da.get_items_by_work_entry(entry.id)

            entry_photos = []

            for item in items:

                photos = self.photo_da.get_photos_by_work_entry(item.id)

                for photo in photos:

                    work_type = None

                    if item.work_type_id:
                        wt = self.work_type_da.get_work_type_by_id(
                            item.work_type_id
                        )

                        work_type = wt.name if wt else None

                    entry_photos.append({
                        "id": photo.id,
                        "photo_url": photo.photo_url,
                        "work_type": work_type,
                        "remarks": item.remarks,
                        "uploaded_at": photo.uploaded_at
                    })

            if entry_photos:

                gallery.append({
                    "entry_date": entry.entry_date,
                    "photos": entry_photos
                })

        return gallery