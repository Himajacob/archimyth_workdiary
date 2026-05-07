from database.models.work_type import WorkType
from data_access.work_type_data_access import WorkTypeDataAccess


class WorkTypeService:
    def __init__(self, db):
        self.da = WorkTypeDataAccess(db)

    def create_work_type(self, current_user, data: dict) -> WorkType:
        if current_user.role != "admin":
            raise PermissionError("Only admins can create work types")

        name = data.get("name")

        if not name or not name.strip():
            raise ValueError("Work type name is required")

        name = name.strip()

        existing = self.da.get_work_type_by_name(name)
        if existing:
            raise ValueError("Work type already exists")

        wt_data = {
            "name": name,
            "created_by": current_user.id,
            "updated_by": current_user.id
        }

        return self.da.create_work_type(wt_data)

    def get_work_types(self, current_user, show_inactive: bool = False):
        if current_user.role not in ["admin", "site_manager"]:
            raise PermissionError("Not allowed")

        if show_inactive:
            return self.da.get_all_work_types()

        return self.da.get_active_work_types()
        
    def activate_work_type(self, current_user, work_type_id: int):
        if current_user.role != "admin":
            raise PermissionError("Only admins can activate work types")

        wt = self.da.get_work_type_by_id(work_type_id)

        if not wt:
            raise ValueError("Work type not found")

        if wt.is_active:
            raise ValueError("Work type already active")

        wt.updated_by = current_user.id

        return self.da.activate_work_type(wt)
    
    def deactivate_work_type(self, current_user, work_type_id: int):
        if current_user.role != "admin":
            raise PermissionError("Only admins can deactivate work types")

        wt = self.da.get_work_type_by_id(work_type_id)

        if not wt:
            raise ValueError("Work type not found")

        if not wt.is_active:
            raise ValueError("Work type already inactive")

        wt.updated_by = current_user.id

        return self.da.deactivate_work_type(wt)
