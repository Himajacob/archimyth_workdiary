import { useEffect, useState } from "react";
import { getClients } from "../api/client";
import { getToken } from "../utils/auth";

type Props = {
  role: string;
  onAddClient: () => void;
};

export default function ClientList({ role, onAddClient }: Props) {
  const [clients, setClients] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const data = await getClients(token);
        setClients(data);

      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchClients();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Clients</h2>

      {/* 🔐 Admin only button */}
      {role === "admin" && (
        <button onClick={onAddClient}>
          Add Client
        </button>
      )}

      <br /><br />

      {error && <p>{error}</p>}

      {clients.length === 0 ? (
        <p>No clients found</p>
      ) : (
        <ul>
          {clients.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong> — {c.contact_number}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}