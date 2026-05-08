import {
  useEffect,
  useState
} from "react";

import {
  getSites,
  updateSite
} from "../api/site";

import {
  getToken
} from "../utils/auth";

type Props = {
  role: string;
  onAddSite: () => void;
};

export default function SiteList({
  role,
  onAddSite
}: Props) {

  const [sites, setSites] =
    useState<any[]>([]);

  const [error, setError] =
    useState("");

  const [showInactive,
    setShowInactive] =
    useState(false);

  // -----------------------------------
  // Fetch
  // -----------------------------------

  const fetchSites = async () => {

    try {

      const token = getToken();

      if (!token) return;

      const data =
        await getSites(
          token,
          showInactive
        );

      setSites(data);

    } catch (err: any) {

      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [showInactive]);

  // -----------------------------------
  // Local update
  // -----------------------------------

  const updateLocalSite = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [...sites];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setSites(updated);
  };

  // -----------------------------------
  // Save
  // -----------------------------------

  const handleSave = async (
    site: any
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      await updateSite(
        token,
        site.id,
        {
          project_name:
            site.project_name,

          location:
            site.location,

          status:
            site.status,

          duration_days:
            site.duration_days,

          is_active:
            site.is_active
        }
      );

      setError(
        "Site updated ✅"
      );

      await fetchSites();

    } catch (err: any) {

      setError(err.message);

      await fetchSites();
    }
  };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div style={{ padding: 20 }}>

      <h2>Sites</h2>

      {/* Admin */}
      {role === "admin" && (

        <>
          <button
            onClick={onAddSite}
          >
            Add Site
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
            Show inactive sites

          </label>

          <br /><br />
        </>
      )}

      {error && (
        <p>{error}</p>
      )}

      {sites.length === 0 ? (

        <p>No sites found</p>

      ) : (

        <div
          style={{
            display: "grid",
            gap: 20
          }}
        >

          {sites.map(
            (s, index) => (

              <div
                key={s.id}
                style={{
                  border:
                    "1px solid #ddd",

                  borderRadius: 12,

                  padding: 20,

                  opacity:
                    s.is_active
                      ? 1
                      : 0.5
                }}
              >

                {/* Project */}
                <div>

                  <strong>
                    Project
                  </strong>

                  <br />

                  {role === "admin" ? (

                    <input
                      value={
                        s.project_name
                      }
                      onChange={(e) =>
                        updateLocalSite(
                          index,
                          "project_name",
                          e.target.value
                        )
                      }
                    />

                  ) : (

                    <p>
                      {s.project_name}
                    </p>
                  )}
                </div>

                <br />

                {/* Location */}
                <div>

                  <strong>
                    Location
                  </strong>

                  <br />

                  {role === "admin" ? (

                    <input
                      value={
                        s.location
                      }
                      onChange={(e) =>
                        updateLocalSite(
                          index,
                          "location",
                          e.target.value
                        )
                      }
                    />

                  ) : (

                    <p>
                      {s.location}
                    </p>
                  )}
                </div>

                <br />

                {/* Status */}
                <div>

                  <strong>
                    Status
                  </strong>

                  <br />

                  {role === "admin" ? (

                    <select
                      value={s.status}
                      onChange={(e) =>
                        updateLocalSite(
                          index,
                          "status",
                          e.target.value
                        )
                      }
                    >

                      <option value="in_progress">
                        In Progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="paused">
                        Paused
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>

                    </select>

                  ) : (

                    <p>{s.status}</p>
                  )}
                </div>

                <br />

                {/* Duration */}
                <div>

                  <strong>
                    Duration
                  </strong>

                  <br />

                  {role === "admin" ? (

                    <input
                      type="number"
                      value={
                        s.duration_days || ""
                      }
                      onChange={(e) =>
                        updateLocalSite(
                          index,
                          "duration_days",
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />

                  ) : (

                    <p>
                      {s.duration_days}
                    </p>
                  )}
                </div>

                <br />

                {/* Active */}
                <div>

                  <strong>
                    Status:
                  </strong>

                  {" "}

                  {s.is_active
                    ? "Active"
                    : "Inactive"}

                </div>

                {/* Admin */}
                {role === "admin" && (

                  <>
                    <br />

                    <label>

                      <input
                        type="checkbox"
                        checked={
                          s.is_active
                        }
                        onChange={(e) =>
                          updateLocalSite(
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
                        handleSave(s)
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