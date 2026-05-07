import { useEffect, useState } from "react";

import { getToken } from "../utils/auth";

import { getSites } from "../api/site";
import { getWorkTypes } from "../api/workType";

import {
  getWorkEntry,
  saveWorkEntry,
  deleteWorkEntry,
  deleteWorkEntryItem
} from "../api/workEntry";

import {
  uploadPhoto,
  deletePhoto
} from "../api/workEntryPhoto";

export default function WorkEntry() {

  const [sites, setSites] = useState<any[]>([]);
  const [workTypes, setWorkTypes] = useState<any[]>([]);

  const [siteId, setSiteId] = useState<number | null>(null);
  const [date, setDate] = useState("");

  // ✅ SINGLE SOURCE OF TRUTH
  const [rows, setRows] = useState<any[]>([
    {
      work_type_id: "",
      workers_count: 0,
      remarks: "",
      photos: []
    }
  ]);

  const [message, setMessage] = useState("");

  // -----------------------------------
  // Load initial data
  // -----------------------------------
  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = getToken();

        if (!token) return;

        const s = await getSites(token);
        const wt = await getWorkTypes(token, true);
        setSites(s);
        setWorkTypes(wt);

      } catch (err: any) {

        setMessage(err.message);
      }
    };

    fetchData();

  }, []);

  // -----------------------------------
  // Load work entry
  // -----------------------------------
  useEffect(() => {

    const fetchEntry = async () => {

      try {

        const token = getToken();

        if (!token || !siteId || !date) return;

        const data = await getWorkEntry(
          token,
          siteId,
          date
        );

        // ✅ No entry
        if (!data) {

          setRows([
            {
              work_type_id: "",
              workers_count: 0,
              remarks: "",
              photos: []
            }
          ]);

          return;
        }

        // ✅ IMPORTANT:
        // keep backend shape exactly as-is
        const normalizedRows = data.items.map((item: any) => ({
          ...item,
          photos: item.photos || []
        }));

        setRows(normalizedRows);

      } catch {

        setRows([
          {
            work_type_id: "",
            workers_count: 0,
            remarks: "",
            photos: []
          }
        ]);
      }
    };

    fetchEntry();

  }, [siteId, date]);

  // -----------------------------------
  // Add row
  // -----------------------------------
  const addRow = () => {

    setRows([
      ...rows,
      {
        work_type_id: "",
        workers_count: 0,
        remarks: "",
        photos: []
      }
    ]);
  };

  // -----------------------------------
  // Update row
  // -----------------------------------
  const updateRow = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [...rows];

    updated[index][field] = value;

    setRows(updated);
  };

  // -----------------------------------
  // Upload photo
  // -----------------------------------
  const handlePhotoUpload = async (
    rowIndex: number,
    itemId: number,
    file: File
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      const res = await uploadPhoto(
        token,
        itemId,
        file
      );

      // ✅ IMPORTANT:
      // push RAW backend response
      const updated = [...rows];

      updated[rowIndex].photos = [
        ...(updated[rowIndex].photos || []),
        res
      ];

      setRows(updated);

      setMessage("Photo uploaded ✅");

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------------
  // Delete photo
  // -----------------------------------
  const handleDeletePhoto = async (
    rowIndex: number,
    photoIndex: number
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      const photo =
        rows[rowIndex].photos[photoIndex];

      await deletePhoto(
        token,
        photo.id
      );

      const updated = [...rows];

      updated[rowIndex].photos =
        updated[rowIndex].photos.filter(
          (_: any, i: number) => i !== photoIndex
        );

      setRows(updated);

      setMessage("Photo deleted ✅");

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------------
  // Delete row
  // -----------------------------------
  const handleDeleteRow = async (
    itemId: number
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      const confirmDelete = window.confirm(
        "Delete this row?"
      );

      if (!confirmDelete) return;

      await deleteWorkEntryItem(
        token,
        itemId
      );

      setRows((prev) =>
        prev.filter((r) => r.id !== itemId)
      );

      setMessage("Row deleted ✅");

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------------
  // Delete full entry
  // -----------------------------------
  const handleDeleteEntry = async () => {

    try {

      const token = getToken();

      if (!token || !siteId || !date) return;

      const entry = await getWorkEntry(
        token,
        siteId,
        date
      );

      if (!entry) {

        setMessage("No work entry found");

        return;
      }

      const confirmDelete = window.confirm(
        "Delete full work entry?"
      );

      if (!confirmDelete) return;

      await deleteWorkEntry(
        token,
        entry.id
      );

      setRows([
        {
          work_type_id: "",
          workers_count: 0,
          remarks: "",
          photos: []
        }
      ]);

      setMessage("Work entry deleted ✅");

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------------
  // Save entry
  // -----------------------------------
  const handleSubmit = async () => {

    try {

      const token = getToken();

      if (!token || !siteId || !date) {

        setMessage("Site and date required");

        return;
      }

      // ✅ send clean payload
      const payload = {
        site_id: siteId,
        entry_date: date,
        items: rows.map((r) => ({
          work_type_id: r.work_type_id,
          workers_count: r.workers_count,
          remarks: r.remarks
        }))
      };

      await saveWorkEntry(
        token,
        payload
      );

      // ✅ reload entry
      const data = await getWorkEntry(
        token,
        siteId,
        date
      );

      // ✅ IMPORTANT:
      // keep backend shape directly
      const normalizedRows = data.items.map((item: any) => ({
        ...item,
        photos: item.photos || []
      }));

      setRows(normalizedRows);

      setMessage("Saved successfully ✅");

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------------
  // UI
  // -----------------------------------
  return (

    <div
      style={{
        padding: 20,
        maxWidth: 900,
        margin: "auto"
      }}
    >

      <h2>Work Entry</h2>

      {/* Site */}
      <select
        onChange={(e) =>
          setSiteId(Number(e.target.value))
        }
      >
        <option value="">
          Select Site
        </option>

        {sites.map((s) => (
          <option
            key={s.id}
            value={s.id}
          >
            {s.project_name}
          </option>
        ))}
      </select>

      <br />
      <br />

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(e.target.value)
        }
      />

      <br />
      <br />

      {/* Delete full entry */}
      <button
        onClick={handleDeleteEntry}
        style={{
          background: "darkred",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Delete Full Entry
      </button>

      <hr />

      {/* Rows */}
      {rows.map((row, index) => (

        <div
          key={row.id || index}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 15,
            borderRadius: 10
          }}
        >

          {/* Delete row */}
          {row.id && (
            <button
              onClick={() =>
                handleDeleteRow(row.id)
              }
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: 5,
                cursor: "pointer",
                marginBottom: 10
              }}
            >
              Delete Row
            </button>
          )}

          {/* Inputs */}
          <div
            style={{
              display: "flex",
              gap: 10
            }}
          >

            {/* Work Type */}
            <select
              value={row.work_type_id || ""}
              onChange={(e) =>
                updateRow(
                  index,
                  "work_type_id",
                  Number(e.target.value)
                )
              }
            >
              <option value="">
                Select Work Type
              </option>

              {workTypes.map((wt) => {

                // ✅ allow existing inactive value
                const isCurrentSelection =
                  row.work_type_id === wt.id;

                return (
                  <option
                    key={wt.id}
                    value={wt.id}

                    // ✅ disable inactive for new selections
                    disabled={
                      !wt.is_active &&
                      !isCurrentSelection
                    }
                  >
                    {wt.name}

                    {!wt.is_active
                      ? " (Inactive)"
                      : ""}
                  </option>
                );
              })}
            </select>

            {/* Workers */}
            <input
              type="number"
              value={row.workers_count}
              onChange={(e) =>
                updateRow(
                  index,
                  "workers_count",
                  Number(e.target.value)
                )
              }
              style={{
                width: 80
              }}
            />

            {/* Remarks */}
            <input
              placeholder="Remarks"
              value={row.remarks || ""}
              onChange={(e) =>
                updateRow(
                  index,
                  "remarks",
                  e.target.value
                )
              }
              style={{
                flex: 1
              }}
            />

          </div>

          <br />

          {/* Upload */}
          {row.id ? (

            <input
              type="file"
              onChange={async (e) => {

                if (e.target.files?.[0]) {

                  await handlePhotoUpload(
                    index,
                    row.id,
                    e.target.files[0]
                  );

                  // clear selected file
                  e.target.value = "";
                }
              }}
            />

          ) : (

            <p
              style={{
                color: "#888"
              }}
            >
              Save entry to upload photos
            </p>
          )}

          {/* Photos */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
              flexWrap: "wrap"
            }}
          >

            {(row.photos || []).map(
              (photo: any, photoIndex: number) => (

                <div
                  key={photo.id}
                  style={{
                    position: "relative"
                  }}
                >

                  <img
                    src={photo.photo_url}
                    alt="photo"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8
                    }}
                  />

                  {/* Delete photo */}
                  <button
                    onClick={() =>
                      handleDeletePhoto(
                        index,
                        photoIndex
                      )
                    }
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      cursor: "pointer"
                    }}
                  >
                    ×
                  </button>

                </div>
              )
            )}

          </div>

        </div>
      ))}

      {/* Add Row */}
      <button onClick={addRow}>
        Add Row
      </button>

      <br />
      <br />

      {/* Save */}
      <button onClick={handleSubmit}>
        Save
      </button>

      {/* Message */}
      <p>{message}</p>

    </div>
  );
}