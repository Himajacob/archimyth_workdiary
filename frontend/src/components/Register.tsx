import { useState, useEffect } from "react";
import { register } from "../api/auth";

export default function Register() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get("token");

    if (!inviteToken) {
      setMessage("Invalid or missing token");
      return;
    }

    setToken(inviteToken);
  }, []);

  const handleRegister = async () => {
    if (!token) return;

    try {
      await register(token, password);

      setSuccess(true);
      setMessage("Registration successful! Redirecting to login...");

      // ⏳ redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      {message && <p>{message}</p>}

      {!success && token && (
        <>
          <input
            type="password"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br /><br />

          <button onClick={handleRegister}>
            Register
          </button>
        </>
      )}
    </div>
  );
}