import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

interface Schedule {
  _id: string;
  sno: number;
  date: string;
  time: string;
  activity: string;
  sport: string;
  gender: string;
  matchDetail: string;
}

interface ManageSchedulesProps {
  refreshKey?: number;
  onEditSchedule?: (schedule: Schedule) => void;
}

export default function ManageSchedules({ refreshKey, onEditSchedule }: ManageSchedulesProps) {
  const { token } = useAdmin();
  const { showNotification, showConfirm } = useNotification();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSchedules();
  }, [token, refreshKey]);

  const fetchSchedules = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_ENDPOINTS.SCHEDULES_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(response.data.schedules || []);
    } catch (error) {
      console.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("Are you sure you want to delete this schedule?");
    if (confirmed) {
      try {
        await axios.delete(API_ENDPOINTS.SCHEDULES_DELETE(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(schedules.filter((s) => s._id !== id));
        showNotification("Schedule deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete schedule", "error");
      }
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const sportMatch = selectedSport === "All" || schedule.sport === selectedSport;
    const searchMatch = searchQuery === "" || 
      schedule.activity?.toLowerCase().includes(searchQuery.toLowerCase());
    return sportMatch && searchMatch;
  });

  const sports = ["All", ...new Set(schedules.map((s) => s.sport).filter(Boolean))];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Manage Schedules</h2>
      </div>

      {/* Filter Bar */}
      <div className="border-b px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search activity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[200px] sm:w-auto"
        />
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none"
        >
          {sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Cards */}
      <div className="block sm:hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading schedules...</div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No schedules found</div>
        ) : (
          filteredSchedules.map((schedule) => (
            <div key={schedule._id} className="border-b p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-500">{schedule.sport}</span>
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-semibold">
                  #{schedule.sno}
                </span>
              </div>
              <div className="font-semibold text-slate-900 text-sm mb-1">
                {schedule.activity}
              </div>
              {schedule.matchDetail && (
                <div className="text-xs text-slate-600 mb-1">{schedule.matchDetail}</div>
              )}
              <div className="text-xs text-slate-500 mb-2">
                {formatDate(schedule.date)} • {schedule.time}{schedule.gender ? ` • ${schedule.gender}` : ""}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEditSchedule?.(schedule)}
                  className="flex-1 px-3 py-1.5 bg-yellow-500 text-white rounded text-xs font-semibold hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(schedule._id)}
                  className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-6 py-3 font-semibold">S.No</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Time</th>
              <th className="px-6 py-3 font-semibold">Activity</th>
              <th className="px-6 py-3 font-semibold">Sport</th>
              <th className="px-6 py-3 font-semibold">Gender</th>
              <th className="px-6 py-3 font-semibold">Match Detail</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Loading schedules...
                </td>
              </tr>
            ) : filteredSchedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No schedules found
                </td>
              </tr>
            ) : (
              filteredSchedules.map((schedule) => (
                <tr key={schedule._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{schedule.sno}</td>
                  <td className="px-6 py-4">{formatDate(schedule.date)}</td>
                  <td className="px-6 py-4">{schedule.time}</td>
                  <td className="px-6 py-4">{schedule.activity}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                      {schedule.sport}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {schedule.gender ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        schedule.gender === "Male" 
                          ? "bg-blue-100 text-blue-700" 
                          : schedule.gender === "Female" 
                          ? "bg-pink-100 text-pink-700" 
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {schedule.gender}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {schedule.matchDetail || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditSchedule?.(schedule)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-xs font-semibold hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(schedule._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
