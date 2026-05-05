import { useEffect, useState } from "react";
import { getWorkTypes } from "../api/workType";
import { getToken } from "../utils/auth";

type Props = {
  role: string;
  onAdd: () => void;
};

export default function WorkTypeList({ role, onAdd }: Props) {
  const [types, setTypes] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const data = await getWorkTypes(token);
        setTypes(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Work Types</h2>

      {role === "admin" && (
        <button onClick={onAdd}>Add Work Type</button>
      )}

      <br /><br />

      {error && <p>{error}</p>}

      {types.length === 0 ? (
        <p>No work types found</p>
      ) : (
        <ul>
          {types.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}