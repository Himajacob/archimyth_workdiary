import {
  useEffect,
  useState
} from "react";
import {
  useNavigate,
} from "react-router-dom";

import {
  getSites,
  updateSite
} from "../api/site";

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
} from "react-icons/fi";

type Props = {
  role: string;
};

export default function SiteList({
  role,
}: Props) {

  const navigate =
    useNavigate();

  const [sites, setSites] =
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

  const [statusTab, setStatusTab] =
    useState<string>("all");

  const [expandedSite,
    setExpandedSite] =
    useState<number | null>(null);

  const [editingSite,
    setEditingSite] =
    useState<number | null>(null);

  const [draft, setDraft] =
    useState<Record<number, any>>({});

  // -----------------------------------
  // Fetch
  // -----------------------------------

  const fetchSites = async () => {

    try {

      setLoading(true);

      const token = getToken();

      if (!token) return;

      const data =
        await getSites(
          token,
          showInactive
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
    fetchSites();
  }, [showInactive]);

  // -----------------------------------
  // Draft helpers
  // -----------------------------------

  const startEditing = (site: any) => {
    setDraft((prev) => ({ ...prev, [site.id]: { ...site } }));
    setEditingSite(site.id);
    setExpandedSite(site.id);
  };

  const cancelEditing = (siteId: number) => {
    setDraft((prev) => {
      const next = { ...prev };
      delete next[siteId];
      return next;
    });
    setEditingSite(null);
    setExpandedSite(null);
  };

  const updateDraft = (siteId: number, field: string, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [siteId]: { ...prev[siteId], [field]: value },
    }));
  };

  // -----------------------------------
  // Save
  // -----------------------------------

  const handleSave = async (siteId: number) => {

    const data = draft[siteId];

    if (!data) return;

    try {

      const token = getToken();

      if (!token) return;

      await updateSite(
        token,
        siteId,
        {
          project_name: data.project_name,
          location: data.location,
          status: data.status,
          duration_days: data.duration_days,
          is_active: data.is_active,
        }
      );

      setMessageType("success");

      setMessage("Site updated successfully");

      cancelEditing(siteId);

      await fetchSites();

    } catch (err: any) {

      setMessageType("error");

      setMessage(err.message);
    }
  };

  // -----------------------------------
  // Status Color
  // -----------------------------------

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case "completed":
        return `
          bg-green-100
          text-green-700
        `;

      case "paused":
        return `
          bg-yellow-100
          text-yellow-700
        `;

      case "cancelled":
        return `
          bg-red-100
          text-red-700
        `;

      default:
        return `
          bg-blue-100
          text-blue-700
        `;
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
            Sites
          </h2>

          <p className="mt-2 text-gray-500">
            Manage all your project sites
          </p>

        </div>

        {/* Add Button */}
        {(role === "admin" || role === "super_admin") && (

          <button

            onClick={() =>
              navigate("/sites/create")
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
            + Add New Site
          </button>
        )}

      </div>

      {/* Status Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">

        {(["all", "in_progress", "completed", "paused", "cancelled"] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`
                rounded-2xl
                px-5
                py-2
                text-sm
                font-medium
                transition-all
                duration-200

                ${statusTab === tab
                  ? "bg-[#1E1E1E] text-white"
                  : "border border-[#E8E5DF] bg-white text-[#1E1E1E] hover:bg-[#F8F6F2]"
                }
              `}
            >
              {tab === "all"
                ? "All"
                : tab.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          )
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
            Show inactive sites
          </span>

        </div>
      )}

      {/* Message */}
      {message && (

        <Alert
          type={messageType}
          message={message}
        />
      )}

      {/* List */}
      {loading ? (

        <SkeletonList />

      ) : sites.filter((s) => statusTab === "all" || s.status === statusTab).length === 0 ? (

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
          No sites found
        </div>

      ) : (

        <div className="space-y-5">

          {sites.filter((s) =>
            statusTab === "all" || s.status === statusTab
          ).map(
            (s) => {

              const expanded =
                expandedSite === s.id;

              const editing =
                editingSite === s.id;

              return (

                <div
                  key={s.id}
                  onClick={() => navigate(`/sites/${s.id}/work-entry`)}
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
                      !s.is_active
                        ? "opacity-60"
                        : ""
                    }
                  `}
                >

                  {/* TOP BAR */}
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
                        {s.project_name}
                      </h3>

                      {s.client_name && (
                        <p className="mt-0.5 text-xs font-medium text-[#D9C7A6]">
                          {s.client_name}
                        </p>
                      )}

                      <p className="mt-1 text-gray-500">
                        {s.location ||
                          "No location"}
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

                          ${getStatusColor(
                            s.status
                          )}
                        `}
                      >

                        {s.status
                          ?.replaceAll(
                            "_",
                            " "
                          )}

                      </div>

                      {/* Edit */}
                      {(role === "admin" || role === "super_admin") && (

                        <button

                          onClick={(e) => {
                            e.stopPropagation();
                            if (editing) {
                              cancelEditing(s.id);
                            } else {
                              startEditing(s);
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

                      <button

                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sites/${s.id}/work-entry`);
                        }}

                        className="
                          flex
                          items-center
                          gap-2
                          rounded-2xl
                          bg-[#D9C7A6]
                          px-5
                          py-2
                          text-sm
                          font-medium
                          text-[#1E1E1E]
                          transition-all
                          duration-300
                          hover:scale-[1.02]
                        "
                      >

                        Open Diary

                      </button>

                      <button

                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sites/${s.id}/gallery`);
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
                          duration-300
                          hover:opacity-90
                        "
                      >

                        Gallery

                      </button>

                      <button

                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sites/${s.id}/history`);
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
                          duration-300
                          hover:opacity-90
                        "
                      >

                        History

                      </button>


                      {/* Expand */}
                      <button

                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSite(expanded ? null : s.id);
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
                      onClick={(e) => e.stopPropagation()}
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
                              value={
                                draft[s.id]?.project_name ?? ""
                              }
                              onChange={(e) =>
                                updateDraft(s.id, "project_name", e.target.value)
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
                              {s.project_name}
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
                              value={
                                draft[s.id]?.location ?? ""
                              }
                              onChange={(e) =>
                                updateDraft(s.id, "location", e.target.value)
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
                              {s.location ||
                                "N/A"}
                            </div>
                          )}

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

                        {/* Status */}
                        <div>

                          <label
                            className="
                              mb-2
                              block
                              text-sm
                              text-gray-500
                            "
                          >
                            Project Status
                          </label>

                          {editing ? (

                            <select
                              value={draft[s.id]?.status ?? ""}
                              onChange={(e) =>
                                updateDraft(s.id, "status", e.target.value)
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

                            <div
                              className="
                                rounded-2xl
                                bg-white
                                px-4
                                py-3
                                text-[#1E1E1E]
                              "
                            >
                              {s.status
                                ?.replaceAll(
                                  "_",
                                  " "
                                )}
                            </div>
                          )}

                        </div>

                        {/* Duration */}
                        <div>

                          <label
                            className="
                              mb-2
                              block
                              text-sm
                              text-gray-500
                            "
                          >
                            Duration (Days)
                          </label>

                          {editing ? (

                            <input
                              type="number"
                              min={0}
                              value={draft[s.id]?.duration_days ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val !== "" && Number(val) < 0) return;
                                updateDraft(s.id, "duration_days", val === "" ? null : Number(val));
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
                              {s.duration_days ||
                                "N/A"}
                            </div>
                          )}

                        </div>

                      </div>

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
                                draft[s.id]?.is_active ?? false
                              }
                              onChange={(e) =>
                                updateDraft(s.id, "is_active", e.target.checked)
                              }
                            />

                            Active Site

                          </label>

                          {/* Save */}
                          <button

                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(s.id);
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
