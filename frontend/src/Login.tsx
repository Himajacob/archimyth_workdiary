import { useState } from "react";
import { login } from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.access_token);

      setMessage("Login successful ✅");
      console.log("TOKEN:", data.access_token);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const callProtected = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Protected response:", data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <br /><br />

      <button onClick={callProtected}>
        Call Protected API
      </button>

      <p>{message}</p>
    </div>
  );
}