import { useState, useEffect } from "react";
import { register } from "../api/auth";

export default function Register() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get("token");

    if (inviteToken) {
      setToken(inviteToken);
    } else {
      setMessage("Invalid or missing token");
    }
  }, []);

  const handleRegister = async () => {
    try {
      await register(token, password);
      setMessage("Registration successful");

    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <input
        type="password"
        placeholder="Set Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleRegister}>Register</button>

      <p>{message}</p>
    </div>
  );
}