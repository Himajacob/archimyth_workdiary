import {
  FiUsers,
  FiMapPin,
  FiBookOpen,
  FiClipboard,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import {
  logout,
  getUserName,
} from "../../utils/auth";

import { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import UserSettingsModal from "../UserSettingsModal";
import PWAInstallBanner from "../PWAInstallBanner";

type Props = {
  children: React.ReactNode;
  role: string;
};

export default function DashboardLayout({ children, role }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [userName, setUserName] = useState(getUserName);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { label: "Clients",    icon: <FiUsers />,    path: "/clients" },
    { label: "Sites",      icon: <FiMapPin />,   path: "/sites" },
    { label: "Work Diary", icon: <FiBookOpen />, path: "/work-diary" },
    { label: "Work Types", icon: <FiClipboard />,path: "/work-types" },
  ];

  if (role === "admin") {
    navItems.push({ label: "Users", icon: <FiUsers />, path: "/users" });
  }

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] md:flex">

      {/* ── MOBILE HEADER ── */}
      <div className="mobile-header-safe flex items-center justify-between border-b border-[#E8E5DF] bg-white md:hidden">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-10" />
          <h1 className="font-adam text-sm tracking-[0.3em] text-[#1E1E1E]">
            ARCHIMYTH
          </h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl border border-[#E8E5DF] bg-white p-2 text-xl text-[#1E1E1E]"
        >
          <FiMenu />
        </button>
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden
          transition-all duration-300
          ${mobileMenuOpen ? "visible bg-black/40" : "invisible bg-black/0"}
        `}
        onClick={() => setMobileMenuOpen(false)}
      >
        <aside
          className={`
            mobile-sidebar-safe h-full w-[280px] bg-white shadow-2xl
            transition-transform duration-300
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-10 flex flex-col items-center">
            <img src="/logo.png" alt="logo" className="mb-4 w-24" />
            <h1 className="font-adam text-sm tracking-[0.4em] text-[#1E1E1E]">
              ARCHIMYTH
            </h1>
          </div>

          <nav className="space-y-3">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                  className={`
                    flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300
                    ${active ? "bg-[#D9C7A6] text-[#1E1E1E]" : "text-gray-500 hover:bg-[#F5F1EA]"}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-gray-500 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
          >
            <FiLogOut />
            Logout
          </button>
        </aside>
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={`
          sticky top-0 h-screen hidden md:flex flex-col border-r border-[#E8E5DF] bg-white py-8
          transition-all duration-300 ease-in-out overflow-hidden shrink-0
          ${collapsed ? "w-[72px] px-3" : "w-[260px] px-6"}
        `}
      >
        {/* Logo */}
        <div className="mb-12 flex flex-col items-center">
          <img
            src="/logo.png"
            alt="logo"
            className={`transition-all duration-300 ${collapsed ? "w-10" : "mb-4 w-24"}`}
          />
          <h1
            className={`
              font-adam text-sm tracking-[0.4em] text-[#1E1E1E]
              transition-all duration-300 overflow-hidden whitespace-nowrap
              ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 mt-2"}
            `}
          >
            ARCHIMYTH
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
                className={`
                  flex w-full items-center rounded-2xl py-3 text-sm transition-all duration-300
                  ${collapsed ? "justify-center px-2" : "gap-3 px-4"}
                  ${active ? "bg-[#D9C7A6] text-[#1E1E1E] shadow-sm" : "text-gray-500 hover:bg-[#F5F1EA]"}
                `}
              >
                <span className="shrink-0 text-lg">{item.icon}</span>
                <span
                  className={`
                    overflow-hidden whitespace-nowrap transition-all duration-300
                    ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`
            flex w-full items-center rounded-2xl py-3 text-sm text-gray-500
            transition-all duration-300 hover:bg-red-50 hover:text-red-500
            ${collapsed ? "justify-center px-2" : "gap-3 px-4 mt-8"}
          `}
        >
          <span className="shrink-0 text-lg"><FiLogOut /></span>
          <span
            className={`
              overflow-hidden whitespace-nowrap transition-all duration-300
              ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}
            `}
          >
            Logout
          </span>
        </button>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            absolute -right-3 top-8
            flex h-6 w-6 items-center justify-center
            rounded-full bg-[#1E1E1E] text-white shadow-md
            transition-all duration-300 hover:bg-[#D9C7A6] hover:text-[#1E1E1E]
          "
        >
          {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── PWA INSTALL BANNER ── */}
      <PWAInstallBanner />

      {/* ── USER SETTINGS MODAL ── */}
      {settingsOpen && (
        <UserSettingsModal
          onClose={() => {
            setSettingsOpen(false);
            setUserName(getUserName() || "User");
          }}
          onNameUpdated={(name) => setUserName(name)}
          onLogout={() => navigate("/", { replace: true })}
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="main-content-safe min-w-0 flex-1 overflow-x-hidden p-4 md:p-8">

        {/* Topbar */}
        <div className="mb-8 flex flex-row items-center justify-between gap-3">

          <div className="min-w-0">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <h1 className="mt-1 truncate text-2xl font-semibold text-[#1E1E1E] md:text-4xl">
              {userName || "User"}
            </h1>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#E8E5DF] bg-white px-3 py-2 shadow-sm transition-all hover:bg-[#F5F1EA] md:px-5 md:py-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D9C7A6] text-base font-semibold text-[#1E1E1E] md:h-12 md:w-12 md:text-lg">
              {userName?.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-[#1E1E1E]">{userName || "User"}</p>
              <p className="text-xs uppercase tracking-wider text-gray-500">{role}</p>
            </div>
          </button>

        </div>

        {/* Page Content */}
        {children}

      </main>

    </div>
  );
}
