import {
  useEffect,
  useState,
} from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
  deleteWorkEntryItem,
} from "../api/workEntry";

import {
  uploadPhoto,
  deletePhoto,
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

  const [retryKey, setRetryKey] =
    useState(0);

  useEffect(() => {

    if (loaded) return;

    const interval =
      setInterval(() => {

        setRetryKey(prev => prev + 1);

      }, 2000);

    return () =>
      clearInterval(interval);

  }, [loaded]);

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

      {!loaded && (

        <div
          className="
            flex
            h-[120px]
            w-[120px]
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

      <img
        src={`${photo.photo_url}?retry=${retryKey}`}

        alt="work"

        onLoad={() =>
          setLoaded(true)
        }

        onError={() =>
          setLoaded(false)
        }

        className={`
          h-[120px]
          w-[120px]
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
        photos: [],
      },
    ]);

  const [message, setMessage] =
    useState("");

  const [uploadingRow, setUploadingRow] =
    useState<number | null>(null);

  const [selectedFiles, setSelectedFiles] =
    useState<Record<number, string>>(
      {}
    );

  // -----------------------------------
  // Load Initial Data
  // -----------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();

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
        const token = getToken();

        if (
          !token ||
          !siteId ||
          !date
        )
          return;

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
              photos: [],
            },
          ]);

          return;
        }

        const normalizedRows =
          data.items.map(
            (item: any) => ({
              ...item,
              photos:
                item.photos || [],
            })
          );

        setRows(normalizedRows);
      } catch {
        setRows([
          {
            work_type_id: "",
            workers_count: 0,
            remarks: "",
            photos: [],
          },
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
        photos: [],
      },
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

        setUploadingRow(rowIndex);

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
          res,
        ];

        setRows(updated);

        setSelectedFiles(
          (prev) => ({
            ...prev,
            [rowIndex]: "",
          })
        );

        setMessage(
          "Photo uploaded successfully"
        );
      } catch (err: any) {
        setMessage(err.message);
      } finally {
        setUploadingRow(null);
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
        )
          return;

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
            photos: [],
          },
        ]);

        setMessage(
          "Entry deleted successfully"
        );
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
                r.remarks,
            })
          ),
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
                item.photos || [],
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
    <div
      className="
        grid
        gap-6
        xl:grid-cols-[1fr_380px]
      "
    >
      {/* LEFT */}
      <div className="space-y-6">
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
              Work Diary
            </h2>

            <p className="mt-2 text-gray-500">
              Track and manage daily
              site activities
            </p>
          </div>

          <button
            onClick={
              handleDeleteEntry
            }
            className="
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
            Delete Entry
          </button>
        </div>

        {/* Site */}
        <div
          className="
            rounded-3xl
            border
            border-[#E8E5DF]
            bg-white
            p-6
            shadow-sm
          "
        >
          <label
            className="
              mb-3
              block
              text-sm
              text-gray-500
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

        {/* Rows */}
        <div className="space-y-6">
          {rows.map(
            (row, index) => (
              <div
                key={
                  row.id || index
                }
                className="
                  rounded-3xl
                  border
                  border-[#E8E5DF]
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                {/* Top */}
                <div
                  className="
                    mb-5
                    flex
                    items-center
                    justify-between
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-[#1E1E1E]
                    "
                  >
                    Work Item
                  </h3>

                  {row.id && (
                    <button
                      onClick={() =>
                        handleDeleteRow(
                          row.id
                        )
                      }
                      className="
                        rounded-2xl
                        bg-red-50
                        px-4
                        py-2
                        text-sm
                        text-red-500
                      "
                    >
                      Delete
                    </button>
                  )}
                </div>

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
                      row.work_type_id ||
                      ""
                    }
                    onChange={(e) =>
                      updateRow(
                        index,
                        "work_type_id",
                        Number(
                          e.target
                            .value
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
                          e.target
                            .value
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
                      outline-none
                    "
                  />

                  {/* Remarks */}
                  <input
                    placeholder="Remarks"
                    value={
                      row.remarks ||
                      ""
                    }
                    onChange={(e) =>
                      updateRow(
                        index,
                        "remarks",
                        e.target
                          .value
                      )
                    }
                    className="
                      rounded-2xl
                      border
                      border-[#E8E5DF]
                      bg-white
                      px-5
                      py-4
                      outline-none
                    "
                  />
                </div>

                {/* Upload */}
                <div className="mt-5">
                  {row.id ? (
                    <>
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
                          hover:bg-[#EFE7D7]
                        "
                      >
                        <FiUpload />

                        Upload / Take
                        Photo

                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          capture="environment"
                          onChange={async (
                            e
                          ) => {
                            if (
                              e.target
                                .files?.[0]
                            ) {
                              const file =
                                e.target
                                  .files[0];

                              setSelectedFiles(
                                (
                                  prev
                                ) => ({
                                  ...prev,
                                  [index]:
                                    file.name,
                                })
                              );

                              await handlePhotoUpload(
                                index,
                                row.id,
                                file
                              );

                              e.target.value =
                                "";
                            }
                          }}
                        />
                      </label>

                      {/* Selected File */}
                      {selectedFiles[
                        index
                      ] && (
                        <p
                          className="
                            mt-3
                            text-sm
                            text-[#D9C7A6]
                          "
                        >
                          Uploading:{" "}
                          {
                            selectedFiles[
                              index
                            ]
                          }
                        </p>
                      )}

                      {uploadingRow ===
                        index && (
                        <p
                          className="
                            mt-2
                            text-sm
                            text-gray-400
                          "
                        >
                          Uploading
                          photo...
                        </p>
                      )}
                    </>
                  ) : (
                    <p
                      className="
                        text-sm
                        text-gray-400
                      "
                    >
                      Save entry
                      before uploading
                      photos
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
                  {(row.photos ||
                    []).map(
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

        {/* Buttons */}
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
            "
          >
            <FiPlus />
            Add New Entry
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

      {/* RIGHT */}
      <div
        className="
          h-fit
          rounded-3xl
          border
          border-[#E8E5DF]
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-5">
          <h3
            className="
              text-xl
              font-semibold
              text-[#1E1E1E]
            "
          >
            Work Diary
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Select work entry
            date
          </p>
        </div>

       {/* Calendar */}
        <div className="calendar-wrapper mt-4">
          <Calendar
            value={
              date
                ? (() => {
                    const [y, m, d] =
                      date.split("-");

                    return new Date(
                      Number(y),
                      Number(m) - 1,
                      Number(d)
                    );
                  })()
                : null
            }

            onChange={(value: any) => {

              const selected =
                new Date(value);

              const year =
                selected.getFullYear();

              const month =
                String(
                  selected.getMonth() + 1
                ).padStart(2, "0");

              const day =
                String(
                  selected.getDate()
                ).padStart(2, "0");

              const formatted =
                `${year}-${month}-${day}`;

              setDate(formatted);
            }}

            calendarType="gregory"

            prev2Label="«"
            prevLabel="‹"
            nextLabel="›"
            next2Label="»"

            tileClassName={({ date: tileDate }) => {

              const year =
                tileDate.getFullYear();

              const month =
                String(
                  tileDate.getMonth() + 1
                ).padStart(2, "0");

              const day =
                String(
                  tileDate.getDate()
                ).padStart(2, "0");

              const tileDateString =
                `${year}-${month}-${day}`;

              if (
                tileDateString === date
              ) {
                return "selected-date";
              }

              return "";
            }}
          />
        </div>

        {/* Selected */}
        <div
          className="
            mt-5
            rounded-2xl
            bg-[#F8F6F2]
            px-4
            py-3
          "
        >
          <p
            className="
              text-xs
              uppercase
              tracking-wider
              text-gray-400
            "
          >
            Selected Date
          </p>

          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-[#1E1E1E]
            "
          >
            {date ||
              "No date selected"}
          </p>
        </div>
      </div>
    </div>
  );
}