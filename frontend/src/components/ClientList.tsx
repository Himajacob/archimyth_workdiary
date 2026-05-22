import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getClients,
  updateClient
} from "../api/client";

import {
  inviteUser,
  resendInvite,
} from "../api/user";

import {
  getToken
} from "../utils/auth";

import Alert from "./ui/Alert";
import SkeletonList from "./ui/SkeletonList";

import {
  FiChevronDown,
  FiChevronUp,
  FiEdit3,
  FiSave,
  FiArrowRight,
  FiSend,
  FiUserPlus,
} from "react-icons/fi";

type Props = {
  role: string;
};

export default function ClientList({
  role,
}: Props) {

  const [clients, setClients] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [messageType,
    setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const [showInactive,
    setShowInactive] =
    useState(false);

  const [expandedClient,
    setExpandedClient] =
    useState<number | null>(null);

  const [editingClient,
    setEditingClient] =
    useState<number | null>(null);

  const [inviteForms, setInviteForms] =
    useState<Record<number, { first_name: string; last_name: string; email: string }>>({});

  const [invitingClientId, setInvitingClientId] =
    useState<number | null>(null);

  const navigate = useNavigate();

  // -----------------------------------
  // Fetch
  // -----------------------------------

  const fetchClients = async () => {

    try {

      setLoading(true);

      const token = getToken();

      if (!token) return;

      const data =
        await getClients(
          token,
          showInactive
        );

      setClients(data);

    } catch (err: any) {

      setMessageType("error");

      setMessage(err.message);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [showInactive]);

  // -----------------------------------
  // Update Local
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
  // Invite client user
  // -----------------------------------

  const getInviteForm = (clientId: number) =>
    inviteForms[clientId] ?? { first_name: "", last_name: "", email: "" };

  const setInviteField = (clientId: number, field: string, value: string) => {
    setInviteForms((prev) => ({
      ...prev,
      [clientId]: { ...getInviteForm(clientId), [field]: value },
    }));
  };

  const handleInviteClient = async (clientId: number) => {
    const form = getInviteForm(clientId);
    if (!form.email.trim()) {
      setMessageType("error");
      setMessage("Email is required");
      return;
    }
    try {
      const token = getToken();
      if (!token) return;
      setInvitingClientId(clientId);
      await inviteUser(token, {
        first_name: form.first_name || undefined,
        last_name: form.last_name || undefined,
        email: form.email,
        role: "client",
        client_id: clientId,
      });
      setMessageType("success");
      setMessage("Invitation sent successfully");
      setInviteForms((prev) => ({ ...prev, [clientId]: { first_name: "", last_name: "", email: "" } }));
      await fetchClients();
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message);
    } finally {
      setInvitingClientId(null);
    }
  };

  const handleResendClientInvite = async (userId: number) => {
    try {
      const token = getToken();
      if (!token) return;
      await resendInvite(token, userId);
      setMessageType("success");
      setMessage("Invite resent successfully");
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message);
    }
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

      setMessageType("success");

      setMessage(
        "Client updated successfully"
      );

      setEditingClient(null);

      await fetchClients();

    } catch (err: any) {

      setMessageType("error");

      setMessage(err.message);
    }
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

        {/* Left */}
        <div>

          <h2
            className="
              text-3xl
              font-semibold
              text-[#1E1E1E]
            "
          >
            Clients
          </h2>

          <p className="mt-2 text-gray-500">
            Manage all your project clients
          </p>

        </div>

        {/* Add */}
        {(role === "admin" || role === "super_admin") && (

          <button

            onClick={() =>
              navigate("/clients/create")
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
            + Add New Client
          </button>
        )}

      </div>

      {/* Filter */}
      {(role === "admin" || role === "super_admin") && (

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
          "
        >

          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) =>
              setShowInactive(
                e.target.checked
              )
            }
          />

          <span className="text-sm text-gray-600">
            Show inactive clients
          </span>

        </div>
      )}

      {/* Alert */}
      {message && (

        <Alert
          type={messageType}
          message={message}
        />
      )}

      {/* List */}
      {loading ? (

        <SkeletonList />

      ) : clients.length === 0 ? (

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
          No clients found
        </div>

      ) : (

        <div className="space-y-5">

          {clients.map(
            (c, index) => {

              const expanded =
                expandedClient === c.id;

              const editing =
                editingClient === c.id;

              return (

                <div
                  key={c.id}
                  onClick={() => navigate(`/clients/${c.id}/sites`)}
                  className={`
                    group
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[#E8E5DF]
                    bg-white
                    shadow-sm
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-md

                    ${
                      !c.is_active
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

                    {/* LEFT */}
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
                        {c.name}
                      </h3>

                      <p className="mt-1 text-gray-500">
                        {c.contact_number ||
                          "No contact number"}
                      </p>

                    </div>

                    {/* RIGHT */}
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      {/* Open Sites */}
                      <button

                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/clients/${c.id}/sites`);
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
                          text-[#1E1E1E]
                          transition-all
                          hover:bg-[#EFE7D7]
                        "
                      >

                        View Sites

                        <FiArrowRight />

                      </button>

                      {/* Status */}
                      <div
                        className={`
                          rounded-full
                          px-4
                          py-2
                          text-xs
                          font-medium

                          ${
                            c.is_active
                              ? `
                                bg-green-100
                                text-green-700
                              `
                              : `
                                bg-red-100
                                text-red-600
                              `
                          }
                        `}
                      >

                        {c.is_active
                          ? "Active"
                          : "Inactive"}

                      </div>

                      {/* Edit */}
                      {(role === "admin" || role === "super_admin") && (

                        <button

                          onClick={(e) => {
                            e.stopPropagation();
                            if (editing) {
                              setEditingClient(null);
                            } else {
                              setEditingClient(c.id);
                              setExpandedClient(c.id);
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
                            transition-all
                            duration-300
                            hover:bg-[#EFE7D7]
                          "
                        >

                          <FiEdit3 />

                          {editing
                            ? "Cancel"
                            : "Edit"}

                        </button>
                      )}

                      {/* Expand */}
                      <button

                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedClient(expanded ? null : c.id);
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
                          transition-all
                          hover:opacity-90
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

                      {/* Fields */}
                      <div
                        className="
                          grid
                          gap-5
                          md:grid-cols-2
                        "
                      >

                        {/* Name */}
                        <div>

                          <label
                            className="
                              mb-2
                              block
                              text-sm
                              text-gray-500
                            "
                          >
                            Client Name
                          </label>

                          {editing ? (

                            <input
                              value={c.name}
                              onChange={(e) =>
                                updateLocalClient(
                                  index,
                                  "name",
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
                              {c.name}
                            </div>
                          )}

                        </div>

                        {/* Contact */}
                        <div>

                          <label
                            className="
                              mb-2
                              block
                              text-sm
                              text-gray-500
                            "
                          >
                            Contact Number
                          </label>

                          {editing ? (

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
                              {c.contact_number ||
                                "N/A"}
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Address */}
                      <div className="mt-5">

                        <label
                          className="
                            mb-2
                            block
                            text-sm
                            text-gray-500
                          "
                        >
                          Address
                        </label>

                        {editing ? (

                          <textarea
                            rows={4}
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

                        ) : (

                          <div
                            className="
                              rounded-2xl
                              bg-white
                              px-4
                              py-4
                              text-[#1E1E1E]
                            "
                          >
                            {c.address ||
                              "No address available"}
                          </div>
                        )}

                      </div>

                      {/* Login Account */}
                      {(role === "admin" || role === "super_admin") && (
                        <div className="mt-6 border-t border-[#E8E5DF] pt-6">

                          <p className="mb-3 text-sm font-medium text-gray-500">
                            Login Account
                          </p>

                          {c.login_user ? (
                            <div className="flex flex-wrap items-center gap-3">

                              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-[#1E1E1E]">
                                {c.login_user.email}
                              </div>

                              <div className={`rounded-full px-3 py-1 text-xs font-medium ${
                                c.login_user.is_invited
                                  ? "bg-yellow-100 text-yellow-700"
                                  : c.login_user.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }`}>
                                {c.login_user.is_invited ? "Pending" : c.login_user.is_active ? "Active" : "Inactive"}
                              </div>

                              {c.login_user.is_invited && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResendClientInvite(c.login_user.id);
                                  }}
                                  className="flex items-center gap-2 rounded-2xl border border-[#D9C7A6] bg-[#F8F6F2] px-4 py-2 text-sm text-[#1E1E1E] transition-all hover:bg-[#EFE7D7]"
                                >
                                  <FiSend size={13} />
                                  Resend Invite
                                </button>
                              )}

                            </div>
                          ) : (
                            <div onClick={(e) => e.stopPropagation()}>
                              <div className="grid gap-4 md:grid-cols-3">

                                <input
                                  placeholder="First Name"
                                  value={getInviteForm(c.id).first_name}
                                  onChange={(e) => setInviteField(c.id, "first_name", e.target.value)}
                                  className="rounded-2xl border border-[#E8E5DF] bg-white px-4 py-3 text-sm text-[#1E1E1E] outline-none focus:border-[#D9C7A6]"
                                />

                                <input
                                  placeholder="Last Name"
                                  value={getInviteForm(c.id).last_name}
                                  onChange={(e) => setInviteField(c.id, "last_name", e.target.value)}
                                  className="rounded-2xl border border-[#E8E5DF] bg-white px-4 py-3 text-sm text-[#1E1E1E] outline-none focus:border-[#D9C7A6]"
                                />

                                <input
                                  placeholder="Email *"
                                  type="email"
                                  value={getInviteForm(c.id).email}
                                  onChange={(e) => setInviteField(c.id, "email", e.target.value)}
                                  className="rounded-2xl border border-[#E8E5DF] bg-white px-4 py-3 text-sm text-[#1E1E1E] outline-none focus:border-[#D9C7A6]"
                                />

                              </div>

                              <div className="mt-3 flex items-center gap-3">

                                <span className="rounded-full bg-[#E8E5DF] px-3 py-1 text-xs font-medium text-[#1E1E1E]">
                                  Client
                                </span>

                                <button
                                  disabled={invitingClientId === c.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInviteClient(c.id);
                                  }}
                                  className="flex items-center gap-2 rounded-2xl bg-[#D9C7A6] px-5 py-2.5 text-sm font-medium text-[#1E1E1E] transition-all hover:scale-[1.02] disabled:opacity-60"
                                >
                                  <FiUserPlus size={14} />
                                  {invitingClientId === c.id ? "Sending…" : "Send Invite"}
                                </button>

                              </div>
                            </div>
                          )}

                        </div>
                      )}

                      {/* Bottom */}
                      {editing && (role === "admin" || role === "super_admin") && (

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

                            Active Client

                          </label>

                          {/* Save */}
                          <button

                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(c);
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
                              transition-all
                              duration-300
                              hover:scale-[1.02]
                            "
                          >

                            <FiSave />

                            Save Changes

                          </button>

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