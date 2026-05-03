import { useEffect, useState } from "react";
import { getSites } from "../api/site";
import { getToken } from "../utils/auth";

type Props = {
  role: string;
  onAddSite: () => void;
};

export default function SiteList({ role, onAddSite }: Props) {
  const [sites, setSites] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const data = await getSites(token);
        setSites(data);

      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchSites();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Sites</h2>

      {/* Admin only */}
      {role === "admin" && (
        <button onClick={onAddSite}>
          Add Site
        </button>
      )}

      <br /><br />

      {error && <p>{error}</p>}

      {sites.length === 0 ? (
        <p>No sites found</p>
      ) : (
        <ul>
          {sites.map((s) => (
            <li key={s.id}>
              <strong>{s.project_name}</strong> — {s.location} ({s.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}