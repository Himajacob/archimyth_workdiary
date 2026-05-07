import { useState } from "react";

import {
  login,
  forgotPassword
} from "../api/auth";

type Props = {
  onLogin: () => void;
};

export default function Login({
  onLogin
}: Props) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  // -----------------------------------
  // Login
  // -----------------------------------

  const handleLogin = async () => {

    try {

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
    }
  };

  // -----------------------------------
  // Forgot password
  // -----------------------------------

  const handleForgotPassword =
    async () => {

      try {

        if (!email.trim()) {

          setMessage(
            "Enter your email first"
          );

          return;
        }

        const data =
          await forgotPassword(
            email
          );

        setMessage(
          data.message
        );

      } catch (err: any) {

        setMessage(err.message);
      }
    };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div style={{ padding: 20 }}>

      <h2>Login</h2>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <br /><br />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <br /><br />

      {/* Login */}
      <button
        onClick={handleLogin}
      >
        Login
      </button>

      {/* Forgot password */}
      <button
        onClick={
          handleForgotPassword
        }
        style={{
          marginLeft: 10
        }}
      >
        Forgot Password?
      </button>

      <p>{message}</p>

    </div>
  );
}