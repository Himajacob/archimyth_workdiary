import { useEffect, useRef, useState } from "react";
import { FiX, FiUpload, FiLoader, FiImage } from "react-icons/fi";

import { getToken } from "../utils/auth";
import { getWorkTypes } from "../api/workType";
import { uploadGalleryPhoto } from "../api/workEntryPhoto";

type Props = {
  siteId: number;
  files: File[];
  onClose: () => void;
  onUploaded: () => void;
};

export default function GalleryUploadModal({
  siteId,
  files,
  onClose,
  onUploaded,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [workTypes, setWorkTypes] = useState<{ id: number; name: string }[]>([]);
  const [workTypeId, setWorkTypeId] = useState<number | "">("");
  const [remarks, setRemarks]       = useState("");
  const [uploading, setUploading]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [error, setError]           = useState("");
  const [previews, setPreviews]     = useState<string[]>([]);

  // Build local preview URLs
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  // Fetch work types
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getWorkTypes(token, false).then((data: any) => {
      const list = Array.isArray(data) ? data : data?.items ?? [];
      setWorkTypes(list);
    }).catch(() => {});
  }, []);

  const handleUpload = async () => {
    if (workTypeId === "") {
      setError("Please select a work type");
      return;
    }

    const token = getToken();
    if (!token) return;

    setError("");
    setUploading(true);
    setProgress(0);

    let done = 0;
    let failed = 0;

    for (const file of files) {
      try {
        await uploadGalleryPhoto(
          token,
          siteId,
          file,
          workTypeId as number,
          remarks.trim() || undefined
        );
        done++;
      } catch {
        failed++;
      }
      setProgress(Math.round(((done + failed) / files.length) * 100));
    }

    setUploading(false);

    if (done > 0) {
      onUploaded();
      onClose();
    } else {
      setError("All uploads failed. Please try again.");
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center"
      onClick={(e) => {
        if (!uploading && e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl md:rounded-3xl">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1E1E1E]">
              Upload Photos
            </h2>
            <p className="text-sm text-gray-400">
              {files.length} photo{files.length !== 1 ? "s" : ""} selected
            </p>
          </div>
          {!uploading && (
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-[#F5F1EA] hover:text-[#1E1E1E]"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Previews */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {previews.map((url, i) => (
            <div
              key={i}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E8E5DF] bg-[#F8F6F2]"
            >
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              {files.length > 4 && i === 3 && previews.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 text-sm font-semibold text-white">
                  +{files.length - 4}
                </div>
              )}
            </div>
          )).slice(0, 4)}
          {previews.length === 0 && (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F8F6F2] text-gray-300">
              <FiImage size={24} />
            </div>
          )}
        </div>

        {/* Work type */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-[#1E1E1E]">
            Work Type <span className="text-red-400">*</span>
          </label>
          <select
            value={workTypeId}
            onChange={(e) =>
              setWorkTypeId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="
              w-full rounded-2xl border border-[#E8E5DF] bg-white
              px-4 py-3 text-sm text-[#1E1E1E] outline-none
              focus:border-[#D9C7A6]
            "
          >
            <option value="">Select work type…</option>
            {workTypes.map((wt) => (
              <option key={wt.id} value={wt.id}>
                {wt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-[#1E1E1E]">
            Description
            <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. North wall plastering complete"
            className="
              w-full resize-none rounded-2xl border border-[#E8E5DF] bg-white
              px-4 py-3 text-sm text-[#1E1E1E] outline-none
              focus:border-[#D9C7A6]
              placeholder:text-gray-300
            "
          />
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-gray-400">
              <span>Uploading…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8E5DF]">
              <div
                className="h-full rounded-full bg-[#D9C7A6] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mb-4 rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="
            flex w-full items-center justify-center gap-2
            rounded-2xl bg-[#D9C7A6] px-6 py-3
            text-sm font-medium text-[#1E1E1E]
            transition-all duration-300 hover:scale-[1.02]
            disabled:opacity-50 disabled:hover:scale-100
          "
        >
          {uploading ? (
            <>
              <FiLoader className="animate-spin" size={15} />
              Uploading {progress}%…
            </>
          ) : (
            <>
              <FiUpload size={15} />
              Upload {files.length} Photo{files.length !== 1 ? "s" : ""}
            </>
          )}
        </button>

      </div>
    </div>
  );
}
