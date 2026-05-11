import {
  useEffect,
  useState,
} from "react";

export default function PhotoCard({
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