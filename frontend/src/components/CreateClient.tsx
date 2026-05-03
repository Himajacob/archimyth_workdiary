import { useState } from "react";
import { createClient } from "../api/client";
import { getToken } from "../utils/auth";

type Props = {
  onBack: () => void;
};

export default function CreateClient({ onBack }: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await createClient(token, {
        name,
        contact_number: contact,
        address,
      });

      setMessage("Client created ✅");

      setTimeout(() => {
        onBack();
      }, 1000);

    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Client</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Contact Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreate}>Create</button>
      <button onClick={onBack}>Back</button>

      <p>{message}</p>
    </div>
  );
}