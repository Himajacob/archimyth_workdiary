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

import Alert from "./ui/Alert";

import {
  FiPlus,
  FiSave,
  FiSend,
  FiUsers,
  FiUserCheck,
  FiShield,
} from "react-icons/fi";

export default function UserManagement() {

  const [users, setUsers] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [messageType,
    setMessageType] =
    useState<
      "success" | "error"
    >("success");

  const [loading,
    setLoading] =
    useState(false);

  // -----------------------------------
  // Invite form state
  // -----------------------------------

  const [email, setEmail] =
    useState("");

  const [firstName,
    setFirstName] =
    useState("");

  const [lastName,
    setLastName] =
    useState("");

  const [role,
    setRole] =
    useState("site_manager");

  // -----------------------------------
  // Fetch users
  // -----------------------------------

  const fetchUsers = async () => {

    try {

      const token =
        getToken();

      if (!token) return;

      const data =
        await getUsers(
          token
        );

      setUsers(data);

    } catch (err: any) {

      setMessageType(
        "error"
      );

      setMessage(
        err.message
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -----------------------------------
  // Invite user
  // -----------------------------------

  const handleInvite =
    async () => {

      try {

        if (
          !firstName.trim() ||
          !lastName.trim() ||
          !email.trim()
        ) {

          setMessageType(
            "error"
          );

          setMessage(
            "All fields are required"
          );

          return;
        }

        setLoading(true);

        const token =
          getToken();

        if (!token) return;

        await inviteUser(
          token,
          {
            first_name:
              firstName,

            last_name:
              lastName,

            email,

            role,
          }
        );

        setMessageType(
          "success"
        );

        setMessage(
          "User invited successfully"
        );

        // reset
        setEmail("");
        setFirstName("");
        setLastName("");
        setRole(
          "site_manager"
        );

        await fetchUsers();

      } catch (err: any) {

        setMessageType(
          "error"
        );

        setMessage(
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // -----------------------------------
  // Update local
  // -----------------------------------

  const updateLocalUser = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [
      ...users
    ];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setUsers(updated);
  };

  // -----------------------------------
  // Save
  // -----------------------------------

  const handleSave =
    async (user: any) => {

      try {

        const token =
          getToken();

        if (!token) return;

        await updateUser(
          token,
          user.id,
          {
            first_name:
              user.first_name,

            last_name:
              user.last_name,

            email:
              user.email,

            role:
              user.role,

            is_active:
              user.is_active
          }
        );

        setMessageType(
          "success"
        );

        setMessage(
          "User updated successfully"
        );

        await fetchUsers();

      } catch (err: any) {

        setMessageType(
          "error"
        );

        setMessage(
          err.message
        );

        await fetchUsers();
      }
    };

  // -----------------------------------
  // Resend invite
  // -----------------------------------

  const handleResendInvite =
    async (
      userId: number
    ) => {

      try {

        const token =
          getToken();

        if (!token) return;

        await resendInvite(
          token,
          userId
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Invitation resent successfully"
        );

      } catch (err: any) {

        setMessageType(
          "error"
        );

        setMessage(
          err.message
        );
      }
    };

  // -----------------------------------
  // Status
  // -----------------------------------

  const getStatus = (
    user: any
  ) => {

    if (user.is_invited) {
      return "Pending";
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

    <div>

      {/* Header */}
      <div
        className="
          mb-8
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-semibold
              text-[#1E1E1E]
            "
          >
            User Management
          </h2>

          <p className="mt-2 text-gray-500">
            Manage team access and permissions
          </p>

        </div>

      </div>

      {/* Message */}
      {message && (

        <div className="mb-6">

          <Alert
            type={messageType}
            message={message}
          />

        </div>
      )}

      {/* Invite Form */}
      <div
        className="
          mb-8
          rounded-3xl
          border
          border-[#E8E5DF]
          bg-white
          p-8
          shadow-sm
        "
      >

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-[#D9C7A6]
              text-[#1E1E1E]
            "
          >

            <FiPlus />

          </div>

          <div>

            <h3
              className="
                text-xl
                font-semibold
                text-[#1E1E1E]
              "
            >
              Invite New User
            </h3>

            <p className="text-sm text-gray-500">
              Send account invitation email
            </p>

          </div>

        </div>

        {/* Form Grid */}
        <div
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >

          {/* First Name */}
          <div>

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-500
              "
            >
              First Name
            </label>

            <input
              value={firstName}
              onChange={(e) =>
                setFirstName(
                  e.target.value
                )
              }
              placeholder="John"
              className="
                w-full
                rounded-2xl
                border
                border-[#E8E5DF]
                bg-white
                px-4
                py-3
                text-[#1E1E1E]
                placeholder:text-gray-400
                outline-none
                focus:border-[#D9C7A6]
              "
            />

          </div>

          {/* Last Name */}
          <div>

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-500
              "
            >
              Last Name
            </label>

            <input
              value={lastName}
              onChange={(e) =>
                setLastName(
                  e.target.value
                )
              }
              placeholder="Doe"
              className="
                w-full
                rounded-2xl
                border
                border-[#E8E5DF]
                bg-white
                px-4
                py-3
                text-[#1E1E1E]
                placeholder:text-gray-400
                outline-none
                focus:border-[#D9C7A6]
              "
            />

          </div>

        </div>

        {/* Bottom Grid */}
        <div
          className="
            mt-5
            grid
            gap-5
            md:grid-cols-2
          "
        >

          {/* Email */}
          <div>

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-500
              "
            >
              Email Address
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="john@email.com"
              className="
                w-full
                rounded-2xl
                border
                border-[#E8E5DF]
                bg-white
                px-4
                py-3
                text-[#1E1E1E]
                placeholder:text-gray-400
                outline-none
                focus:border-[#D9C7A6]
              "
            />

          </div>

          {/* Role */}
          <div>

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-500
              "
            >
              User Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-2xl
                border
                border-[#E8E5DF]
                bg-white
                px-4
                py-3
                text-[#1E1E1E]
                outline-none
                focus:border-[#D9C7A6]
              "
            >

              <option value="site_manager">
                Site Manager
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

        </div>

        {/* Button */}
        <div className="mt-8">

          <button

            onClick={
              handleInvite
            }

            disabled={loading}

            className="
              flex
              items-center
              gap-2
              rounded-2xl
              bg-[#D9C7A6]
              px-6
              py-3
              text-sm
              font-medium
              text-[#1E1E1E]
              transition-all
              duration-300
              hover:scale-[1.02]
              disabled:opacity-50
            "
          >

            <FiSend />

            {loading
              ? "Sending..."
              : "Send Invitation"}

          </button>

        </div>

      </div>

      {/* Users */}
      <div className="space-y-5">

        {users.map(
          (u, index) => (

            <div
              key={u.id}
              className={`
                rounded-3xl
                border
                border-[#E8E5DF]
                bg-white
                p-6
                shadow-sm

                ${
                  !u.is_active
                    ? "opacity-60"
                    : ""
                }
              `}
            >

              {/* Top */}
              <div
                className="
                  flex
                  flex-col
                  gap-5
                  md:flex-row
                  md:items-start
                  md:justify-between
                "
              >

                {/* Left */}
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#F7F3EC]
                      text-[#1E1E1E]
                    "
                  >

                    <FiUsers size={22} />

                  </div>

                  <div>

                    <h3
                      className="
                        text-xl
                        font-semibold
                        text-[#1E1E1E]
                      "
                    >
                      {u.first_name}{" "}
                      {u.last_name}
                    </h3>

                    <p className="text-gray-500">
                      {u.email}
                    </p>

                  </div>

                </div>

                {/* Status */}
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >

                  <div
                    className={`
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      font-medium

                      ${
                        getStatus(u) ===
                        "Active"
                          ? `
                            bg-green-100
                            text-green-700
                          `
                          : getStatus(u) ===
                            "Pending"
                          ? `
                            bg-yellow-100
                            text-yellow-700
                          `
                          : `
                            bg-red-100
                            text-red-600
                          `
                      }
                    `}
                  >

                    {getStatus(u)}

                  </div>

                </div>

              </div>

              {/* Grid */}
              <div
                className="
                  mt-6
                  grid
                  gap-5
                  md:grid-cols-2
                "
              >

                {/* First Name */}
                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      text-gray-500
                    "
                  >
                    First Name
                  </label>

                  <input
                    value={
                      u.first_name || ""
                    }
                    onChange={(e) =>
                      updateLocalUser(
                        index,
                        "first_name",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#E8E5DF]
                      bg-white
                      px-4
                      py-3
                      text-[#1E1E1E]
                      outline-none
                      focus:border-[#D9C7A6]
                    "
                  />

                </div>

                {/* Last Name */}
                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      text-gray-500
                    "
                  >
                    Last Name
                  </label>

                  <input
                    value={
                      u.last_name || ""
                    }
                    onChange={(e) =>
                      updateLocalUser(
                        index,
                        "last_name",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#E8E5DF]
                      bg-white
                      px-4
                      py-3
                      text-[#1E1E1E]
                      outline-none
                      focus:border-[#D9C7A6]
                    "
                  />

                </div>

                {/* Email */}
                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      text-gray-500
                    "
                  >
                    Email
                  </label>

                  <input
                    value={u.email}
                    onChange={(e) =>
                      updateLocalUser(
                        index,
                        "email",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#E8E5DF]
                      bg-white
                      px-4
                      py-3
                      text-[#1E1E1E]
                      outline-none
                      focus:border-[#D9C7A6]
                    "
                  />

                </div>

                {/* Role */}
                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      text-gray-500
                    "
                  >
                    Role
                  </label>

                  <select
                    value={u.role}
                    onChange={(e) =>
                      updateLocalUser(
                        index,
                        "role",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#E8E5DF]
                      bg-white
                      px-4
                      py-3
                      text-[#1E1E1E]
                      outline-none
                      focus:border-[#D9C7A6]
                    "
                  >

                    <option value="site_manager">
                      Site Manager
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </div>

              </div>

              {/* Bottom */}
              <div
                className="
                  mt-6
                  flex
                  flex-col
                  gap-4
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >

                {/* Active */}
                <label
                  className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    text-gray-600
                  "
                >

                  <input
                    type="checkbox"
                    checked={
                      u.is_active
                    }
                    onChange={(e) =>
                      updateLocalUser(
                        index,
                        "is_active",
                        e.target.checked
                      )
                    }
                  />

                  Active User

                </label>

                {/* Actions */}
                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                  "
                >

                  {/* Resend */}
                  {u.is_invited && (

                    <button

                      onClick={() =>
                        handleResendInvite(
                          u.id
                        )
                      }

                      className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-[#D9C7A6]
                        bg-[#F8F6F2]
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-[#1E1E1E]
                        transition-all
                        hover:bg-[#EFE7D7]
                      "
                    >

                      <FiUserCheck />

                      Resend Invite

                    </button>
                  )}

                  {/* Save */}
                  <button

                    onClick={() =>
                      handleSave(u)
                    }

                    className="
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      bg-[#D9C7A6]
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-[#1E1E1E]
                      transition-all
                      duration-300
                      hover:scale-[1.02]
                    "
                  >

                    <FiSave />

                    Save Changes

                  </button>

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* Empty */}
      {users.length === 0 && (

        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-[#D9C7A6]
            bg-white
            p-12
            text-center
          "
        >

          <FiShield
            className="
              mx-auto
              mb-4
              text-4xl
              text-[#D9C7A6]
            "
          />

          <h3
            className="
              text-xl
              font-semibold
              text-[#1E1E1E]
            "
          >
            No Users Found
          </h3>

          <p className="mt-2 text-gray-500">
            Invite users to start collaborating
          </p>

        </div>
      )}

    </div>
  );
}