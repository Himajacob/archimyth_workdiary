import {
  useEffect,
  useState
} from "react";
import {
  useNavigate,
} from "react-router-dom";

import {
  getWorkTypes,
  activateWorkType,
  deactivateWorkType,
} from "../api/workType";

import {
  getToken
} from "../utils/auth";

import Alert from "./ui/Alert";

import {
  FiCheckCircle,
  FiXCircle,
  FiPlus,
} from "react-icons/fi";

type Props = {
  role: string;
};

export default function WorkTypeList({
  role,
}: Props) {

  const navigate =
    useNavigate();

  const [types, setTypes] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [messageType,
    setMessageType] =
    useState<
      "success" | "error"
    >("success");

  const [showInactive,
    setShowInactive] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  // -----------------------------------
  // Fetch
  // -----------------------------------

  const fetchData =
    async () => {

      try {

        const token =
          getToken();

        if (!token) return;

        const data =
          await getWorkTypes(
            token,
            showInactive
          );

        setTypes(data);

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
    fetchData();
  }, [showInactive]);

  // -----------------------------------
  // Toggle Active
  // -----------------------------------

  const handleToggle =
    async (
      id: number,
      isActive: boolean
    ) => {

      try {

        const token =
          getToken();

        if (!token) return;

        setLoading(true);

        if (isActive) {

          await deactivateWorkType(
            token,
            id
          );

          setMessageType(
            "success"
          );

          setMessage(
            "Work type deactivated"
          );

        } else {

          await activateWorkType(
            token,
            id
          );

          setMessageType(
            "success"
          );

          setMessage(
            "Work type activated"
          );
        }

        await fetchData();

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
            Work Types
          </h2>

          <p className="mt-2 text-gray-500">
            Manage all work categories
          </p>

        </div>

        {/* Add */}
        {role === "admin" && (

          <button

            onClick={() =>
              navigate(
                "/work-types/create"
              )
            }

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

            <FiPlus />

            Add Work Type

          </button>
        )}

      </div>

      {/* Filter */}
      {role === "admin" && (

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
            className="
              h-4
              w-4
              accent-[#D9C7A6]
            "
          />

          <span className="text-sm text-gray-600">
            Show inactive work types
          </span>

        </div>
      )}

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
      {types.length === 0 ? (

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
          No work types found
        </div>

      ) : (

        <div className="space-y-4">

          {types.map((t) => (

            <div
              key={t.id}

              className={`
                flex
                flex-col
                gap-4
                rounded-3xl
                border
                border-[#E8E5DF]
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300

                md:flex-row
                md:items-center
                md:justify-between

                ${
                  !t.is_active
                    ? "opacity-60"
                    : ""
                }
              `}
            >

              {/* Left */}
              <div>

                <h3
                  className="
                    text-xl
                    font-semibold
                    text-[#1E1E1E]
                  "
                >
                  {t.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Work Type ID: {t.id}
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
                      t.is_active
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

                  {t.is_active
                    ? "Active"
                    : "Inactive"}

                </div>

                {/* Action */}
                {role === "admin" && (

                  <button

                    disabled={loading}

                    onClick={() =>
                      handleToggle(
                        t.id,
                        t.is_active
                      )
                    }

                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      px-5
                      py-2
                      text-sm
                      font-medium
                      transition-all
                      duration-300

                      ${
                        t.is_active
                          ? `
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
                          `
                          : `
                            bg-green-50
                            text-green-700
                            hover:bg-green-100
                          `
                      }
                    `}
                  >

                    {t.is_active ? (
                      <>
                        <FiXCircle />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <FiCheckCircle />
                        Activate
                      </>
                    )}

                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
