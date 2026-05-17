import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

type Option = {
  value: string | number;
  label: string;
};

type Props = {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
};

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
  hasError = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`
          flex w-full items-center justify-between
          rounded-2xl border px-4 py-3 text-sm
          transition-colors duration-200 outline-none
          ${disabled ? "cursor-not-allowed opacity-60 bg-[#F8F6F2]" : "bg-white cursor-pointer"}
          ${hasError && !value
            ? "border-red-300 bg-red-50 text-red-500 animate-shake"
            : open
            ? "border-[#D9C7A6] ring-2 ring-[#D9C7A6]/30"
            : "border-[#E8E5DF] text-[#1E1E1E]"
          }
        `}
      >
        <span className={selected ? "text-[#1E1E1E]" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <FiChevronDown
          size={15}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute left-0 right-0 z-50 mt-2
            overflow-hidden rounded-2xl border border-[#E8E5DF]
            bg-white shadow-lg
          "
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`
                flex w-full items-center justify-between
                px-4 py-3 text-left text-sm transition-colors
                hover:bg-[#F8F6F2]
                ${opt.value === value ? "bg-[#F5F1EA] font-medium text-[#1E1E1E]" : "text-[#1E1E1E]"}
              `}
            >
              {opt.label}
              {opt.value === value && <FiCheck size={14} className="text-[#D9C7A6]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
