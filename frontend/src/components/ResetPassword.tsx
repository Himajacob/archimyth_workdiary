import { useState } from "react";

import { useSearchParams } from "react-router-dom";

import { resetPassword } from "../api/auth";

import AuthLayout from "./layout/AuthLayout";
import Alert from "./ui/Alert";

type MessageType = "success" | "error";

export default function ResetPassword() {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage]                 = useState("");
  const [messageType, setMessageType]         = useState<MessageType>("success");
  const [loading, setLoading]                 = useState(false);
  const [success, setSuccess]                 = useState(false);

  const handleReset = async () => {
    try {
      setMessage("");

      if (!token) {
        setMessageType("error");
        setMessage("Invalid reset link");
        return;
      }

      if (!password.trim()) {
        setMessageType("error");
        setMessage("Password is required");
        return;
      }

      if (password.length < 6) {
        setMessageType("error");
        setMessage("Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        setMessageType("error");
        setMessage("Passwords do not match");
        return;
      }

      setLoading(true);
      const data = await resetPassword(token, password);
      setSuccess(true);
      setMessageType("success");
      setMessage(data.message + " Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
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
          <p className="mt-4 text-sm text-gray-300">Set your new password</p>
        </div>

        {message && (
          <div className="mb-6">
            <Alert type={messageType} message={message} />
          </div>
        )}

        {!success && token && (
          <>
            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-300">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
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

            <div className="mb-8">
              <label className="mb-2 block text-sm text-gray-300">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClick={handleReset}
              disabled={loading}
              className="
                w-full rounded-xl bg-[#D9C7A6] py-3
                font-adam tracking-[0.25em] text-[#1E1E1E]
                transition-all duration-300
                hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(217,199,166,0.35)]
                disabled:opacity-50
              "
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </>
        )}

      </div>
    </AuthLayout>
  );
}
