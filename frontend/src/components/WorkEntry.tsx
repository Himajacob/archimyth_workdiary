import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";

import { getSites } from "../api/site";
import { getWorkTypes } from "../api/workType";

import {
  getWorkEntry,
  saveWorkEntry,
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

  const [rows, setRows] = useState<any[]>([
    {
      work_type_id: "",
      workers_count: 0,
      remarks: ""
    }
  ]);

  const [photos, setPhotos] = useState<
    Record<number, { id: number; url: string }[]>
  >({});

  const [message, setMessage] = useState("");

  // -----------------------------
  // Load initial data
  // -----------------------------
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

  // -----------------------------
  // Load entry
  // -----------------------------
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

        // ✅ no entry
        if (!data) {

          setRows([
            {
              work_type_id: "",
              workers_count: 0,
              remarks: ""
            }
          ]);

          setPhotos({});

          return;
        }

        // ✅ rows
        setRows(data.items);

        // ✅ photos
        const photoMap: Record<
          number,
          { id: number; url: string }[]
        > = {};

        data.items.forEach((item: any) => {

          if (item.photos) {

            photoMap[item.id] = item.photos.map((p: any) => ({
              id: p.id,
              url: p.photo_url
            }));
          }
        });

        setPhotos(photoMap);

      } catch {

        setRows([
          {
            work_type_id: "",
            workers_count: 0,
            remarks: ""
          }
        ]);

        setPhotos({});
      }
    };

    fetchEntry();

  }, [siteId, date]);

  // -----------------------------
  // Add row
  // -----------------------------
  const addRow = () => {

    setRows([
      ...rows,
      {
        work_type_id: "",
        workers_count: 0,
        remarks: ""
      }
    ]);
  };

  // -----------------------------
  // Update row
  // -----------------------------
  const updateRow = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [...rows];

    updated[index][field] = value;

    setRows(updated);
  };

  // -----------------------------
  // Upload photo
  // -----------------------------
  const handlePhotoUpload = async (
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
      // immediately update UI
      setPhotos((prev) => ({
        ...prev,
        [itemId]: [
          ...(prev[itemId] || []),
          {
            id: res.id,
            url: res.photo_url
          }
        ],
      }));

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------
  // Delete photo
  // -----------------------------
  const handleDeletePhoto = async (
    itemId: number,
    index: number
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      const photo = photos[itemId][index];

      await deletePhoto(
        token,
        photo.id
      );

      // ✅ update UI
      setPhotos((prev) => ({
        ...prev,
        [itemId]: prev[itemId].filter(
          (_, i) => i !== index
        ),
      }));

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------
  // Delete row
  // -----------------------------
  const handleDeleteRow = async (
    itemId: number
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      await deleteWorkEntryItem(
        token,
        itemId
      );

      // ✅ remove row
      setRows((prev) =>
        prev.filter((r) => r.id !== itemId)
      );

      // ✅ remove photos
      setPhotos((prev) => {

        const updated = { ...prev };

        delete updated[itemId];

        return updated;
      });

      setMessage("Row deleted ✅");

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------
  // Save entry
  // -----------------------------
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

      // ✅ reload entry
      const data = await getWorkEntry(
        token,
        siteId,
        date
      );

      // ✅ rows
      setRows(data.items);

      // ✅ photos
      const photoMap: Record<
        number,
        { id: number; url: string }[]
      > = {};

      data.items.forEach((item: any) => {

        if (item.photos) {

          photoMap[item.id] = item.photos.map((p: any) => ({
            id: p.id,
            url: p.photo_url
          }));
        }
      });

      setPhotos(photoMap);

      setMessage("Saved successfully ✅");

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
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

      <hr />

      {/* Rows */}
      {rows.map((row, index) => (

        <div
          key={index}
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

              {workTypes.map((wt) => (
                <option
                  key={wt.id}
                  value={wt.id}
                >
                  {wt.name}
                </option>
              ))}
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

          {/* Upload only after save */}
          {row.id ? (

            <input
              type="file"
              onChange={(e) => {

                if (e.target.files?.[0]) {

                  handlePhotoUpload(
                    row.id,
                    e.target.files[0]
                  );
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

            {(photos[row.id] || []).map(
              (photo, i) => (

                <div
                  key={photo.id}
                  style={{
                    position: "relative"
                  }}
                >

                  <img
                    src={photo.url}
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
                        row.id,
                        i
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
                      height: 20
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