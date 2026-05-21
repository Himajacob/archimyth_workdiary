import { useRef, useState, useEffect } from "react";
import { FiCamera, FiImage, FiLoader, FiTrash2 } from "react-icons/fi";
import PhotoCard from "./PhotoCard";
import CustomSelect from "./ui/CustomSelect";

const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

export default function WorkEntryRow({
  row,
  index,
  workTypes,
  uploadingRow,
  updateRow,
  handleDeleteRow,
  handlePhotoUpload,
  handleDeletePhoto,
  setSelectedFiles,
  hasError,
}: any) {

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [countStr, setCountStr] = useState(String(row.workers_count ?? 0));

  useEffect(() => {
    setCountStr(String(row.workers_count ?? 0));
  }, [row.workers_count]);

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      setSelectedFiles((prev: any) => ({ ...prev, [index]: file.name }));
      await handlePhotoUpload(index, row.id, file);
    }

    e.target.value = "";
  };

  const isUploading = uploadingRow === index;

  return (
    <div
      className="
        animate-slide-up
        rounded-3xl border border-[#E8E5DF]
        bg-white p-6 shadow-sm
        transition-all duration-300
      "
    >

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1E1E1E]">
          Work Item
        </h3>

        {row.id && (
          <button
            onClick={() => handleDeleteRow(row.id)}
            className="
              flex items-center gap-1.5 rounded-2xl
              bg-red-50 px-4 py-2 text-sm text-red-500
              transition-all hover:bg-red-100
            "
          >
            <FiTrash2 size={13} />
            Delete
          </button>
        )}
      </div>

      {/* Inputs grid */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Work Type */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Work Type
            <span className="ml-0.5 text-red-400">*</span>
          </label>
          <CustomSelect
            value={row.work_type_id || ""}
            onChange={(val) => updateRow(index, "work_type_id", Number(val))}
            placeholder="Select work type…"
            hasError={hasError}
            options={workTypes.map((wt: any) => ({ value: wt.id, label: wt.name }))}
          />
          {hasError && !row.work_type_id && (
            <p className="mt-1 animate-slide-up text-xs text-red-500">
              Work type is required
            </p>
          )}
        </div>

        {/* Workers count */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Workers Count
          </label>
          <input
            type="number"
            min={0}
            value={countStr}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== "" && Number(val) < 0) return;
              setCountStr(val);
              if (val !== "") updateRow(index, "workers_count", Number(val));
            }}
            onBlur={() => {
              if (countStr === "" || Number(countStr) < 0) {
                setCountStr("0");
                updateRow(index, "workers_count", 0);
              }
            }}
            className="
              w-full rounded-2xl border border-[#E8E5DF]
              bg-white px-4 py-3 text-sm text-[#1E1E1E] outline-none
              transition-colors focus:border-[#D9C7A6]
            "
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Remarks
            <span className="ml-0.5 text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. North wall done"
            value={row.remarks || ""}
            onChange={(e) => updateRow(index, "remarks", e.target.value)}
            className={`
              w-full rounded-2xl border px-4 py-3 text-sm text-[#1E1E1E] outline-none
              transition-colors focus:border-[#D9C7A6]
              placeholder:text-gray-300
              ${hasError && !row.remarks?.trim()
                ? "border-red-300 bg-red-50 animate-shake"
                : "border-[#E8E5DF] bg-white"
              }
            `}
          />
          {hasError && !row.remarks?.trim() && (
            <p className="mt-1 animate-slide-up text-xs text-red-500">
              Remarks is required
            </p>
          )}
        </div>

      </div>

      {/* Upload section */}
      <div className="mt-5">

        {row.id ? (
          <div className="space-y-3">

            {/* Buttons */}
            <div className="flex flex-wrap gap-2">

              {/* Gallery / file pick */}
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="
                  flex items-center gap-2 rounded-2xl
                  bg-[#F5F1EA] px-4 py-2.5 text-sm text-[#1E1E1E]
                  transition-all hover:bg-[#EFE7D7]
                  disabled:opacity-50
                "
              >
                <FiImage size={14} />
                {isMobile ? "Gallery" : "Upload Photo"}
              </button>

              {/* Camera (mobile only) */}
              {isMobile && (
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => cameraInputRef.current?.click()}
                  className="
                    flex items-center gap-2 rounded-2xl
                    bg-[#1E1E1E] px-4 py-2.5 text-sm text-white
                    transition-all hover:opacity-90
                    disabled:opacity-50
                  "
                >
                  <FiCamera size={14} />
                  Camera
                </button>
              )}

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={onFileChange}
              />
              <input
                ref={cameraInputRef}
                type="file"
                hidden
                accept="image/*"
                capture="environment"
                onChange={onFileChange}
              />
            </div>

            {/* Uploading indicator */}
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-gray-400 animate-fade-in">
                <FiLoader size={13} className="animate-spin" />
                Uploading photo…
              </div>
            )}

          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Save the entry first to upload photos
          </p>
        )}

      </div>

      {/* Photos */}
      {row.photos?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {row.photos.map((photo: any, photoIndex: number) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={() => handleDeletePhoto(index, photoIndex)}
            />
          ))}
        </div>
      )}

    </div>
  );
}
