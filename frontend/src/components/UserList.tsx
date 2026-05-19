import {
  useEffect,
  useState
} from "react";
import {
  useNavigate,
} from "react-router-dom";

import {
  getUsers,
  updateUser,
  resendInvite
} from "../api/user";

import {
  getToken
} from "../utils/auth";

import Alert from "./ui/Alert";
import CustomSelect from "./ui/CustomSelect";

import {
  FiChevronDown,
  FiChevronUp,
  FiEdit3,
  FiSave,
  FiSend,
} from "react-icons/fi";

const formatRole = (r: string) =>
  r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

type Props = {
  role: string;
};

export default function UserList({
  role,
}: Props) {

  const navigate =
    useNavigate();

  const [users, setUsers] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [messageType,
    setMessageType] =
    useState<
      "success" | "error"
    >("success");

  const [expandedUser,
    setExpandedUser] =
    useState<number | null>(null);

  const [editingUser,
    setEditingUser] =
    useState<number | null>(null);

  // -----------------------------------
  // Fetch
  // -----------------------------------

  const fetchUsers = async () => {

    try {

      const token =
        getToken();

      if (!token) return;

      const data =
        await getUsers(token);

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
  // Local update
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
  // Role change (immediate save)
  // -----------------------------------

  const handleRoleChange = async (
    index: number,
    userId: number,
    newRole: string
  ) => {
    updateLocalUser(index, "role", newRole);
    try {
      const token = getToken();
      if (!token) return;
      await updateUser(token, userId, { role: newRole });
      setMessageType("success");
      setMessage("Role updated");
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message);
    }
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

        setEditingUser(null);

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
          "Invite resent successfully"
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
            Users
          </h2>

          <p className="mt-2 text-gray-500">
            Manage platform users
          </p>

        </div>

        {(role === "admin" || role === "super_admin") && (

          <button

            onClick={() =>
              navigate("/users/create")
            }

            className="
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
            "
          >
            + Invite User
          </button>
        )}

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

      {/* Empty */}
      {users.length === 0 ? (

        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-[#D9C7A6]
            bg-white
            p-12
            text-center
            text-gray-500
          "
        >
          No users found
        </div>

      ) : (

        <div className="space-y-5">

          {users.map(
            (u, index) => {

              const expanded =
                expandedUser === u.id;

              const editing =
                editingUser === u.id;

              return (

                <div
                  key={u.id}
                  className={`
                    group
                    rounded-3xl
                    border
                    border-[#E8E5DF]
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-md

                    ${
                      !u.is_active
                        ? "opacity-60"
                        : ""
                    }
                  `}
                >

                  {/* TOP */}
                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      p-6
                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >

                    {/* Left */}
                    <div>

                      <h3
                        className="
                          text-xl
                          font-semibold
                          text-[#1E1E1E]
                          transition-colors
                          duration-200
                          group-hover:text-[#D9C7A6]
                        "
                      >
                        {u.first_name}{" "}
                        {u.last_name}
                      </h3>

                      <p className="mt-1 text-gray-500">
                        {u.email}
                      </p>

                    </div>

                    {/* Right */}
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      {/* Status */}
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

                      {/* Edit */}
                      <button

                        onClick={(e) => {
                          e.stopPropagation();
                          if (editing) {
                            setEditingUser(null);
                          } else {
                            setEditingUser(u.id);
                            setExpandedUser(u.id);
                          }
                        }}

                        className="
                          flex
                          items-center
                          gap-2
                          rounded-2xl
                          border
                          border-[#D9C7A6]
                          bg-[#F8F6F2]
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-[#1E1E1E]
                        "
                      >

                        <FiEdit3 />

                        {editing
                          ? "Cancel"
                          : "Edit"}

                      </button>

                      {/* View */}
                      <button

                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedUser(expanded ? null : u.id);
                        }}

                        className="
                          flex
                          items-center
                          gap-2
                          rounded-2xl
                          bg-[#1E1E1E]
                          px-5
                          py-2
                          text-sm
                          text-white
                        "
                      >

                        {expanded
                          ? (
                            <>
                              Hide
                              <FiChevronUp />
                            </>
                          )
                          : (
                            <>
                              View More
                              <FiChevronDown />
                            </>
                          )}

                      </button>

                    </div>

                  </div>

                  {/* Expanded */}
                  {expanded && (

                    <div
                      className="
                        border-t
                        border-[#E8E5DF]
                        bg-[#FAFAF9]
                        p-6
                      "
                    >

                      <div
                        className="
                          grid
                          gap-5
                          md:grid-cols-2
                        "
                      >

                        {/* First */}
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

                          {editing ? (

                            <input
                              value={
                                u.first_name
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
                              "
                            />

                          ) : (

                            <div
                              className="
                                rounded-2xl
                                bg-white
                                px-4
                                py-3
                                text-[#1E1E1E]
                              "
                            >
                              {u.first_name}
                            </div>
                          )}

                        </div>

                        {/* Last */}
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

                          {editing ? (

                            <input
                              value={
                                u.last_name
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
                              "
                            />

                          ) : (

                            <div
                              className="
                                rounded-2xl
                                bg-white
                                px-4
                                py-3
                                text-[#1E1E1E]
                              "
                            >
                              {u.last_name}
                            </div>
                          )}

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

                          {editing ? (

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
                              "
                            />

                          ) : (

                            <div
                              className="
                                rounded-2xl
                                bg-white
                                px-4
                                py-3
                                text-[#1E1E1E]
                              "
                            >
                              {u.email}
                            </div>
                          )}

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

                          {(role === "admin" || role === "super_admin") ? (

                            <CustomSelect
                              value={u.role}
                              onChange={(val) =>
                                handleRoleChange(
                                  index,
                                  u.id,
                                  String(val)
                                )
                              }
                              options={[
                                { value: "site_manager", label: "Site Manager" },
                                { value: "admin", label: "Admin" },
                                { value: "super_admin", label: "Super Admin" },
                              ]}
                            />

                          ) : (

                            <div
                              className="
                                rounded-2xl
                                bg-white
                                px-4
                                py-3
                                text-[#1E1E1E]
                              "
                            >
                              {formatRole(u.role)}
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Bottom */}
                      {editing && (

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

                          <div
                            className="
                              flex
                              gap-3
                            "
                          >

                            {u.is_invited && (

                              <button

                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResendInvite(u.id);
                                }}

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
                                  text-[#1E1E1E]
                                "
                              >

                                <FiSend />

                                Resend Invite

                              </button>
                            )}

                            <button

                              onClick={(e) => {
                                e.stopPropagation();
                                handleSave(u);
                              }}

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
                              "
                            >

                              <FiSave />

                              Save Changes

                            </button>

                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}
