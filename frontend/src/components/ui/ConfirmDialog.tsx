export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        animate-fade-in
      "
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          mx-4 w-full max-w-sm
          rounded-3xl border border-[#E8E5DF]
          bg-white p-6 shadow-xl
          animate-slide-up
        "
      >
        <h3 className="text-base font-semibold text-[#1E1E1E]">
          Confirm Delete
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              rounded-2xl border border-[#E8E5DF]
              bg-[#F8F6F2] px-5 py-2.5
              text-sm text-[#1E1E1E]
              transition-all hover:bg-[#EFE7D7]
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              rounded-2xl bg-red-500 px-5 py-2.5
              text-sm font-medium text-white
              transition-all hover:bg-red-600
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
