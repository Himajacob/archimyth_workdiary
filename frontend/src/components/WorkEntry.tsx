import {
  useEffect,
  useState,
} from "react";

import {
  FiPlus,
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

import WorkEntryRow from "../components/WorkEntryRow";
import WorkEntryCalendar from "../components/WorkEntryCalendar";

type Props = {
  selectedSite?: any;
};

export default function WorkEntry({
  selectedSite,
}: Props) {

  const [sites, setSites] =
    useState<any[]>([]);

  const [workTypes, setWorkTypes] =
    useState<any[]>([]);

  const [siteId, setSiteId] =
    useState<number | null>(null);
  
  useEffect(() => {

  if (selectedSite?.id) {

    setSiteId(selectedSite.id);

  }

}, [selectedSite]);

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
  {selectedSite && (

  <p
    className="
      mb-3
      text-sm
      font-medium
      text-[#1E1E1E]
    "
  >
    {selectedSite.project_name}
  </p>

)}
    Site
  </label>

  <div className="relative">

    <select
      disabled={!!selectedSite}
      value={siteId || ""}
      onChange={(e) =>
        setSiteId(
          e.target.value
            ? Number(e.target.value)
            : null
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
        pr-12
        text-[#1E1E1E]
        outline-none
        appearance-none
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

    <div
      className="
        pointer-events-none
        absolute
        right-5
        top-1/2
        -translate-y-1/2
        text-gray-400
      "
    >
      ▾
    </div>

  </div>

</div>

        {/* Rows */}
        <div className="space-y-6">

          {rows.map(
            (row, index) => (

              <WorkEntryRow
                key={
                  row.id || index
                }
                row={row}
                index={index}
                workTypes={workTypes}
                uploadingRow={uploadingRow}
                selectedFiles={selectedFiles}
                updateRow={updateRow}
                handleDeleteRow={handleDeleteRow}
                handlePhotoUpload={handlePhotoUpload}
                handleDeletePhoto={handleDeletePhoto}
                setSelectedFiles={setSelectedFiles}
              />

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

        <WorkEntryCalendar
          date={date}
          setDate={setDate}
        />

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