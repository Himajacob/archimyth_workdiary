import { useEffect, useState } from "react";
import { createSite } from "../api/site";
import { getClients } from "../api/client";
import { getToken } from "../utils/auth";

type Props = {
  onBack: () => void;
};

export default function CreateSite({ onBack }: Props) {
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState<number | null>(null);

  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const data = await getClients(token);
        setClients(data);

      } catch (err: any) {
        setMessage(err.message);
      }
    };

    fetchClients();
  }, []);

  const handleCreate = async () => {
    try {
      const token = getToken();
      if (!token || !clientId) {
        setMessage("Client is required");
        return;
      }

      await createSite(token, {
        client_id: clientId,
        project_name: projectName,
        location,
        start_date: startDate,
        duration_days: duration ? Number(duration) : null,
      });

      setMessage("Site created ✅");

      setTimeout(() => {
        onBack();
      }, 1000);

    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Site</h2>

      {/* Client dropdown */}
      <select onChange={(e) => setClientId(Number(e.target.value))}>
        <option value="">Select Client</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Duration (days)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreate}>Create</button>
      <button onClick={onBack}>Back</button>

      <p>{message}</p>
    </div>
  );
}