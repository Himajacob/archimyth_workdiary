import { useState, useEffect } from "react";
import { FiDownload, FiX } from "react-icons/fi";

const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isIOSSafari =
  isIOS &&
  /Safari/i.test(navigator.userAgent) &&
  !/CriOS|FxiOS|OPiOS/i.test(navigator.userAgent);

function isInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export default function PWAInstallBanner() {
  const [nativePrompt, setNativePrompt] = useState<any>(null);
  const [showMobile, setShowMobile]     = useState(false);
  const [showDesktop, setShowDesktop]   = useState(false);
  const [fadeOut, setFadeOut]           = useState(false);

  useEffect(() => {
    if (isInstalled()) return;
    if (localStorage.getItem("pwa-dismissed")) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setNativePrompt(e);
      if (isMobileDevice) {
        setTimeout(() => setShowMobile(true), 1500);
      } else {
        setShowDesktop(true);
        // auto-fade after 7 s
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => setShowDesktop(false), 500);
        }, 7000);
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS Safari has no beforeinstallprompt — show manual guide
    if (isIOSSafari) {
      setTimeout(() => setShowMobile(true), 2000);
    }

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const install = async () => {
    if (!nativePrompt) return;
    nativePrompt.prompt();
    const { outcome } = await nativePrompt.userChoice;
    if (outcome === "accepted") dismiss();
    setNativePrompt(null);
  };

  const dismiss = () => {
    setShowMobile(false);
    setShowDesktop(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  // ── Desktop toast ───────────────────────────────────────────────────────────
  if (showDesktop && !isMobileDevice) {
    return (
      <div
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-3 rounded-2xl
          bg-[#1E1E1E] px-5 py-4 shadow-xl
          transition-all duration-500
          ${fadeOut ? "translate-y-4 opacity-0" : "animate-slide-up opacity-100"}
        `}
      >
        <FiDownload className="shrink-0 text-[#D9C7A6]" size={18} />
        <div className="text-sm text-white">
          <p className="font-medium">Install as App</p>
          <p className="mt-0.5 text-xs text-gray-400">Works offline · opens faster</p>
        </div>
        <button
          onClick={install}
          className="shrink-0 rounded-xl bg-[#D9C7A6] px-3 py-1.5 text-xs font-medium text-[#1E1E1E] hover:opacity-90 transition-opacity"
        >
          Install
        </button>
        <button
          onClick={dismiss}
          className="shrink-0 text-gray-500 hover:text-white transition-colors"
        >
          <FiX size={16} />
        </button>
      </div>
    );
  }

  // ── Mobile bottom sheet ─────────────────────────────────────────────────────
  if (showMobile && isMobileDevice) {
    return (
      <>
        {/* Dim overlay */}
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={dismiss}
        />

        <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up rounded-t-3xl border-t border-[#E8E5DF] bg-white px-6 pb-10 pt-5 shadow-2xl">

          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Archimyth" className="w-10" />
              <div>
                <p className="font-semibold text-[#1E1E1E]">Archimyth</p>
                <p className="text-xs text-gray-500">Work Diary</p>
              </div>
            </div>
            <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiX size={20} />
            </button>
          </div>

          {isIOSSafari ? (
            /* iOS — manual instructions */
            <div>
              <p className="mb-3 text-sm font-medium text-[#1E1E1E]">Add to your Home Screen</p>
              <div className="space-y-2 rounded-2xl bg-[#F8F6F2] p-4 text-sm text-gray-600">
                <p>1. Tap <strong>Share</strong> <span className="font-semibold">↑</span> in the Safari toolbar</p>
                <p>2. Scroll down and tap <strong>Add to Home Screen</strong></p>
                <p>3. Tap <strong>Add</strong> to confirm</p>
              </div>
            </div>
          ) : (
            /* Android — native prompt */
            <div>
              <p className="mb-4 text-sm text-gray-600">
                Install for a faster, app-like experience with offline access.
              </p>
              <button
                onClick={install}
                className="w-full rounded-2xl bg-[#D9C7A6] py-3.5 text-sm font-medium text-[#1E1E1E] hover:opacity-90 transition-opacity"
              >
                Add to Home Screen
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  return null;
}
