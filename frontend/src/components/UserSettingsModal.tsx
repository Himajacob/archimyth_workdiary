import { useEffect, useRef, useState } from "react";
import { FiX, FiSave, FiLogOut } from "react-icons/fi";

import { getToken, logout } from "../utils/auth";
import { getMe, updateMe } from "../api/user";

type Props = {
  onClose: () => void;
  onNameUpdated: (firstName: string) => void;
  onLogout: () => void;
};

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin: { label: "Admin", color: "bg-[#1E1E1E] text-white" },
  user:  { label: "User",  color: "bg-[#E8E5DF] text-[#1E1E1E]" },
};

export default function UserSettingsModal({
  onClose,
  onNameUpdated,
  onLogout,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState("");
  const [error, setError]         = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    getMe(token).then((data) => {
      setProfile(data);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const res = await updateMe(token, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      localStorage.setItem("token", res.access_token);
      onNameUpdated(res.first_name);
      setMessage("Profile updated");

    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const roleStyle =
    ROLE_LABELS[profile?.role ?? ""] ?? { label: profile?.role ?? "", color: "bg-gray-100 text-gray-700" };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="
          w-full max-w-md
          rounded-t-3xl bg-white p-8 shadow-2xl
          md:rounded-3xl
          animate-slide-up
        "
      >

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1E1E1E]">
            Account Settings
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-[#F5F1EA] hover:text-[#1E1E1E]"
          >
            <FiX size={18} />
          </button>
        </div>

        {profile ? (
          <>
            {/* Avatar + role */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D9C7A6] text-xl font-semibold text-[#1E1E1E]">
                {profile.first_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#1E1E1E]">
                  {profile.first_name} {profile.last_name}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-medium uppercase tracking-wider ${roleStyle.color}`}
                >
                  {roleStyle.label}
                </span>
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="mb-4">
              <label className="mb-1 block text-xs text-gray-500">
                Email
              </label>
              <div className="rounded-2xl border border-[#E8E5DF] bg-[#F8F6F2] px-4 py-3 text-sm text-gray-400">
                {profile.email}
              </div>
            </div>

            {/* First name */}
            <div className="mb-4">
              <label className="mb-1 block text-xs text-gray-500">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="
                  w-full rounded-2xl border border-[#E8E5DF] bg-white
                  px-4 py-3 text-sm text-[#1E1E1E] outline-none
                  focus:border-[#D9C7A6]
                "
              />
            </div>

            {/* Last name */}
            <div className="mb-6">
              <label className="mb-1 block text-xs text-gray-500">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="
                  w-full rounded-2xl border border-[#E8E5DF] bg-white
                  px-4 py-3 text-sm text-[#1E1E1E] outline-none
                  focus:border-[#D9C7A6]
                "
              />
            </div>

            {/* Feedback */}
            {message && (
              <p className="mb-4 rounded-2xl bg-green-50 px-4 py-2 text-sm text-green-700">
                {message}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl bg-[#D9C7A6] px-6 py-3
                  text-sm font-medium text-[#1E1E1E]
                  transition-all duration-300 hover:scale-[1.02]
                  disabled:opacity-50
                "
              >
                <FiSave />
                {saving ? "Saving…" : "Save Changes"}
              </button>

              <button
                onClick={handleLogout}
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl border border-red-100 bg-red-50
                  px-6 py-3 text-sm font-medium text-red-600
                  transition-all duration-300 hover:bg-red-100
                "
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-pulse">
            <div className="h-14 w-14 rounded-full bg-[#E8E5DF]" />
            <div className="h-4 w-32 rounded-full bg-[#E8E5DF]" />
            <div className="h-10 rounded-2xl bg-[#F0EDE8]" />
            <div className="h-10 rounded-2xl bg-[#F0EDE8]" />
          </div>
        )}

      </div>
    </div>
  );
}
