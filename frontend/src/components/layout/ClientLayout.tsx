import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserName, logout } from "../../utils/auth";
import UserSettingsModal from "../UserSettingsModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSettings, setShowSettings] = useState(false);
  const [displayName, setDisplayName] = useState(getUserName() || "");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5]">

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[#E8E5DF] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <img src="/logo.png" alt="Archimyth" className="h-8" />

          <button
            onClick={() => setShowSettings(true)}
            className="
              flex items-center gap-3 rounded-2xl
              border border-[#E8E5DF] bg-white px-4 py-2.5
              transition-all hover:shadow-md
            "
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D9C7A6] text-sm font-semibold text-[#1E1E1E]">
              {displayName?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#1E1E1E]">{displayName}</p>
              <p className="text-xs uppercase tracking-wider text-[#D9C7A6]">Client</p>
            </div>
          </button>

        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>

      {showSettings && (
        <UserSettingsModal
          onClose={() => setShowSettings(false)}
          onNameUpdated={(name) => setDisplayName(name)}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}
