import { useState } from "react";
import { createWorkType } from "../api/workType";
import { getToken } from "../utils/auth";

type Props = {
  onBack: () => void;
};

export default function CreateWorkType({ onBack }: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await createWorkType(token, { name });

      setMessage("Work type created ✅");

      setTimeout(() => {
        onBack();
      }, 1000);

    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Work Type</h2>

      <input
        placeholder="Work Type Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreate}>Create</button>
      <button onClick={onBack}>Back</button>

      <p>{message}</p>
    </div>
  );
}