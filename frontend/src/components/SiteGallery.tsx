import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiCamera,
  FiUpload,
  FiImage,
} from "react-icons/fi";

import { getToken } from "../utils/auth";
import { getSiteGallery } from "../api/workEntryPhoto";

import GalleryUploadModal from "./GalleryUploadModal";

// detect mobile once
const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

export default function SiteGallery() {
  const navigate  = useNavigate();
  const { siteId } = useParams();

  const [gallery, setGallery]         = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [dragOver, setDragOver]       = useState(false);

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef    = useRef<HTMLDivElement>(null);

  // -----------------------------------
  // Fetch
  // -----------------------------------

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;
      const data = await getSiteGallery(token, Number(siteId));
      setGallery(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, [siteId]);

  // -----------------------------------
  // Upload — open modal with selected files
  // -----------------------------------

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPendingFiles(Array.from(files));
  };

  // Drag-and-drop handlers (desktop only)
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const totalPhotos = gallery.reduce(
    (sum, entry) => sum + entry.photos.length,
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <button
            onClick={() => navigate("/sites")}
            className="mb-4 flex items-center gap-2 text-sm text-gray-500"
          >
            <FiArrowLeft />
            Back
          </button>

          <h2 className="text-3xl font-semibold text-[#1E1E1E]">
            Site Gallery
          </h2>

          <p className="mt-2 text-gray-500">
            Work Photo Gallery
            {totalPhotos > 0 && (
              <span className="ml-2 text-xs">· {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}</span>
            )}
          </p>
        </div>

        {/* Upload buttons */}
        <div className="flex flex-wrap gap-3">

          {/* File / Gallery picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!!pendingFiles}
            className="
              flex items-center gap-2 rounded-2xl
              bg-[#D9C7A6] px-5 py-2.5
              text-sm font-medium text-[#1E1E1E]
              transition-all duration-300 hover:scale-[1.02]
              disabled:opacity-50
            "
          >
            <FiImage size={15} />
            {isMobile ? "Gallery" : "Upload Photos"}
          </button>

          {/* Camera (mobile only) */}
          {isMobile && (
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={!!pendingFiles}
              className="
                flex items-center gap-2 rounded-2xl
                bg-[#1E1E1E] px-5 py-2.5
                text-sm font-medium text-white
                transition-all duration-300 hover:opacity-90
                disabled:opacity-50
              "
            >
              <FiCamera size={15} />
              Camera
            </button>
          )}

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { handleFilesSelected(e.target.files); e.target.value = ""; }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => { handleFilesSelected(e.target.files); e.target.value = ""; }}
          />
        </div>

      </div>

      {/* Upload modal */}
      {pendingFiles && (
        <GalleryUploadModal
          siteId={Number(siteId)}
          files={pendingFiles}
          onClose={() => setPendingFiles(null)}
          onUploaded={() => {
            setPendingFiles(null);
            fetchGallery();
          }}
        />
      )}

      {/* Drag-and-drop zone (desktop only) */}
      {!isMobile && (
        <div
          ref={dropZoneRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex cursor-pointer flex-col items-center justify-center gap-2
            rounded-3xl border-2 border-dashed py-8 text-sm
            transition-all duration-200
            ${
              dragOver
                ? "border-[#D9C7A6] bg-[#F8F6F2] text-[#1E1E1E]"
                : "border-[#E8E5DF] bg-white text-gray-400 hover:border-[#D9C7A6] hover:text-gray-500"
            }
          `}
        >
          <FiUpload size={22} />
          <span>Drag & drop photos here, or click to select files</span>
        </div>
      )}

      {/* Gallery list */}
      {loading ? (

        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-5 w-32 rounded-full bg-[#E8E5DF]" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-64 rounded-3xl bg-[#E8E5DF]" />
                ))}
              </div>
            </div>
          ))}
        </div>

      ) : gallery.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-[#D9C7A6] bg-white p-12 text-center text-gray-500">
          No photos uploaded yet
        </div>

      ) : (

        <div className="space-y-10">
          {gallery.map((entry) => (
            <div key={entry.entry_date}>

              <h3 className="mb-5 text-xl font-semibold text-[#1E1E1E]">
                {new Date(entry.entry_date + "T00:00:00").toLocaleDateString(
                  undefined,
                  { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                )}
              </h3>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {entry.photos.map((photo: any) => (
                  <a
                    key={photo.id}
                    href={photo.photo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      overflow-hidden rounded-3xl border border-[#E8E5DF]
                      bg-white shadow-sm transition-all
                      hover:-translate-y-1 hover:shadow-md
                    "
                  >
                    <img
                      src={photo.photo_url}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        const target  = e.currentTarget;
                        const retries = Number(target.dataset.retries || 0);
                        if (retries >= 20) return;
                        target.dataset.retries = String(retries + 1);
                        setTimeout(() => {
                          target.src = `${photo.photo_url}?retry=${Date.now()}`;
                        }, 2000);
                      }}
                      className="h-64 w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {photo.work_type || "General"}
                      </p>
                      {photo.remarks && (
                        <p className="mt-1 text-sm text-gray-500">
                          {photo.remarks}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
