import {
  useEffect,
  useState
} from "react";

import {
  getClients,
  updateClient
} from "../api/client";

import {
  getToken
} from "../utils/auth";

type Props = {
  role: string;
  onAddClient: () => void;
};

export default function ClientList({
  role,
  onAddClient
}: Props) {

  const [clients, setClients] =
    useState<any[]>([]);

  const [error, setError] =
    useState("");

  const [showInactive,
    setShowInactive] =
    useState(false);

  // -----------------------------------
  // Fetch
  // -----------------------------------

  const fetchClients = async () => {

    try {

      const token = getToken();

      if (!token) return;

      const data =
        await getClients(
          token,
          showInactive
        );

      setClients(data);

    } catch (err: any) {

      setError(err.message);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [showInactive]);

  // -----------------------------------
  // Update local
  // -----------------------------------

  const updateLocalClient = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [...clients];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setClients(updated);
  };

  // -----------------------------------
  // Save
  // -----------------------------------

  const handleSave = async (
    client: any
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      await updateClient(
        token,
        client.id,
        {
          name: client.name,
          contact_number:
            client.contact_number,
          address:
            client.address,
          is_active:
            client.is_active
        }
      );

      setError(
        "Client updated ✅"
      );

      await fetchClients();

    } catch (err: any) {

      setError(err.message);

      await fetchClients();
    }
  };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div style={{ padding: 20 }}>

      <h2>Clients</h2>

      {/* Admin controls */}
      {role === "admin" && (

        <>
          <button
            onClick={onAddClient}
          >
            Add Client
          </button>

          <br /><br />

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
            Show inactive clients

          </label>

          <br /><br />
        </>
      )}

      {error && (
        <p>{error}</p>
      )}

      {clients.length === 0 ? (

        <p>No clients found</p>

      ) : (

        <div
          style={{
            display: "grid",
            gap: 20
          }}
        >

          {clients.map(
            (c, index) => (

              <div
                key={c.id}
                style={{
                  border:
                    "1px solid #ddd",

                  borderRadius: 12,

                  padding: 20,

                  opacity:
                    c.is_active
                      ? 1
                      : 0.5
                }}
              >

                {/* Name */}
                <div>
                  <strong>
                    Name
                  </strong>

                  <br />

                  {role === "admin" ? (

                    <input
                      value={c.name}
                      onChange={(e) =>
                        updateLocalClient(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                    />

                  ) : (

                    <p>{c.name}</p>
                  )}
                </div>

                <br />

                {/* Contact */}
                <div>

                  <strong>
                    Contact
                  </strong>

                  <br />

                  {role === "admin" ? (

                    <input
                      value={
                        c.contact_number || ""
                      }
                      onChange={(e) =>
                        updateLocalClient(
                          index,
                          "contact_number",
                          e.target.value
                        )
                      }
                    />

                  ) : (

                    <p>
                      {c.contact_number}
                    </p>
                  )}
                </div>

                <br />

                {/* Address */}
                <div>

                  <strong>
                    Address
                  </strong>

                  <br />

                  {role === "admin" ? (

                    <textarea
                      value={
                        c.address || ""
                      }
                      onChange={(e) =>
                        updateLocalClient(
                          index,
                          "address",
                          e.target.value
                        )
                      }
                    />

                  ) : (

                    <p>
                      {c.address}
                    </p>
                  )}
                </div>

                <br />

                {/* Status */}
                <div>

                  <strong>
                    Status:
                  </strong>

                  {" "}

                  {c.is_active
                    ? "Active"
                    : "Inactive"}

                </div>

                {/* Admin controls */}
                {role === "admin" && (

                  <>
                    <br />

                    <label>

                      <input
                        type="checkbox"
                        checked={
                          c.is_active
                        }
                        onChange={(e) =>
                          updateLocalClient(
                            index,
                            "is_active",
                            e.target.checked
                          )
                        }
                      />

                      {" "}
                      Active

                    </label>

                    <br /><br />

                    <button
                      onClick={() =>
                        handleSave(c)
                      }
                    >
                      Save Changes
                    </button>
                  </>
                )}

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}