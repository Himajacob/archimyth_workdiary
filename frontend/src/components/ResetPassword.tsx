import { useState } from "react";

import { useSearchParams } from "react-router-dom";

import {
  resetPassword
} from "../api/auth";

export default function ResetPassword() {

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // -----------------------------------
  // Reset Password
  // -----------------------------------

  const handleResetPassword =
    async () => {

      try {

        setMessage("");

        if (!token) {

          setMessage(
            "Invalid reset link"
          );

          return;
        }

        if (!password.trim()) {

          setMessage(
            "Password required"
          );

          return;
        }

        if (
          password.length < 6
        ) {

          setMessage(
            "Password must be at least 6 characters"
          );

          return;
        }

        if (
          password !==
          confirmPassword
        ) {

          setMessage(
            "Passwords do not match"
          );

          return;
        }

        setLoading(true);

        const data =
          await resetPassword(
            token,
            password
          );

        setMessage(
          data.message +
          " ✅ Redirecting..."
        );

        // Redirect back to login
        setTimeout(() => {

          window.location.href =
            "/";

        }, 2000);

      } catch (err: any) {

        setMessage(
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">

      {/* Background */}
      <img
        src="/login-bg.jpeg"
        alt="background"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Blur */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Reset Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-white/10
          p-10
          shadow-2xl
          backdrop-blur-xl
        "
      >

        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">

          <img
            src="/logo.png"
            alt="ARCHIMYTH Logo"
            className="
              mb-6
              w-44
              drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]
            "
          />

          <h1
            className="
              font-adam
              text-3xl
              tracking-[0.45em]
              text-white
            "
          >
            RESET PASSWORD
          </h1>

        </div>

        {/* Password */}
        <div className="mb-5">

          <label className="mb-2 block text-sm text-gray-300">
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/30
              px-4
              py-3
              text-white
              outline-none
              transition-all
              duration-300
              focus:border-primary
              focus:ring-2
              focus:ring-primary/30
            "
          />

        </div>

        {/* Confirm Password */}
        <div className="mb-6">

          <label className="mb-2 block text-sm text-gray-300">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/30
              px-4
              py-3
              text-white
              outline-none
              transition-all
              duration-300
              focus:border-primary
              focus:ring-2
              focus:ring-primary/30
            "
          />

        </div>

        {/* Message */}
        {message && (

          <div
            className="
              mb-5
              rounded-lg
              border
              border-white/10
              bg-white/5
              p-3
              text-sm
              text-gray-200
            "
          >
            {message}
          </div>
        )}

        {/* Reset Button */}
        <button

          onClick={
            handleResetPassword
          }

          disabled={loading}

          className="
            w-full
            rounded-xl
            bg-primary
            py-3
            font-adam
            tracking-[0.25em]
            text-black
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-glow
            disabled:opacity-50
          "
        >

          {loading
            ? "RESETTING..."
            : "RESET PASSWORD"}

        </button>

      </div>
    </div>
  );
}