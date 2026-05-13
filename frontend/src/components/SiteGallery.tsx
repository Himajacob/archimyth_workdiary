import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
} from "react-icons/fi";

import {
  getToken,
} from "../utils/auth";

import {
  getSiteGallery,
} from "../api/workEntryPhoto";

export default function SiteGallery() {

  const navigate =
    useNavigate();

  const { siteId } =
    useParams();

  const [gallery, setGallery] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchGallery =
      async () => {

        try {

          const token =
            getToken();

          if (!token) return;

          const data =
            await getSiteGallery(
              token,
              Number(siteId)
            );

          setGallery(data);

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    fetchGallery();

  }, [siteId]);

  return (

    <div className="space-y-6">

      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <button
            onClick={() =>
              navigate("/sites")
            }
            className="
              mb-4
              flex
              items-center
              gap-2
              text-sm
              text-gray-500
            "
          >

            <FiArrowLeft />

            Back

          </button>

          <h2
            className="
              text-3xl
              font-semibold
              text-[#1E1E1E]
            "
          >
            Site Gallery
          </h2>

          <p className="mt-2 text-gray-500">
            Work Photo Gallery
          </p>

        </div>

      </div>

      {loading ? (

        <div>Loading gallery...</div>

      ) : gallery.length === 0 ? (

        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-[#D9C7A6]
            bg-white
            p-12
            text-center
            text-gray-500
          "
        >
          No photos uploaded
        </div>

      ) : (

        <div className="space-y-10">

          {gallery.map((entry) => (

            <div
              key={entry.entry_date}
            >

              {/* Date */}
              <div className="mb-5">

                <h3
                  className="
                    text-xl
                    font-semibold
                    text-[#1E1E1E]
                  "
                >
                  {new Date(
                    entry.entry_date
                  ).toLocaleDateString()}
                </h3>

              </div>

              {/* Photos */}
              <div
                className="
                  grid
                  gap-5
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
              >

                {entry.photos.map(
                  (photo: any) => (

                    <a
                      key={photo.id}
                      href={photo.photo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-[#E8E5DF]
                        bg-white
                        shadow-sm
                        transition-all
                        hover:-translate-y-1
                        hover:shadow-md
                      "
                    >

                      <img
                        src={photo.photo_url}
                        alt=""
                        loading="lazy"

                        onError={(e) => {

                            const target =
                            e.currentTarget;

                            const retries =
                            Number(
                                target.dataset.retries || 0
                            );

                            // Retry up to 20 times
                            if (retries >= 20) return;

                            target.dataset.retries =
                            String(retries + 1);

                            setTimeout(() => {

                            target.src =
                                `${photo.photo_url}?retry=${Date.now()}`;

                            }, 2000);
                        }}

                        className="
                            h-64
                            w-full
                            object-cover
                        "
                        />

                      <div className="p-4">

                        <p
                          className="
                            text-sm
                            font-medium
                            text-[#1E1E1E]
                          "
                        >
                          {photo.work_type ||
                            "General Work"}
                        </p>

                        {photo.remarks && (

                          <p
                            className="
                              mt-2
                              text-sm
                              text-gray-500
                            "
                          >
                            {photo.remarks}
                          </p>
                        )}

                      </div>

                    </a>
                  )
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
