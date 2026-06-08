import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { getSiteHistory } from "../api/workEntry";
import { getToken } from "../utils/auth";
import Alert from "./ui/Alert";

export default function SiteWorkHistory() {

  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();

  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = getToken();
        if (!token || !siteId) return;
        const data = await getSiteHistory(token, Number(siteId));
        setEntries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [siteId]);

  const rows = entries.flatMap((entry) =>
    entry.items.map((item: any, idx: number) => ({
      date: entry.entry_date,
      showDate: idx === 0,
      rowSpan: entry.items.length,
      workTypeName: item.work_type_name || "—",
      workersCount: item.workers_count,
      remarks: item.remarks || "—",
      updatedByName: idx === 0 ? (entry.updated_by_name || null) : null,
    }))
  );

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
            Work History
          </h2>
          <p className="mt-2 text-gray-500">
            Day-wise log of all work entries for this site
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="
            rounded-2xl
            border
            border-[#D9C7A6]
            bg-[#F8F6F2]
            px-6
            py-3
            text-sm
            font-medium
            text-[#1E1E1E]
            transition-all
            duration-300
            hover:bg-[#EFE7D7]
          "
        >
          ← Back
        </button>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      {loading ? (

        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="
                h-12
                animate-pulse
                rounded-2xl
                bg-[#E8E5DF]
              "
            />
          ))}
        </div>

      ) : rows.length === 0 ? (

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
          No work entries found for this site
        </div>

      ) : (

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-[#E8E5DF]
            bg-white
            shadow-sm
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr
                  className="
                    border-b
                    border-[#E8E5DF]
                    bg-[#FAFAF9]
                  "
                >
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-[#1E1E1E]
                      w-36
                    "
                  >
                    Date
                  </th>
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-[#1E1E1E]
                      w-48
                    "
                  >
                    Work Type
                  </th>
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-[#1E1E1E]
                      w-28
                    "
                  >
                    Workers
                  </th>
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-[#1E1E1E]
                    "
                  >
                    Remarks
                  </th>
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      font-semibold
                      text-[#1E1E1E]
                      w-36
                    "
                  >
                    Updated by
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="
                      border-b
                      border-[#E8E5DF]
                      last:border-0
                      transition-colors
                      duration-150
                      hover:bg-[#F8F6F2]
                    "
                  >
                    <td
                      className="
                        px-6
                        py-4
                        align-top
                        font-medium
                        text-[#1E1E1E]
                        whitespace-nowrap
                      "
                    >
                      {row.showDate
                        ? new Date(row.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </td>
                    <td
                      className="
                        px-6
                        py-4
                        align-top
                        text-[#1E1E1E]
                      "
                    >
                      <span
                        className="
                          rounded-full
                          bg-[#F5F1EA]
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-[#1E1E1E]
                        "
                      >
                        {row.workTypeName}
                      </span>
                    </td>
                    <td
                      className="
                        px-6
                        py-4
                        align-top
                        text-gray-600
                      "
                    >
                      {row.workersCount}
                    </td>
                    <td
                      className="
                        px-6
                        py-4
                        align-top
                        text-gray-600
                        leading-relaxed
                      "
                    >
                      {row.remarks}
                    </td>
                    <td
                      className="
                        px-6
                        py-4
                        align-top
                        text-gray-500
                        text-xs
                        whitespace-nowrap
                      "
                    >
                      {row.updatedByName || ""}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

    </div>
  );
}
