import {
  useEffect,
  useState
} from "react";

import {
  FiPlus,
  FiTrash2,
  FiUpload,
  FiSave,
} from "react-icons/fi";

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

// -----------------------------------
// Photo Card
// -----------------------------------

function PhotoCard({
  photo,
  onDelete,
}: any) {

  const [loaded, setLoaded] =
    useState(false);

  const [retry, setRetry] =
    useState(0);

  const imageUrl =
    `${photo.photo_url}?t=${Date.now()}&r=${retry}`;

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[#E8E5DF]
        bg-white
        shadow-sm
      "
    >

      {/* Loading */}
      {!loaded && (

        <div
          className="
            flex
            h-[130px]
            w-[130px]
            animate-pulse
            items-center
            justify-center
            bg-[#F5F1EA]
            text-xs
            text-gray-400
          "
        >
          Loading...
        </div>
      )}

      {/* Image */}
      <img
        src={imageUrl}

        alt="work"

        onLoad={() =>
          setLoaded(true)
        }

        onError={() => {

          setTimeout(() => {

            setRetry(
              (prev: number) =>
                prev + 1
            );

          }, 1500);
        }}

        className={`
          h-[130px]
          w-[130px]
          object-cover
          transition-opacity
          duration-300

          ${
            loaded
              ? "opacity-100"
              : "opacity-0 absolute"
          }
        `}
      />

      {/* Delete */}
      <button

        onClick={onDelete}

        className="
          absolute
          right-2
          top-2
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-sm
          text-white
          shadow-md
          transition-all
          hover:scale-105
        "
      >
        ×
      </button>

    </div>
  );
}

// -----------------------------------
// Main Component
// -----------------------------------

export default function WorkEntry() {

  const [sites, setSites] =
    useState<any[]>([]);

  const [workTypes, setWorkTypes] =
    useState<any[]>([]);

  const [siteId, setSiteId] =
    useState<number | null>(null);

  const [date, setDate] =
    useState("");

  const [rows, setRows] =
    useState<any[]>([
      {
        work_type_id: "",
        workers_count: 0,
        remarks: "",
        photos: []
      }
    ]);

  const [message, setMessage] =
    useState("");

  // -----------------------------------
  // Load Initial Data
  // -----------------------------------

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token =
          getToken();

        if (!token) return;

        const s =
          await getSites(token);

        const wt =
          await getWorkTypes(
            token,
            true
          );

        setSites(s);

        setWorkTypes(wt);

      } catch (err: any) {

        setMessage(err.message);
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

        const token =
          getToken();

        if (
          !token ||
          !siteId ||
          !date
        ) return;

        const data =
          await getWorkEntry(
            token,
            siteId,
            date
          );

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

        const normalizedRows =
          data.items.map(
            (item: any) => ({
              ...item,
              photos:
                item.photos || []
            })
          );

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
  // Add Row
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
  // Update Row
  // -----------------------------------

  const updateRow = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [...rows];

    updated[index][field] =
      value;

    setRows(updated);
  };

  // -----------------------------------
  // Upload Photo
  // -----------------------------------

  const handlePhotoUpload =
    async (
      rowIndex: number,
      itemId: number,
      file: File
    ) => {

      try {

        const token =
          getToken();

        if (!token) return;

        const res =
          await uploadPhoto(
            token,
            itemId,
            file
          );

        const updated =
          [...rows];

        updated[rowIndex].photos = [
          ...(updated[rowIndex]
            .photos || []),
          res
        ];

        setRows(updated);

        setMessage(
          "Photo uploaded successfully"
        );

      } catch (err: any) {

        setMessage(err.message);
      }
    };

  // -----------------------------------
  // Delete Photo
  // -----------------------------------

  const handleDeletePhoto =
    async (
      rowIndex: number,
      photoIndex: number
    ) => {

      try {

        const token =
          getToken();

        if (!token) return;

        const photo =
          rows[rowIndex]
            .photos[photoIndex];

        await deletePhoto(
          token,
          photo.id
        );

        const updated =
          [...rows];

        updated[rowIndex].photos =
          updated[
            rowIndex
          ].photos.filter(
            (_: any, i: number) =>
              i !== photoIndex
          );

        setRows(updated);

      } catch (err: any) {

        setMessage(err.message);
      }
    };

  // -----------------------------------
  // Delete Row
  // -----------------------------------

  const handleDeleteRow =
    async (
      itemId: number
    ) => {

      try {

        const token =
          getToken();

        if (!token) return;

        await deleteWorkEntryItem(
          token,
          itemId
        );

        setRows((prev) =>
          prev.filter(
            (r) => r.id !== itemId
          )
        );

      } catch (err: any) {

        setMessage(err.message);
      }
    };

  // -----------------------------------
  // Delete Entry
  // -----------------------------------

  const handleDeleteEntry =
    async () => {

      try {

        const token =
          getToken();

        if (
          !token ||
          !siteId ||
          !date
        ) return;

        const entry =
          await getWorkEntry(
            token,
            siteId,
            date
          );

        if (!entry) return;

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

      } catch (err: any) {

        setMessage(err.message);
      }
    };

  // -----------------------------------
  // Save Entry
  // -----------------------------------

  const handleSubmit =
    async () => {

      try {

        const token =
          getToken();

        if (
          !token ||
          !siteId ||
          !date
        ) {

          setMessage(
            "Site and date required"
          );

          return;
        }

        const payload = {
          site_id: siteId,
          entry_date: date,

          items: rows.map(
            (r) => ({
              work_type_id:
                r.work_type_id,

              workers_count:
                r.workers_count,

              remarks:
                r.remarks
            })
          )
        };

        await saveWorkEntry(
          token,
          payload
        );

        const data =
          await getWorkEntry(
            token,
            siteId,
            date
          );

        const normalizedRows =
          data.items.map(
            (item: any) => ({
              ...item,
              photos:
                item.photos || []
            })
          );

        setRows(normalizedRows);

        setMessage(
          "Saved successfully"
        );

      } catch (err: any) {

        setMessage(err.message);
      }
    };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div className="space-y-8">

      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-5
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-semibold
              text-[#1E1E1E]
            "
          >
            Work Entry
          </h2>

          <p className="mt-2 text-gray-500">
            Manage daily site work logs
          </p>

        </div>

        <button

          onClick={handleDeleteEntry}

          className="
            flex
            items-center
            gap-2
            self-start
            rounded-2xl
            bg-red-50
            px-5
            py-3
            text-sm
            text-red-500
            transition-all
            hover:bg-red-100
          "
        >

          <FiTrash2 />

          Delete Entry

        </button>

      </div>

      {/* Top Controls */}
      <div
        className="
          grid
          gap-5
          md:grid-cols-2
        "
      >

        {/* Site */}
        <div>

          <label
            className="
              mb-2
              block
              text-sm
              text-gray-600
            "
          >
            Site
          </label>

          <select
            value={siteId || ""}
            onChange={(e) =>
              setSiteId(
                Number(
                  e.target.value
                )
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-[#E8E5DF]
              bg-white
              px-5
              py-4
              text-[#1E1E1E]
              outline-none
            "
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

        </div>

        {/* Date */}
        <div>

          <label
            className="
              mb-2
              block
              text-sm
              text-gray-600
            "
          >
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-[#E8E5DF]
              bg-white
              px-5
              py-4
              text-[#1E1E1E]
              outline-none
            "
          />

        </div>

      </div>

      {/* Rows */}
      <div className="space-y-6">

        {rows.map(
          (row, index) => (

            <div
              key={row.id || index}
              className="
                rounded-3xl
                border
                border-[#E8E5DF]
                bg-white
                p-6
                shadow-sm
              "
            >

              {/* Delete Row */}
              {row.id && (

                <button

                  onClick={() =>
                    handleDeleteRow(
                      row.id
                    )
                  }

                  className="
                    mb-5
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-red-50
                    px-4
                    py-2
                    text-sm
                    text-red-500
                    transition-all
                    hover:bg-red-100
                  "
                >

                  <FiTrash2 />

                  Delete Row

                </button>
              )}

              {/* Inputs */}
              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-3
                "
              >

                {/* Work Type */}
                <select
                  value={
                    row.work_type_id || ""
                  }

                  onChange={(e) =>
                    updateRow(
                      index,
                      "work_type_id",
                      Number(
                        e.target.value
                      )
                    )
                  }

                  className="
                    rounded-2xl
                    border
                    border-[#E8E5DF]
                    bg-white
                    px-5
                    py-4
                    text-[#1E1E1E]
                    outline-none
                  "
                >

                  <option value="">
                    Select Work Type
                  </option>

                  {workTypes.map(
                    (wt) => (

                      <option
                        key={wt.id}
                        value={wt.id}
                      >
                        {wt.name}
                      </option>
                    )
                  )}

                </select>

                {/* Workers */}
                <input
                  type="number"
                  value={
                    row.workers_count
                  }

                  onChange={(e) =>
                    updateRow(
                      index,
                      "workers_count",
                      Number(
                        e.target.value
                      )
                    )
                  }

                  className="
                    rounded-2xl
                    border
                    border-[#E8E5DF]
                    bg-white
                    px-5
                    py-4
                    text-[#1E1E1E]
                    outline-none
                  "
                />

                {/* Remarks */}
                <input
                  placeholder="Remarks"

                  value={
                    row.remarks || ""
                  }

                  onChange={(e) =>
                    updateRow(
                      index,
                      "remarks",
                      e.target.value
                    )
                  }

                  className="
                    rounded-2xl
                    border
                    border-[#E8E5DF]
                    bg-white
                    px-5
                    py-4
                    text-[#1E1E1E]
                    outline-none
                  "
                />

              </div>

              {/* Upload */}
              <div className="mt-5">

                {row.id ? (

                  <label
                    className="
                      inline-flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-2xl
                      bg-[#F5F1EA]
                      px-5
                      py-3
                      text-sm
                      text-[#1E1E1E]
                      transition-all
                      hover:bg-[#EFE7D7]
                    "
                  >

                    <FiUpload />

                    Upload Photo

                    <input
                      type="file"
                      hidden

                      onChange={async (e) => {

                        if (
                          e.target
                            .files?.[0]
                        ) {

                          await handlePhotoUpload(
                            index,
                            row.id,
                            e.target
                              .files[0]
                          );

                          e.target.value = "";
                        }
                      }}
                    />

                  </label>

                ) : (

                  <p
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    Save entry before uploading photos
                  </p>
                )}

              </div>

              {/* Photos */}
              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-4
                "
              >

                {(row.photos || []).map(
                  (
                    photo: any,
                    photoIndex: number
                  ) => (

                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      onDelete={() =>
                        handleDeletePhoto(
                          index,
                          photoIndex
                        )
                      }
                    />
                  )
                )}

              </div>

            </div>
          )
        )}

      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-4">

        <button

          onClick={addRow}

          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-[#D9C7A6]
            bg-white
            px-6
            py-3
            text-[#1E1E1E]
            transition-all
            hover:bg-[#F8F6F2]
          "
        >

          <FiPlus />

          Add Row

        </button>

        <button

          onClick={handleSubmit}

          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-[#D9C7A6]
            px-6
            py-3
            text-[#1E1E1E]
            transition-all
            hover:scale-[1.02]
          "
        >

          <FiSave />

          Save Entry

        </button>

      </div>

      {/* Message */}
      {message && (

        <div
          className="
            rounded-2xl
            border
            border-[#D9C7A6]
            bg-[#F8F6F2]
            px-5
            py-4
            text-sm
            text-[#1E1E1E]
          "
        >
          {message}
        </div>
      )}

    </div>
  );
}