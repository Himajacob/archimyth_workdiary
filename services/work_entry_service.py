from data_access.work_entry_data_access import WorkEntryDataAccess
from data_access.work_entry_item_data_access import WorkEntryItemDataAccess
from data_access.site_data_access import SiteDataAccess
from data_access.work_type_data_access import WorkTypeDataAccess


class WorkEntryService:
    def __init__(self, db):
        self.db = db
        self.entry_da = WorkEntryDataAccess(db)
        self.item_da = WorkEntryItemDataAccess(db)
        self.site_da = SiteDataAccess(db)
        self.work_type_da = WorkTypeDataAccess(db)

    def create_or_update_work_entry(self, current_user, data: dict):

        if current_user.role not in ["admin", "site_manager"]:
            raise PermissionError("Not allowed")

        site_id = data["site_id"]
        entry_date = data["entry_date"]
        items = data["items"]

        if not items:
            raise ValueError("At least one work item required")

        site = self.site_da.get_site_by_id(site_id)
        if not site:
            raise ValueError("Invalid site")

        entry = self.entry_da.get_by_site_and_date(site_id, entry_date)

        if not entry:
            entry = self.entry_da.create_work_entry({
                "site_id": site_id,
                "entry_date": entry_date,
                "created_by": current_user.id,
                "updated_by": current_user.id
            })
        else:
            entry.updated_by = current_user.id

        existing_items = self.item_da.get_items_by_work_entry(entry.id)

        existing_map = {
            item.work_type_id: item for item in existing_items
        }

        for item in items:
            wt_id = item.get("work_type_id")

            if wt_id is not None:
                wt = self.work_type_da.get_work_type_by_id(wt_id)
                if not wt:
                    raise ValueError(f"Invalid work type: {wt_id}")

            if item["workers_count"] < 0:
                raise ValueError("Workers count must be >= 0")

            existing_item = existing_map.get(wt_id)

            if existing_item:
                self.item_da.update_item(existing_item, {
                    "workers_count": item["workers_count"],
                    "remarks": item.get("remarks"),
                    "updated_by": current_user.id
                })
            else:
                self.item_da.create_item({
                    "work_entry_id": entry.id,
                    "work_type_id": wt_id,
                    "workers_count": item["workers_count"],
                    "remarks": item.get("remarks"),
                    "created_by": current_user.id,
                    "updated_by": current_user.id
                })

        return entry