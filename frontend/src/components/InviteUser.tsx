import { useState } from "react";
import { inviteUser } from "../api/user";
import { getToken, logout } from "../utils/auth";

type Props = {
  onLogout: () => void;
};

export default function InviteUser({ onLogout }: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("site_manager");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    try {
      const token = getToken();

      if (!token) {
        setMessage("Not authenticated");
        return;
      }

      await inviteUser(token, {
        first_name: firstName,
        last_name: lastName,
        email,
        role,
      });

      setMessage("User invited successfully ✅");

    } catch (err: any) {
      setMessage(err.message);

      if (err.message.includes("Session expired")) {
        logout();
        onLogout();
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Invite User</h2>

      <button onClick={() => {
        logout();
        onLogout();
      }}>
        Logout
      </button>

      <br /><br />

      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="site_manager">Site Manager</option>
        <option value="admin">Admin</option>
      </select>

      <br /><br />

      <button onClick={handleInvite}>Invite</button>

      <p>{message}</p>
    </div>
  );
}