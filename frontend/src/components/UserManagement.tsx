import {
  useEffect,
  useState
} from "react";

import {
  inviteUser,
  getUsers,
  updateUser,
  resendInvite
} from "../api/user";

import {
  getToken
} from "../utils/auth";

export default function UserManagement() {

  const [users, setUsers] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  // -----------------------------------
  // Invite form state
  // -----------------------------------

  const [email, setEmail] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [role, setRole] =
    useState("site_manager");

  // -----------------------------------
  // Fetch users
  // -----------------------------------

  const fetchUsers = async () => {

    try {

      const token = getToken();

      if (!token) return;

      const data = await getUsers(
        token
      );

      setUsers(data);

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -----------------------------------
  // Invite user
  // -----------------------------------

  const handleInvite = async () => {

    try {

      const token = getToken();

      if (!token) {
        setMessage(
          "Not authenticated"
        );

        return;
      }

      await inviteUser(token, {
        first_name: firstName,
        last_name: lastName,
        email,
        role,
      });

      setMessage(
        "User invited successfully ✅"
      );

      // reset form
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("site_manager");

      await fetchUsers();

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------------
  // Update local user state
  // -----------------------------------

  const updateLocalUser = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [...users];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setUsers(updated);
  };

  // -----------------------------------
  // Save user
  // -----------------------------------

  const handleSave = async (
    user: any
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      await updateUser(
        token,
        user.id,
        {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          is_active: user.is_active
        }
      );

      setMessage(
        "User updated ✅"
      );

      // ✅ reload clean state
      await fetchUsers();

    } catch (err: any) {

      setMessage(err.message);

      // ✅ restore backend state
      await fetchUsers();
    }
  };

  // -----------------------------------
  // Resend invite
  // -----------------------------------

  const handleResendInvite = async (
    userId: number
  ) => {

    try {

      const token = getToken();

      if (!token) return;

      await resendInvite(
        token,
        userId
      );

      setMessage(
        "Invite resent ✅"
      );

    } catch (err: any) {

      setMessage(err.message);
    }
  };

  // -----------------------------------
  // Status
  // -----------------------------------

  const getStatus = (
    user: any
  ) => {

    if (user.is_invited) {
      return "Invitation Pending";
    }

    if (!user.is_active) {
      return "Inactive";
    }

    return "Active";
  };

  // -----------------------------------
  // UI
  // -----------------------------------

  return (

    <div style={{ padding: 20 }}>

      <h2>User Management</h2>

      {/* ----------------------------------- */}
      {/* Invite Form */}
      {/* ----------------------------------- */}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 20,
          marginBottom: 30
        }}
      >

        <h3>Invite User</h3>

        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) =>
            setFirstName(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) =>
            setLastName(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <br /><br />

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
        >
          <option value="site_manager">
            Site Manager
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <br /><br />

        <button
          onClick={handleInvite}
        >
          Invite User
        </button>

      </div>

      {/* ----------------------------------- */}
      {/* Users Table */}
      {/* ----------------------------------- */}

      <table
        border={1}
        cellPadding={10}
        style={{
          borderCollapse: "collapse",
          width: "100%"
        }}
      >

        <thead>

          <tr>
            <th>ID</th>

            <th>First Name</th>

            <th>Last Name</th>

            <th>Email</th>

            <th>Role</th>

            <th>Status</th>

            <th>Active</th>

            <th>Invite</th>

            <th>Save</th>
          </tr>

        </thead>

        <tbody>

          {users.map((u, index) => (

            <tr
              key={u.id}
              style={{
                opacity:
                  u.is_active ? 1 : 0.5
              }}
            >

              <td>{u.id}</td>

              {/* First name */}
              <td>

                <input
                  value={u.first_name || ""}
                  onChange={(e) =>
                    updateLocalUser(
                      index,
                      "first_name",
                      e.target.value
                    )
                  }
                />

              </td>

              {/* Last name */}
              <td>

                <input
                  value={u.last_name || ""}
                  onChange={(e) =>
                    updateLocalUser(
                      index,
                      "last_name",
                      e.target.value
                    )
                  }
                />

              </td>

              {/* Email */}
              <td>

                <input
                  value={u.email}
                  onChange={(e) =>
                    updateLocalUser(
                      index,
                      "email",
                      e.target.value
                    )
                  }
                />

              </td>

              {/* Role */}
              <td>

                <select
                  value={u.role}
                  onChange={(e) =>
                    updateLocalUser(
                      index,
                      "role",
                      e.target.value
                    )
                  }
                >

                  <option value="site_manager">
                    Site Manager
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                </select>

              </td>

              {/* Status */}
              <td>

                {getStatus(u)}

              </td>

              {/* Active */}
              <td>

                <input
                  type="checkbox"
                  checked={u.is_active}
                  onChange={(e) =>
                    updateLocalUser(
                      index,
                      "is_active",
                      e.target.checked
                    )
                  }
                />

              </td>

              {/* Resend invite */}
              <td>

                {u.is_invited && (
                  <button
                    onClick={() =>
                      handleResendInvite(
                        u.id
                      )
                    }
                  >
                    Resend
                  </button>
                )}

              </td>

              {/* Save */}
              <td>

                <button
                  onClick={() =>
                    handleSave(u)
                  }
                >
                  Save
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      <br />

      <p>{message}</p>

    </div>
  );
}