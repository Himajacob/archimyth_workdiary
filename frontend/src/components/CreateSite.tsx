import {
  useEffect,
  useState
} from "react";
import {
  useNavigate,
} from "react-router-dom";

import {
  createSite
} from "../api/site";

import {
  getClients
} from "../api/client";

import {
  getToken
} from "../utils/auth";

import Alert from "./ui/Alert";

export default function CreateSite() {

  const navigate =
    useNavigate();

  const [clients, setClients] =
    useState<any[]>([]);

  const [clientId,
    setClientId] =
    useState<number | null>(null);

  const [projectName,
    setProjectName] =
    useState("");

  const [location,
    setLocation] =
    useState("");

  const [startDate,
    setStartDate] =
    useState("");

  const [duration,
    setDuration] =
    useState("");

  const [message,
    setMessage] =
    useState("");

  const [messageType,
    setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const [loading,
    setLoading] =
    useState(false);

  // -----------------------------------
  // Fetch Clients
  // -----------------------------------

  useEffect(() => {

    const fetchClients =
      async () => {

        try {

          const token =
            getToken();

          if (!token) return;

          const data =
            await getClients(
              token
            );

          setClients(data);

        } catch (err: any) {

          setMessageType(
            "error"
          );

          setMessage(
            err.message
          );
        }
      };

    fetchClients();

  }, []);

  // -----------------------------------
  // Create
  // -----------------------------------

  const handleCreate =
    async () => {

      try {

        if (
          !projectName.trim()
        ) {

          setMessageType(
            "error"
          );

          setMessage(
            "Project name is required"
          );

          return;
        }

        if (!clientId) {

          setMessageType(
            "error"
          );

          setMessage(
            "Please select a client"
          );

          return;
        }

        const token =
          getToken();

        if (!token) return;

        setLoading(true);

        await createSite(
          token,
          {
            client_id:
              clientId,

            project_name:
              projectName,

            location,

            start_date:
              startDate,

            duration_days:
              duration
                ? Number(
                    duration
                  )
                : null,
          }
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Site created successfully"
        );

        setTimeout(() => {

          navigate("/sites");

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

    <div>

      {/* Header */}
      <div className="mb-8">

        <h2
          className="
            text-3xl
            font-semibold
            text-[#1E1E1E]
          "
        >
          Create Site
        </h2>

        <p className="mt-2 text-gray-500">
          Add a new project site
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

      {/* Form Card */}
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
            gap-6
            md:grid-cols-2
          "
        >

          {/* Client */}
          <div>

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-600
              "
            >
              Client
            </label>

            <select
              value={
                clientId || ""
              }
              onChange={(e) =>
                setClientId(
                  Number(
                    e.target.value
                  )
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
                transition-all
                focus:border-[#D9C7A6]
              "
            >

              <option value="">
                Select Client
              </option>

              {clients.map(
                (c) => (

                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </option>
                )
              )}

            </select>

          </div>

          {/* Project */}
          <div>

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-600
              "
            >
              Project Name
            </label>

            <input
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) =>
                setProjectName(
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
                focus:border-[#D9C7A6]
              "
            />

          </div>

        </div>

        {/* Location */}
        <div className="mt-6">

          <label
            className="
              mb-2
              block
              text-sm
              text-gray-600
            "
          >
            Location
          </label>

          <input
            placeholder="Enter project location"
            value={location}
            onChange={(e) =>
              setLocation(
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
              focus:border-[#D9C7A6]
            "
          />

        </div>

        {/* Dates */}
        <div
          className="
            mt-6
            grid
            gap-6
            md:grid-cols-2
          "
        >

          {/* Start Date */}
          <div>

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-600
              "
            >
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
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
                transition-all
                focus:border-[#D9C7A6]
              "
            />

          </div>

          {/* Duration */}
          <div>

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-600
              "
            >
              Duration (Days)
            </label>

            <input
              type="number"
              min={0}
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "" && Number(val) < 0) return;
                setDuration(val);
              }}
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
                focus:border-[#D9C7A6]
              "
            />

          </div>

        </div>

        {/* Buttons */}
        <div
          className="
            mt-8
            flex
            flex-col
            gap-4
            sm:flex-row
          "
        >

          {/* Create */}
          <button

            onClick={
              handleCreate
            }

            disabled={loading}

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
              disabled:opacity-50
            "
          >

            {loading
              ? "Creating..."
              : "Create Site"}

          </button>

          {/* Back */}
          <button

            onClick={() =>
              navigate("/sites")
            }

            className="
              rounded-2xl
              border
              border-[#E8E5DF]
              bg-white
              px-6
              py-3
              text-sm
              font-medium
              text-[#1E1E1E]
              transition-all
              duration-300
              hover:bg-[#F7F7F5]
            "
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}
