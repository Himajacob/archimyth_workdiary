import { useState } from "react";

import { inviteUser } from "../api/user";

import { getToken } from "../utils/auth";

import Alert from "./ui/Alert";

type Props = {
  onBack: () => void;
};

export default function CreateUser({
  onBack
}: Props) {

  const [firstName,
    setFirstName] =
    useState("");

  const [lastName,
    setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("site_manager");

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
          "Invitation sent successfully"
        );

        setTimeout(() => {
          onBack();
        }, 1200);

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

  return (

    <div
      className="
        mx-auto
        max-w-3xl
      "
    >

      {/* Header */}
      <div className="mb-8">

        <h2
          className="
            text-3xl
            font-semibold
            text-[#1E1E1E]
          "
        >
          Invite User
        </h2>

        <p className="mt-2 text-gray-500">
          Create and invite a new team member
        </p>

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

      {/* Form */}
      <div
        className="
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
            grid
            gap-5
            md:grid-cols-2
          "
        >

          <input
            placeholder="First Name"
            value={firstName}
            onChange={(e) =>
              setFirstName(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#E8E5DF]
              px-4
              py-3
              text-[#1E1E1E]
              outline-none
            "
          />

          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) =>
              setLastName(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#E8E5DF]
              px-4
              py-3
              text-[#1E1E1E]
              outline-none
            "
          />

        </div>

        <div
          className="
            mt-5
            grid
            gap-5
            md:grid-cols-2
          "
        >

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#E8E5DF]
              px-4
              py-3
              text-[#1E1E1E]
              outline-none
            "
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#E8E5DF]
              px-4
              py-3
              text-[#1E1E1E]
              outline-none
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

        {/* Buttons */}
        <div
          className="
            mt-8
            flex
            gap-4
          "
        >

          <button

            onClick={handleInvite}

            disabled={loading}

            className="
              rounded-2xl
              bg-[#D9C7A6]
              px-6
              py-3
              text-sm
              font-medium
              text-[#1E1E1E]
            "
          >

            {loading
              ? "Sending..."
              : "Send Invite"}

          </button>

          <button

            onClick={onBack}

            className="
              rounded-2xl
              border
              border-[#E8E5DF]
              bg-white
              px-6
              py-3
              text-sm
              text-[#1E1E1E]
            "
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}