import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { getSites } from "../api/site";
import { getWorkTypes } from "../api/workType";
import { getWorkEntry, saveWorkEntry } from "../api/workEntry";
import { uploadPhoto } from "../api/workEntryPhoto";

export default function WorkEntry() {
  const [sites, setSites] = useState<any[]>([]);
  const [workTypes, setWorkTypes] = useState<any[]>([]);

  const [siteId, setSiteId] = useState<number | null>(null);
  const [date, setDate] = useState("");

  const [rows, setRows] = useState<any[]>([
    { work_type_id: "", workers_count: 0, remarks: "" }
  ]);

  const [photos, setPhotos] = useState<Record<number, string[]>>({});

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const s = await getSites(token);
        const wt = await getWorkTypes(token);

        setSites(s);
        setWorkTypes(wt);
      } catch (err: any) {
        setMessage(err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const token = getToken();
        if (!token || !siteId || !date) return;

        const data = await getWorkEntry(token, siteId, date);

        if (!data) {
          setRows([
            { work_type_id: "", workers_count: 0, remarks: "" }
          ]);
          return;
        }

        setRows(data.items);
      } catch {
        setRows([
          { work_type_id: "", workers_count: 0, remarks: "" }
        ]);
      }
    };

    fetchEntry();
  }, [siteId, date]);

  const addRow = () => {
    setRows([
      ...rows,
      { work_type_id: "", workers_count: 0, remarks: "" }
    ]);
  };

  const updateRow = (index: number, field: string, value: any) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSubmit = async () => {
    try {
      const token = getToken();
      if (!token || !siteId || !date) {
        setMessage("Site and date required");
        return;
      }

      await saveWorkEntry(token, {
        site_id: siteId,
        entry_date: date,
        items: rows,
      });

      const data = await getWorkEntry(token, siteId, date);
      setRows(data.items);

      setMessage("Saved successfully ✅");

    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handlePhotoUpload = async (itemId: number, file: File) => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await uploadPhoto(token, itemId, file);

      setPhotos((prev) => ({
        ...prev,
        [itemId]: [...(prev[itemId] || []), res.file_url],
      }));

    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Work Entry</h2>

      {/* Site */}
      <select onChange={(e) => setSiteId(Number(e.target.value))}>
        <option value="">Select Site</option>
        {sites.map((s) => (
          <option key={s.id} value={s.id}>
            {s.project_name}
          </option>
        ))}
      </select>

      <br /><br />

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <hr />

      {/* Rows */}
      {rows.map((row, index) => (
        <div key={index}>
          {/* Work Type */}
          <select
            value={row.work_type_id || ""}
            onChange={(e) =>
              updateRow(index, "work_type_id", Number(e.target.value))
            }
          >
            <option value="">Select Work Type</option>
            {workTypes.map((wt) => (
              <option key={wt.id} value={wt.id}>
                {wt.name}
              </option>
            ))}
          </select>

          {/* Workers */}
          <input
            type="number"
            value={row.workers_count}
            onChange={(e) =>
              updateRow(index, "workers_count", Number(e.target.value))
            }
          />

          {/* Remarks */}
          <input
            placeholder="Remarks"
            value={row.remarks || ""}
            onChange={(e) =>
              updateRow(index, "remarks", e.target.value)
            }
          />

          <br />

          {/* 📸 Upload (only after save) */}
          {row.id ? (
            <div>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handlePhotoUpload(row.id, e.target.files[0]);
                  }
                }}
              />

              {/* Show uploaded photos */}
              <div>
                {(photos[row.id] || []).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="photo"
                    width={100}
                    style={{ margin: 5 }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>Save entry to upload photos</p>
          )}

          <br /><br />
        </div>
      ))}

      <button onClick={addRow}>Add Row</button>

      <br /><br />

      <button onClick={handleSubmit}>Save</button>

      <p>{message}</p>
    </div>
  );
}