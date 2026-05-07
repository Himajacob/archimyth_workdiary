import { useState } from "react";

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

  // -----------------------------------
  // Get token from URL
  // -----------------------------------

  const params =
    new URLSearchParams(
      window.location.search
    );

  const token =
    params.get("token");

  // -----------------------------------
  // Reset password
  // -----------------------------------

  const handleResetPassword =
    async () => {

      try {

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

        const data =
          await resetPassword(
            token,
            password
          );

        setMessage(
          data.message +
          " ✅"
        );

        // redirect to login
        setTimeout(() => {

          window.location.href =
            "/";

        }, 2000);

      } catch (err: any) {

        setMessage(
          err.message
        );
      }
    };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div style={{ padding: 20 }}>

      <h2>Reset Password</h2>

      {/* Password */}
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <br /><br />

      {/* Confirm */}
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(
            e.target.value
          )
        }
      />

      <br /><br />

      <button
        onClick={
          handleResetPassword
        }
      >
        Reset Password
      </button>

      <p>{message}</p>

    </div>
  );
}