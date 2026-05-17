import { useState, useEffect } from "react";

import { login, forgotPassword } from "../api/auth";
import { API_BASE_URL } from "../api/http";

import Alert from "./ui/Alert";

export default function LoginForm() {

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);

  const [forgotMode, setForgotMode]     = useState(false);
  const [forgotEmail, setForgotEmail]   = useState("");
  const [forgotMsg, setForgotMsg]       = useState("");
  const [forgotType, setForgotType]     = useState<"success" | "error">("success");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Warm up the server as soon as login page loads
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`, { method: "GET" }).catch(() => {});
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      window.location.replace("/#/clients");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      setForgotType("error");
      setForgotMsg("Please enter your email");
      return;
    }
    try {
      setForgotLoading(true);
      setForgotMsg("");
      const data = await forgotPassword(forgotEmail.trim());
      setForgotType("success");
      setForgotMsg(data.message || "Reset link sent — check your email");
    } catch (err: any) {
      setForgotType("error");
      setForgotMsg(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className="
        w-full max-w-md rounded-3xl
        border border-white/10
        bg-black/30 p-10 shadow-2xl backdrop-blur-xl
      "
    >

      {/* Logo */}
      <div className="mb-10 flex flex-col items-center">
        <img
          src="/logo.png"
          alt="ARCHIMYTH Logo"
          className="mb-6 w-44 drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]"
        />
        <h1 className="font-adam text-3xl tracking-[0.35em] text-white">
          ARCHIMYTH
        </h1>
      </div>

      {/* ── FORGOT PASSWORD VIEW ── */}
      {forgotMode ? (
        <>
          <p className="mb-6 text-center text-sm text-gray-300">
            Enter your email and we'll send you a reset link.
          </p>

          {forgotMsg && (
            <div className="mb-5">
              <Alert type={forgotType} message={forgotMsg} />
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="
                w-full rounded-xl border border-[#D9C7A6]/40
                bg-black/40 px-4 py-3 text-base text-white
                placeholder:text-gray-400 outline-none
                transition-all duration-300
                focus:border-[#D9C7A6] focus:ring-2 focus:ring-[#D9C7A6]/30
              "
            />
          </div>

          <button
            onClick={handleForgotPassword}
            disabled={forgotLoading}
            className="
              mb-4 w-full rounded-xl bg-[#D9C7A6] py-3
              font-adam tracking-[0.25em] text-[#1E1E1E]
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(217,199,166,0.35)]
              disabled:opacity-50
            "
          >
            {forgotLoading ? "SENDING..." : "SEND RESET LINK"}
          </button>

          <button
            onClick={() => { setForgotMode(false); setForgotMsg(""); setForgotEmail(""); }}
            className="w-full text-center text-sm text-gray-400 transition hover:text-white"
          >
            Back to login
          </button>
        </>
      ) : (

        /* ── LOGIN VIEW ── */
        <>
          {message && (
            <Alert type="error" message={message} />
          )}

          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full rounded-xl border border-[#D9C7A6]/40
                bg-black/40 px-4 py-3 text-base text-white
                placeholder:text-gray-400 outline-none
                transition-all duration-300
                focus:border-[#D9C7A6] focus:ring-2 focus:ring-[#D9C7A6]/30
              "
            />
          </div>

          <div className="mb-3">
            <label className="mb-2 block text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full rounded-xl border border-[#D9C7A6]/40
                bg-black/40 px-4 py-3 text-base text-white
                placeholder:text-gray-400 outline-none
                transition-all duration-300
                focus:border-[#D9C7A6] focus:ring-2 focus:ring-[#D9C7A6]/30
              "
            />
          </div>

          <div className="mb-6 text-right">
            <button
              onClick={() => setForgotMode(true)}
              className="text-sm text-[#D9C7A6] transition hover:opacity-80"
            >
              Forgot Password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full rounded-xl bg-[#D9C7A6] py-3
              font-adam tracking-[0.25em] text-[#1E1E1E]
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(217,199,166,0.35)]
              disabled:opacity-50
            "
          >
            {loading ? "LOADING..." : "LOGIN"}
          </button>
        </>
      )}

    </div>
  );
}
