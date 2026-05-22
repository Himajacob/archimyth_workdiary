import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiClock, FiChevronDown, FiChevronUp } from "react-icons/fi";

import { getSitesByClient } from "../api/site";
import { getToken, getUserName, getClientId } from "../utils/auth";

export default function ClientPortal() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSite, setExpandedSite] = useState<number | null>(null);

  const navigate = useNavigate();
  const firstName = getUserName();
  const clientId = getClientId();

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) return;

    getSitesByClient(token, clientId, false)
      .then(setSites)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [clientId]);

  return (
    <div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-sm text-gray-500">Welcome back,</p>
          <h2 className="text-3xl font-semibold text-[#1E1E1E]">{firstName}</h2>
          <p className="mt-1 text-gray-500">Your Sites</p>
        </div>

        <div className="rounded-2xl border border-[#E8E5DF] bg-white px-5 py-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray-400">Total Sites</p>
          <h3 className="mt-1 text-2xl font-semibold text-[#1E1E1E]">{sites.length}</h3>
        </div>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-[#E8E5DF]" />
          ))}
        </div>
      ) : sites.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#D9C7A6] bg-white p-12 text-center text-gray-500">
          No sites assigned to your account
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">

          {sites.map((site) => {
            const expanded = expandedSite === site.id;

            return (
              <div
                key={site.id}
                className={`
                  rounded-3xl border border-[#E8E5DF] bg-white p-6 shadow-sm
                  transition-all duration-300
                  ${!site.is_active ? "opacity-60" : ""}
                `}
              >

                {/* Top */}
                <div className="mb-5 flex items-start justify-between gap-4">

                  <div>
                    <h3 className="text-xl font-semibold text-[#1E1E1E]">
                      {site.project_name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-gray-500">
                      <FiMapPin size={13} />
                      <span className="text-sm">{site.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">

                    {/* Status badge */}
                    <span
                      className={`
                        rounded-full px-3 py-1 text-xs font-medium
                        ${site.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
                      `}
                    >
                      {site.is_active ? "Active" : "Inactive"}
                    </span>

                    {/* Gallery */}
                    <button
                      onClick={() => navigate(`/client/sites/${site.id}/gallery`)}
                      className="rounded-2xl bg-[#1E1E1E] px-4 py-2 text-sm text-white transition-all hover:opacity-90"
                    >
                      Gallery
                    </button>

                    {/* Details toggle */}
                    <button
                      onClick={() => setExpandedSite(expanded ? null : site.id)}
                      className="flex items-center gap-1.5 rounded-2xl bg-[#F5F1EA] px-4 py-2 text-sm text-[#1E1E1E] transition-all hover:bg-[#EFE7D7]"
                    >
                      Details
                      {expanded ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                    </button>

                  </div>

                </div>

                {/* Info row */}
                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl bg-[#F8F6F2] p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-400">Project Status</p>
                    <p className="mt-2 text-sm font-medium capitalize text-[#1E1E1E]">
                      {site.status?.replace("_", " ")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F6F2] p-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiClock size={13} />
                      <p className="text-xs uppercase tracking-wider">Duration</p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#1E1E1E]">
                      {site.duration_days ? `${site.duration_days} Days` : "N/A"}
                    </p>
                  </div>

                </div>

                {/* Start date */}
                <div className="mt-4 rounded-2xl bg-[#F8F6F2] p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiCalendar size={13} />
                    <p className="text-xs uppercase tracking-wider">Start Date</p>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[#1E1E1E]">
                    {site.start_date ? new Date(site.start_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="mt-5 grid gap-4 border-t border-[#E8E5DF] pt-5 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs text-gray-500">Project Name</p>
                      <div className="rounded-2xl bg-[#F8F6F2] px-4 py-3 text-sm text-[#1E1E1E]">
                        {site.project_name}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-gray-500">Location</p>
                      <div className="rounded-2xl bg-[#F8F6F2] px-4 py-3 text-sm text-[#1E1E1E]">
                        {site.location}
                      </div>
                    </div>
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
