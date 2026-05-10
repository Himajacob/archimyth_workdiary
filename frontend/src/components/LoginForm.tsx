import { useState } from "react";

import { login } from "../api/auth";

import Alert from "./ui/Alert";

type Props = {
  onLogin: () => void;
};

export default function LoginForm({
  onLogin,
}: Props) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // -----------------------------------
  // Login
  // -----------------------------------

  const handleLogin = async () => {

    try {

      setLoading(true);

      setMessage("");

      const data = await login(
        email,
        password
      );

      localStorage.setItem(
        "token",
        data.access_token
      );

      onLogin();

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

    <div
      className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-black/30
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
            tracking-[0.35em]
            text-white
          "
        >
          ARCHIMYTH
        </h1>

      </div>

      {/* Error Message */}
      {message && (
        <Alert
          type="error"
          message={message}
        />
      )}

      {/* Email */}
      <div className="mb-5">

        <label
          className="
            mb-2
            block
            text-sm
            text-gray-300
          "
        >
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            rounded-xl
            border
            border-[#D9C7A6]/40
            bg-black/40
            px-4
            py-3
            text-base
            text-white
            placeholder:text-gray-400
            outline-none
            transition-all
            duration-300
            focus:border-[#D9C7A6]
            focus:ring-2
            focus:ring-[#D9C7A6]/30
          "
        />

      </div>

      {/* Password */}
      <div className="mb-3">

        <label
          className="
            mb-2
            block
            text-sm
            text-gray-300
          "
        >
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
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
            border-[#D9C7A6]/40
            bg-black/40
            px-4
            py-3
            text-base
            text-white
            placeholder:text-gray-400
            outline-none
            transition-all
            duration-300
            focus:border-[#D9C7A6]
            focus:ring-2
            focus:ring-[#D9C7A6]/30
          "
        />

      </div>

      {/* Forgot Password */}
      <div className="mb-6 text-right">

        <button
          className="
            text-sm
            text-[#D9C7A6]
            transition
            hover:opacity-80
          "
        >
          Forgot Password?
        </button>

      </div>

      {/* Login Button */}
      <button

        onClick={handleLogin}

        disabled={loading}

        className="
          w-full
          rounded-xl
          bg-[#D9C7A6]
          py-3
          font-adam
          tracking-[0.25em]
          text-[#1E1E1E]
          transition-all
          duration-300
          hover:scale-[1.02]
          hover:shadow-[0_0_25px_rgba(217,199,166,0.35)]
          disabled:opacity-50
        "
      >

        {loading
          ? "LOADING..."
          : "LOGIN"}

      </button>

    </div>
  );
}