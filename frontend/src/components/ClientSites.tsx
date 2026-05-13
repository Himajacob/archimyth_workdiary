import {
  useEffect,
  useState
} from "react";

import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiEdit3,
  FiSave,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import {
  getSitesByClient,
  updateSite,
} from "../api/site";

import {
  getToken,
} from "../utils/auth";

import Alert from "./ui/Alert";

type Props = {
  role: string;

  client: any;

  onBack: () => void;

  onOpenSite: (
    site: any
  ) => void;
 };
export default function ClientSites({
  role,
  client,
  onBack,
  onOpenSite,
}: Props) {

  const [sites, setSites] =
    useState<any[]>([]);

  const [message, setMessage] =
    useState("");

  const [messageType,
    setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const [loading, setLoading] =
    useState(true);

  const [editingSite,
    setEditingSite] =
    useState<number | null>(null);

  const [expandedSite,
    setExpandedSite] =
    useState<number | null>(null);

  // -----------------------------------
  // Fetch Sites
  // -----------------------------------

  const fetchSites = async () => {

    try {

      setLoading(true);

      const token = getToken();

      if (!token) return;

      const data =
        await getSitesByClient(
          token,
          client.id,
          true
        );

      setSites(data);

    } catch (err: any) {

      setMessageType("error");

      setMessage(err.message);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    if (client?.id) {

      fetchSites();
    }

  }, [client]);

  // -----------------------------------
  // Local Update
  // -----------------------------------

  const updateLocalSite = (
    index: number,
    field: string,
    value: any
  ) => {

    const updated = [...sites];

    updated[index] = {
      ...updated[index],
      [field]: value,
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
            site.is_active,
        }
      );

      setMessageType("success");

      setMessage(
        "Site updated successfully"
      );

      setEditingSite(null);

      await fetchSites();

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
          gap-5
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        {/* Left */}
        <div>

          <button

            onClick={onBack}

            className="
              mb-4
              flex
              items-center
              gap-2
              text-sm
              text-gray-500
              transition-all
              hover:text-[#1E1E1E]
            "
          >

            <FiArrowLeft />

            Back to Clients

          </button>

          <h2
            className="
              text-3xl
              font-semibold
              text-[#1E1E1E]
            "
          >
            {client?.name}
          </h2>

          <p className="mt-2 text-gray-500">
            Client Sites Overview
          </p>

        </div>

        {/* Count */}
        <div
          className="
            rounded-2xl
            border
            border-[#E8E5DF]
            bg-white
            px-5
            py-4
            shadow-sm
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-wider
              text-gray-400
            "
          >
            Total Sites
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-semibold
              text-[#1E1E1E]
            "
          >
            {sites.length}
          </h3>

        </div>

      </div>

      {/* Alert */}
      {message && (

        <Alert
          type={messageType}
          message={message}
        />
      )}

      {/* Loading */}
      {loading ? (

        <div
          className="
            rounded-3xl
            border
            border-[#E8E5DF]
            bg-white
            p-12
            text-center
            text-gray-500
          "
        >
          Loading sites...
        </div>

      ) : sites.length === 0 ? (

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
          No sites found for this client
        </div>

      ) : (

        <div
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >

          {sites.map((site, index) => {

            const editing =
              editingSite === site.id;

            const expanded =
              expandedSite === site.id;

            return (

              <div
                key={site.id}
                className={`
                  rounded-3xl
                  border
                  border-[#E8E5DF]
                  bg-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-md

                  ${
                    !site.is_active
                      ? "opacity-60"
                      : ""
                  }
                `}
              >

                {/* Top */}
                <div
                  className="
                    mb-6
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <h3
                      className="
                        text-2xl
                        font-semibold
                        text-[#1E1E1E]
                      "
                    >
                      {site.project_name}
                    </h3>

                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        text-gray-500
                      "
                    >

                      <FiMapPin />

                      <span className="text-sm">
                        {site.location}
                      </span>

                    </div>

                  </div>

                  {/* Actions */}
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >

                    {/* Active */}
                    <div
                      className={`
                        rounded-full
                        px-4
                        py-2
                        text-xs
                        font-medium

                        ${
                          site.is_active
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

                      {site.is_active
                        ? "Active"
                        : "Inactive"}

                    </div>

                    {/* Edit */}
                    {role === "admin" && (

                      <button

                        onClick={() =>
                          setEditingSite(
                            editing
                              ? null
                              : site.id
                          )
                        }

                        className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-[#D9C7A6]
                        bg-[#D9C7A6]
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-[#1E1E1E]
                        transition-all
                        hover:scale-[1.02]
                        "
                      >

                        <FiEdit3 />

                        {editing
                          ? "Cancel"
                          : "Edit"}

                      </button>
                    )}
                    <button

                    onClick={() =>
                        onOpenSite(site)
                    }

                    className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        bg-[#D9C7A6]
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-[#1E1E1E]
                        transition-all
                        hover:scale-[1.02]
                    "
                    >

                    Open Diary

                    </button>

                    {/* Expand */}
                    <button

                      onClick={() =>
                        setExpandedSite(
                          expanded
                            ? null
                            : site.id
                        )
                      }

                      className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        bg-[#1E1E1E]
                        px-4
                        py-2
                        text-sm
                        text-white
                      "
                    >

                      {expanded ? (
                        <>
                          Hide
                          <FiChevronUp />
                        </>
                      ) : (
                        <>
                          Details
                          <FiChevronDown />
                        </>
                      )}

                    </button>

                  </div>

                </div>

                {/* Info */}
                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >

                  {/* Status */}
                  <div
                    className="
                      rounded-2xl
                      bg-[#F8F6F2]
                      p-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Project Status
                    </p>

                    {editing ? (

                      <select
                        value={site.status}
                        onChange={(e) =>
                          updateLocalSite(
                            index,
                            "status",
                            e.target.value
                          )
                        }
                        className="
                          mt-2
                          w-full
                          rounded-xl
                          border
                          border-[#E8E5DF]
                          bg-white
                          px-3
                          py-2
                          text-sm
                        "
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

                      <p
                        className="
                          mt-2
                          text-sm
                          font-medium
                          capitalize
                          text-[#1E1E1E]
                        "
                      >
                        {site.status
                          ?.replace(
                            "_",
                            " "
                          )}
                      </p>
                    )}

                  </div>

                  {/* Duration */}
                  <div
                    className="
                      rounded-2xl
                      bg-[#F8F6F2]
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-gray-400
                      "
                    >

                      <FiClock />

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-wider
                        "
                      >
                        Duration
                      </p>

                    </div>

                    {editing ? (

                      <input
                        type="number"
                        value={
                          site.duration_days || ""
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
                        className="
                          mt-2
                          w-full
                          rounded-xl
                          border
                          border-[#E8E5DF]
                          bg-white
                          px-3
                          py-2
                          text-sm
                        "
                      />

                    ) : (

                      <p
                        className="
                          mt-2
                          text-sm
                          font-medium
                          text-[#1E1E1E]
                        "
                      >
                        {site.duration_days
                          ? `${site.duration_days} Days`
                          : "N/A"}
                      </p>
                    )}

                  </div>

                </div>

                {/* Start Date */}
                <div
                  className="
                    mt-4
                    rounded-2xl
                    bg-[#F8F6F2]
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-gray-400
                    "
                  >

                    <FiCalendar />

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wider
                      "
                    >
                      Start Date
                    </p>

                  </div>

                  <p
                    className="
                      mt-2
                      text-sm
                      font-medium
                      text-[#1E1E1E]
                    "
                  >
                    {site.start_date
                      ? new Date(
                          site.start_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                </div>

                {/* Expanded */}
                {expanded && (

                  <div
                    className="
                      mt-5
                      border-t
                      border-[#E8E5DF]
                      pt-5
                    "
                  >

                    <div
                      className="
                        grid
                        gap-4
                        md:grid-cols-2
                      "
                    >

                      {/* Project */}
                      <div>

                        <label
                          className="
                            mb-2
                            block
                            text-sm
                            text-gray-500
                          "
                        >
                          Project Name
                        </label>

                        {editing ? (

                          <input
                            value={site.project_name}
                            onChange={(e) =>
                              updateLocalSite(
                                index,
                                "project_name",
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
                            "
                          />

                        ) : (

                          <div
                            className="
                              rounded-2xl
                              bg-[#F8F6F2]
                              px-4
                              py-3
                              text-[#1E1E1E]
                            "
                          >
                            {site.project_name}
                          </div>
                        )}

                      </div>

                      {/* Location */}
                      <div>

                        <label
                          className="
                            mb-2
                            block
                            text-sm
                            text-gray-500
                          "
                        >
                          Location
                        </label>

                        {editing ? (

                          <input
                            value={site.location}
                            onChange={(e) =>
                              updateLocalSite(
                                index,
                                "location",
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
                            "
                          />

                        ) : (

                          <div
                            className="
                              rounded-2xl
                              bg-[#F8F6F2]
                              px-4
                              py-3
                              text-[#1E1E1E]
                            "
                          >
                            {site.location}
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Active */}
                    {editing && (

                      <div
                        className="
                          mt-5
                          flex
                          items-center
                          justify-between
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
                              site.is_active
                            }
                            onChange={(e) =>
                              updateLocalSite(
                                index,
                                "is_active",
                                e.target.checked
                              )
                            }
                          />

                          Active Site

                        </label>

                        {/* Save */}
                        <button

                          onClick={() =>
                            handleSave(site)
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
          })}

        </div>
      )}

    </div>
  );
}