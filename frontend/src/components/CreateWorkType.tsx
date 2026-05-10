import { useState } from "react";

import { createWorkType } from "../api/workType";

import { getToken } from "../utils/auth";

import Alert from "./ui/Alert";

import {
  FiArrowLeft,
  FiPlus,
} from "react-icons/fi";

type Props = {
  onBack: () => void;
};

export default function CreateWorkType({
  onBack
}: Props) {

  const [name, setName] =
    useState("");

  const [message,
    setMessage] =
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
  // Create
  // -----------------------------------

  const handleCreate =
    async () => {

      try {

        if (!name.trim()) {

          setMessageType(
            "error"
          );

          setMessage(
            "Work type name is required"
          );

          return;
        }

        setLoading(true);

        const token =
          getToken();

        if (!token) return;

        await createWorkType(
          token,
          {
            name
          }
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Work type created successfully"
        );

        setTimeout(() => {

          onBack();

        }, 1000);

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
  // UI
  // -----------------------------------

  return (

    <div
      className="
        mx-auto
        max-w-2xl
      "
    >

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
            Create Work Type
          </h2>

          <p className="mt-2 text-gray-500">
            Add a new work category
          </p>

        </div>

        {/* Back */}
        <button

          onClick={onBack}

          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-[#E8E5DF]
            bg-white
            px-5
            py-3
            text-sm
            font-medium
            text-[#1E1E1E]
            transition-all
            hover:bg-[#F7F7F5]
          "
        >

          <FiArrowLeft />

          Back

        </button>

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

        {/* Name */}
        <div>

          <label
            className="
              mb-2
              block
              text-sm
              font-medium
              text-gray-600
            "
          >
            Work Type Name
          </label>

          <input
            placeholder="e.g. Plumbing, Electrical, Painting"
            value={name}
            onChange={(e) =>
              setName(
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
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-300
              focus:border-[#D9C7A6]
            "
          />

        </div>

        {/* Bottom */}
        <div
          className="
            mt-8
            flex
            justify-end
          "
        >

          <button

            onClick={
              handleCreate
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

            <FiPlus />

            {loading
              ? "Creating..."
              : "Create Work Type"}

          </button>

        </div>

      </div>

    </div>
  );
}