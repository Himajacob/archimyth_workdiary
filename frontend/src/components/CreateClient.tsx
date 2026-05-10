import { useState } from "react";

import {
  createClient
} from "../api/client";

import {
  getToken
} from "../utils/auth";

type Props = {
  onBack: () => void;
};

export default function CreateClient({
  onBack
}: Props) {

  const [name, setName] =
    useState("");

  const [contact, setContact] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // -----------------------------------
  // Create
  // -----------------------------------

  const handleCreate =
    async () => {

      try {

        setLoading(true);

        setMessage("");

        const token = getToken();

        if (!token) return;

        await createClient(
          token,
          {
            name,
            contact_number: contact,
            address,
          }
        );

        setMessage(
          "Client created successfully"
        );

        setTimeout(() => {
          onBack();
        }, 1000);

      } catch (err: any) {

        setMessage(err.message);

      } finally {

        setLoading(false);
      }
    };

  // -----------------------------------
  // UI
  // -----------------------------------

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
          Create Client
        </h2>

        <p className="mt-2 text-gray-500">
          Add a new client to the system
        </p>

      </div>

      {/* Card */}
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

        {/* Name */}
        <div className="mb-5">

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

          <input
            placeholder="Enter client name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
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
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-300
              focus:border-[#D9C7A6]
            "
          />

        </div>

        {/* Contact */}
        <div className="mb-5">

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

          <input
            placeholder="Enter contact number"
            value={contact}
            onChange={(e) =>
              setContact(e.target.value)
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
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-300
              focus:border-[#D9C7A6]
            "
          />

        </div>

        {/* Address */}
        <div className="mb-6">

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

          <textarea
            rows={4}
            placeholder="Enter address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
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
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-300
              focus:border-[#D9C7A6]
            "
          />

        </div>

        {/* Message */}
        {message && (

          <div
            className="
              mb-6
              rounded-2xl
              border
              border-[#E8E5DF]
              bg-[#FAFAF9]
              px-5
              py-4
              text-sm
              text-[#1E1E1E]
            "
          >
            {message}
          </div>
        )}

        {/* Buttons */}
        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
          "
        >

          <button

            onClick={handleCreate}

            disabled={loading}

            className="
              rounded-2xl
              bg-[#D9C7A6]
              px-6
              py-3
              font-medium
              text-[#1E1E1E]
              transition-all
              duration-300
              hover:scale-[1.02]
              disabled:opacity-50
            "
          >

            {loading
              ? "Creating..."
              : "Create Client"}

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
              font-medium
              text-[#1E1E1E]
              transition-all
              duration-300
              hover:bg-[#FAFAF9]
            "
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}