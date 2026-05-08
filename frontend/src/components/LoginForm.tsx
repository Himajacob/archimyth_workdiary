import { useState } from "react";

import {
  login,
  forgotPassword
} from "../api/auth";

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

  const [forgotLoading,
    setForgotLoading] =
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

      setMessage(err.message);

    } finally {

      setLoading(false);
    }
  };

  // -----------------------------------
  // Forgot Password
  // -----------------------------------

  const handleForgotPassword =
    async () => {

      try {

        setMessage("");

        if (!email.trim()) {

          setMessage(
            "Please enter your email first"
          );

          return;
        }

        setForgotLoading(true);

        const data =
          await forgotPassword(
            email
          );

        setMessage(
          data.message
        );

      } catch (err: any) {

        setMessage(
          err.message
        );

      } finally {

        setForgotLoading(false);
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
          ARCHIMYTH
        </h1>

      </div>

      {/* Email */}
      <div className="mb-5">

        <label className="mb-2 block text-sm text-gray-300">
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

      {/* Password */}
      <div className="mb-3">

        <label className="mb-2 block text-sm text-gray-300">
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

      {/* Forgot Password */}
      <div className="mb-6 text-right">

        <button

          onClick={
            handleForgotPassword
          }

          disabled={forgotLoading}

          className="
            text-sm
            text-primary
            transition
            hover:opacity-80
            disabled:opacity-50
          "
        >

          {forgotLoading
            ? "SENDING..."
            : "Forgot Password?"}

        </button>

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

      {/* Login Button */}
      <button

        onClick={handleLogin}

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
          ? "LOADING..."
          : "LOGIN"}

      </button>

    </div>
  );
}