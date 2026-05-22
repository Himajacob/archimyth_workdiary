import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { FiArrowLeft } from "react-icons/fi";

import { getToken } from "../utils/auth";
import { getSiteGallery } from "../api/workEntryPhoto";

export default function SiteGallery() {
  const navigate  = useNavigate();
  const { siteId } = useParams();

  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalPhotos = gallery.reduce(
    (sum, entry) => sum + entry.photos.length,
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm text-gray-500"
        >
          <FiArrowLeft />
          Back
        </button>

        <h2 className="text-3xl font-semibold text-[#1E1E1E]">Site Gallery</h2>

        <p className="mt-2 text-gray-500">
          Work Photo Gallery
          {totalPhotos > 0 && (
            <span className="ml-2 text-xs">· {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}</span>
          )}
        </p>
      </div>

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
                        <p className="mt-1 text-sm text-gray-500 hidden">
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
