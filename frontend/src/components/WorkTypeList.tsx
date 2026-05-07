import { useEffect, useState } from "react";

import {
  getWorkTypes,
  activateWorkType,
  deactivateWorkType,
} from "../api/workType";

import { getToken } from "../utils/auth";

type Props = {
  role: string;
  onAdd: () => void;
};

export default function WorkTypeList({
  role,
  onAdd,
}: Props) {

  const [types, setTypes] = useState<any[]>([]);
  const [error, setError] = useState("");

  // ✅ NEW
  const [showInactive, setShowInactive] =
    useState(false);

  const fetchData = async () => {
    try {
      const token = getToken();

      if (!token) return;

      // ✅ pass checkbox value
      const data = await getWorkTypes(
        token,
        showInactive
      );

      setTypes(data);

    } catch (err: any) {

      setError(err.message);
    }
  };

  // ✅ reload when checkbox changes
  useEffect(() => {
    fetchData();
  }, [showInactive]);

  const handleToggle = async (
    id: number,
    isActive: boolean
  ) => {
    try {

      const token = getToken();

      if (!token) return;

      if (isActive) {

        await deactivateWorkType(
          token,
          id
        );

      } else {

        await activateWorkType(
          token,
          id
        );
      }

      fetchData();

    } catch (err: any) {

      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Work Types</h2>

      {role === "admin" && (
        <>
          <button onClick={onAdd}>
            Add Work Type
          </button>

          <br /><br />

          {/* ✅ NEW CHECKBOX */}
          <label>
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) =>
                setShowInactive(
                  e.target.checked
                )
              }
            />

            {" "}
            Show inactive work types
          </label>
        </>
      )}

      <br /><br />

      {error && <p>{error}</p>}

      {types.length === 0 ? (

        <p>No work types found</p>

      ) : (

        <table
          border={1}
          cellPadding={10}
          style={{
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>

              {role === "admin" && (
                <th>Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {types.map((t) => (
              <tr
                key={t.id}

                // ✅ fade inactive rows
                style={{
                  opacity: t.is_active ? 1 : 0.5
                }}
              >
                <td>{t.id}</td>

                <td>{t.name}</td>

                <td>
                  {t.is_active
                    ? "Active"
                    : "Inactive"}
                </td>

                {role === "admin" && (
                  <td>
                    {t.is_active ? (
                      <button
                        onClick={() =>
                          handleToggle(
                            t.id,
                            true
                          )
                        }
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleToggle(
                            t.id,
                            false
                          )
                        }
                      >
                        Activate
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}