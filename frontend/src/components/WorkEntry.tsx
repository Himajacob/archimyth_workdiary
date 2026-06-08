import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
} from "react-router-dom";

import {
  FiPlus,
  FiSave,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import { getToken } from "../utils/auth";

import { getSites } from "../api/site";
import { getWorkTypes } from "../api/workType";

import {
  getWorkEntry,
  saveWorkEntry,
  deleteWorkEntry,
  deleteWorkEntryItem,
} from "../api/workEntry";

import {
  uploadPhoto,
  deletePhoto,
} from "../api/workEntryPhoto";

import WorkEntryRow from "../components/WorkEntryRow";
import WorkEntryCalendar from "../components/WorkEntryCalendar";
import CustomSelect from "../components/ui/CustomSelect";
import ConfirmDialog from "../components/ui/ConfirmDialog";

type Errors = {
  date: boolean;
  site: boolean;
  rows: boolean[];
};

type Toast = {
  type: "success" | "error";
  text: string;
} | null;

const emptyRow = () => ({
  work_type_id: "",
  workers_count: 0,
  remarks: "",
  photos: [],
});

export default function WorkEntry() {

  const { siteId: routeSiteId } = useParams();

  const [sites, setSites]       = useState<any[]>([]);
  const [workTypes, setWorkTypes] = useState<any[]>([]);
  const [siteId, setSiteId]     = useState<number | null>(
    routeSiteId ? Number(routeSiteId) : null
  );
  const [date, setDate]         = useState("");
  const [rows, setRows]         = useState<any[]>([emptyRow()]);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<Toast>(null);
  const [entryMeta, setEntryMeta] = useState<{ createdBy: string | null; updatedBy: string | null } | null>(null);

  const [errors, setErrors] = useState<Errors>({
    date: false,
    site: false,
    rows: [false],
  });

  const currentSite = sites.find((s) => s.id === siteId);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // -----------------------------------
  // Load Initial Data
  // -----------------------------------

  useEffect(() => {
    setSiteId(routeSiteId ? Number(routeSiteId) : null);
  }, [routeSiteId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const [s, wt] = await Promise.all([
          getSites(token),
          getWorkTypes(token, true),
        ]);
        setSites(s);
        setWorkTypes(wt);
      } catch (err: any) {
        setToast({ type: "error", text: err.message });
      }
    };
    fetchData();
  }, []);

  // -----------------------------------
  // Load Existing Entry
  // -----------------------------------

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const token = getToken();
        if (!token || !siteId || !date) return;
        const data = await getWorkEntry(token, siteId, date);
        if (!data) {
          setRows([emptyRow()]);
          setEntryMeta(null);
          return;
        }
        setRows(data.items.map((item: any) => ({ ...item, photos: item.photos || [] })));
        setEntryMeta({
          createdBy: data.created_by_name ?? null,
          updatedBy: data.updated_by_name ?? null,
        });
      } catch {
        setRows([emptyRow()]);
        setEntryMeta(null);
      }
    };
    fetchEntry();
  }, [siteId, date]);

  // -----------------------------------
  // Validation
  // -----------------------------------

  const validate = (): boolean => {
    const newErrors: Errors = {
      date: !date,
      site: !siteId,
      rows: rows.map((r) => !r.work_type_id || !r.remarks?.trim()),
    };
    setErrors(newErrors);
    return !newErrors.date && !newErrors.site && !newErrors.rows.some(Boolean);
  };

  // -----------------------------------
  // Row helpers
  // -----------------------------------

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
    setErrors((prev) => ({ ...prev, rows: [...prev.rows, false] }));
  };

  const updateRow = (index: number, field: string, value: any) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Only CLEAR a row error once both required fields are filled — never set new errors here
    if (field === "work_type_id" || field === "remarks") {
      setErrors((prev) => {
        if (!prev.rows[index]) return prev; // no error showing — nothing to do
        const currentRow = rows[index] ?? {};
        const updatedRow = { ...currentRow, [field]: value };
        const stillInvalid = !updatedRow.work_type_id || !updatedRow.remarks?.trim();
        const rowErrors = [...prev.rows];
        rowErrors[index] = stillInvalid;
        return { ...prev, rows: rowErrors };
      });
    }
  };

  // -----------------------------------
  // Photo Upload / Delete
  // -----------------------------------

  const [uploadingRow, setUploadingRow] = useState<number | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<Record<number, string>>({});

  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const withConfirm = (message: string, action: () => void) => {
    setConfirm({ message, onConfirm: action });
  };

  const handlePhotoUpload = async (rowIndex: number, itemId: number, files: File[]) => {
    try {
      const token = getToken();
      if (!token) return;
      setUploadingRow(rowIndex);
      setUploadingCount(files.length);
      const results = await Promise.all(files.map((f) => uploadPhoto(token, itemId, f)));
      setRows((prev) => {
        const updated = [...prev];
        updated[rowIndex].photos = [...(updated[rowIndex].photos || []), ...results];
        return updated;
      });
      setSelectedFiles((prev) => ({ ...prev, [rowIndex]: "" }));
      setToast({ type: "success", text: `${files.length} photo${files.length > 1 ? "s" : ""} uploaded` });
    } catch (err: any) {
      setToast({ type: "error", text: err.message });
    } finally {
      setUploadingRow(null);
      setUploadingCount(0);
    }
  };

  const handleDeletePhoto = async (rowIndex: number, photoIndex: number) => {
    try {
      const token = getToken();
      if (!token) return;
      const photo = rows[rowIndex].photos[photoIndex];
      await deletePhoto(token, photo.id);
      setRows((prev) => {
        const updated = [...prev];
        updated[rowIndex].photos = updated[rowIndex].photos.filter(
          (_: any, i: number) => i !== photoIndex
        );
        return updated;
      });
    } catch (err: any) {
      setToast({ type: "error", text: err.message });
    }
  };

  // -----------------------------------
  // Delete Row / Entry
  // -----------------------------------

  const handleDeleteRow = async (itemId: number) => {
    try {
      const token = getToken();
      if (!token) return;
      await deleteWorkEntryItem(token, itemId);
      setRows((prev) => prev.filter((r) => r.id !== itemId));
    } catch (err: any) {
      setToast({ type: "error", text: err.message });
    }
  };

  const handleDeleteEntry = async () => {
    try {
      const token = getToken();
      if (!token || !siteId || !date) return;
      const entry = await getWorkEntry(token, siteId, date);
      if (!entry?.id) return;
      await deleteWorkEntry(token, entry.id);
      setRows([emptyRow()]);
      setToast({ type: "success", text: "Entry deleted" });
    } catch (err: any) {
      setToast({ type: "error", text: err.message });
    }
  };

  // -----------------------------------
  // Save Entry
  // -----------------------------------

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      const token = getToken();
      if (!token) return;

      await saveWorkEntry(token, {
        site_id: siteId,
        entry_date: date,
        items: rows.map((r) => ({
          work_type_id: r.work_type_id,
          workers_count: r.workers_count,
          remarks: r.remarks,
        })),
      });

      const data = await getWorkEntry(token, siteId!, date);
      if (data) {
        setRows(data.items.map((item: any) => ({ ...item, photos: item.photos || [] })));
        setEntryMeta({
          createdBy: data.created_by_name ?? null,
          updatedBy: data.updated_by_name ?? null,
        });
      }

      setToast({ type: "success", text: "Entry saved successfully" });

    } catch (err: any) {
      setToast({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

      {/* LEFT COLUMN — Calendar */}
      <div className="h-fit rounded-3xl border border-[#E8E5DF] bg-white p-6 shadow-sm">

        <div className="mb-5">
          <h3 className="text-xl font-semibold text-[#1E1E1E]">Work Diary</h3>
          <p className="mt-1 text-sm text-gray-500">Select work entry date</p>
        </div>

        <WorkEntryCalendar date={date} setDate={(d: string) => {
          setDate(d);
          if (d) setErrors((p) => ({ ...p, date: false }));
        }} />

        {/* Selected date display */}
        <div
          className={`
            mt-5 rounded-2xl px-4 py-3 transition-colors duration-200
            ${errors.date ? "bg-red-50 ring-1 ring-red-300 animate-shake" : "bg-[#F8F6F2]"}
          `}
        >
          <p className={`text-xs uppercase tracking-wider ${errors.date ? "text-red-400" : "text-gray-400"}`}>
            Selected Date
          </p>
          <p className={`mt-1 text-sm font-semibold ${errors.date ? "text-red-500" : "text-[#1E1E1E]"}`}>
            {date || "No date selected"}
          </p>
          {errors.date && (
            <p className="mt-1 animate-slide-up text-xs text-red-500">
              Please select a date
            </p>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#1E1E1E]">Work Diary</h2>
            <p className="mt-1.5 text-gray-500">Track and manage daily site activities</p>
          </div>
          <button
            onClick={() =>
              withConfirm(
                "This will permanently delete the entire work entry for this date.",
                handleDeleteEntry
              )
            }
            className="
              self-start rounded-2xl bg-red-50 px-5 py-2.5
              text-sm text-red-500 transition-all hover:bg-red-100
            "
          >
            Delete Entry
          </button>
        </div>

        {/* Site Selector */}
        <div
          className={`
            rounded-3xl border bg-white p-6 shadow-sm
            transition-colors duration-200
            ${errors.site ? "border-red-300" : "border-[#E8E5DF]"}
          `}
        >
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Site
            <span className="ml-0.5 text-red-400">*</span>
          </label>

          {currentSite && (
            <p className="mb-3 text-base font-semibold text-[#1E1E1E]">
              {currentSite.project_name}
            </p>
          )}

          <CustomSelect
            disabled={!!routeSiteId}
            value={siteId || ""}
            onChange={(val) => {
              setSiteId(val ? Number(val) : null);
              if (val) setErrors((p) => ({ ...p, site: false }));
            }}
            placeholder="Select site…"
            hasError={errors.site}
            options={sites.map((s) => ({ value: s.id, label: s.project_name }))}
          />

          {errors.site && (
            <p className="mt-1.5 animate-slide-up text-xs text-red-500">
              Please select a site
            </p>
          )}
        </div>

        {/* Entry audit info */}
        {entryMeta && (entryMeta.createdBy || entryMeta.updatedBy) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-2xl bg-[#F8F6F2] px-5 py-3 text-xs text-gray-500">
            {entryMeta.createdBy && (
              <span>Created by <span className="font-medium text-[#1E1E1E]">{entryMeta.createdBy}</span></span>
            )}
            {entryMeta.updatedBy && entryMeta.updatedBy !== entryMeta.createdBy && (
              <span>Last updated by <span className="font-medium text-[#1E1E1E]">{entryMeta.updatedBy}</span></span>
            )}
          </div>
        )}

        {/* Work Item Rows */}
        <div className="space-y-5">
          {rows.map((row, index) => (
            <WorkEntryRow
              key={row.id || `new-${index}`}
              row={row}
              index={index}
              workTypes={workTypes}
              uploadingRow={uploadingRow}
              uploadingCount={uploadingCount}
              selectedFiles={selectedFiles}
              updateRow={updateRow}
              handleDeleteRow={(itemId: number) =>
                withConfirm(
                  "This will permanently delete this work item and its photos.",
                  () => handleDeleteRow(itemId)
                )
              }
              handlePhotoUpload={handlePhotoUpload}
              handleDeletePhoto={(rowIndex: number, photoIndex: number) =>
                withConfirm(
                  "This will permanently delete this photo.",
                  () => handleDeletePhoto(rowIndex, photoIndex)
                )
              }
              setSelectedFiles={setSelectedFiles}
              hasError={errors.rows[index]}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={addRow}
            className="
              flex items-center gap-2 rounded-2xl
              border border-[#D9C7A6] bg-white
              px-6 py-3 text-sm text-[#1E1E1E]
              transition-all hover:bg-[#F8F6F2]
            "
          >
            <FiPlus size={15} />
            Add New Entry
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="
              flex items-center gap-2 rounded-2xl
              bg-[#D9C7A6] px-6 py-3 text-sm font-medium text-[#1E1E1E]
              transition-all hover:scale-[1.02]
              disabled:opacity-60 disabled:hover:scale-100
            "
          >
            {saving ? (
              <>
                <FiLoader size={15} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <FiSave size={15} />
                Save Entry
              </>
            )}
          </button>
        </div>

      </div>


      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={() => {
            confirm.onConfirm();
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`
            fixed bottom-6 left-1/2 z-50 -translate-x-1/2
            flex items-center gap-2.5 rounded-2xl px-5 py-3.5
            text-sm font-medium shadow-xl animate-slide-up
            ${toast.type === "success"
              ? "bg-[#1E1E1E] text-white"
              : "bg-red-600 text-white"
            }
          `}
        >
          {toast.type === "success"
            ? <FiCheckCircle size={16} />
            : <FiAlertCircle size={16} />
          }
          {toast.text}
        </div>
      )}

    </div>
  );
}
