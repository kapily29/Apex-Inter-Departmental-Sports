import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

interface Team {
  _id: string;
  name: string;
  sport: string;
  department: string;
  coach: string;
  description: string;
  imageUrl: string;
}

const SPORTS_OPTIONS = [
  "Football",
  "Volleyball",
  "Basketball",
  "Kabaddi",
  "Badminton",
  "Chess",
  "Kho Kho",
  "Table Tennis",
  "Tug of War",
  "Sack Race",
];

const DEPARTMENT_OPTIONS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Chemical",
  "Biotechnology",
  "MBA",
  "MCA",
  "Other",
];

interface ManageTeamsProps {
  refreshKey?: number;
}

export default function ManageTeams({ refreshKey }: ManageTeamsProps) {
  const { token } = useAdmin();
  const { showNotification, showConfirm } = useNotification();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  
  // Edit modal state
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    sport: "",
    department: "",
    coach: "",
    description: "",
    imageUrl: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchTeams();
  }, [token, refreshKey]);

  const fetchTeams = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_ENDPOINTS.TEAMS_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data.teams || []);
    } catch (error) {
      console.error("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("Are you sure you want to delete this team?");
    if (confirmed) {
      try {
        await axios.delete(API_ENDPOINTS.TEAMS_DELETE(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(teams.filter((t) => t._id !== id));
        showNotification("Team deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete team", "error");
      }
    }
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setEditFormData({
      name: team.name || "",
      sport: team.sport || "",
      department: team.department || "",
      coach: team.coach || "",
      description: team.description || "",
      imageUrl: team.imageUrl || "",
    });
    setEditError("");
  };

  const closeEditModal = () => {
    setEditingTeam(null);
    setEditError("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    
    setEditLoading(true);
    setEditError("");

    try {
      await axios.put(
        API_ENDPOINTS.TEAMS_UPDATE(editingTeam._id),
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setTeams(teams.map((t) => 
        t._id === editingTeam._id ? { ...t, ...editFormData } : t
      ));
      closeEditModal();
      showNotification("Team updated successfully", "success");
    } catch (err: any) {
      setEditError(err.response?.data?.error || "Failed to update team");
    } finally {
      setEditLoading(false);
    }
  };

  const sports = ["All", ...new Set(teams.map((t) => t.sport).filter(Boolean))];
  
  const filteredTeams = teams.filter((team) => {
    const sportMatch = selectedSport === "All" || team.sport === selectedSport;
    const searchMatch = searchQuery === "" || 
      team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.coach?.toLowerCase().includes(searchQuery.toLowerCase());
    return sportMatch && searchMatch;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Manage Teams</h2>
      </div>

      {/* Search and Filter Bar */}
      <div className="border-b px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search by name or coach..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[200px] sm:w-auto"
        />
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none w-full sm:w-auto"
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
        {filteredTeams.map((team) => (
          <div key={team._id} className="border-b p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900">{team.name}</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {team.sport}
              </span>
            </div>
            <div className="text-xs text-slate-500 space-y-1 mb-3">
              <div>📚 {team.department || "No department"}</div>
              <div>👤 {team.coach || "No coach"}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(team)}
                className="flex-1 text-blue-600 hover:text-blue-700 font-semibold px-2 py-1.5 bg-blue-50 rounded text-xs"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(team._id)}
                className="text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 bg-red-50 rounded text-xs"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Sport</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Department</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Coach</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTeams.map((team) => (
              <tr key={team._id} className="hover:bg-slate-50">
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-900 font-medium">
                  {team.name}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{team.sport}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{team.department || "-"}</td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                  {team.coach || "-"}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(team)}
                    className="text-blue-600 hover:text-blue-700 font-semibold px-2 py-1 bg-blue-50 rounded text-xs"
                    title="Edit Team"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(team._id)}
                    className="text-red-600 hover:text-red-700 font-semibold px-2 py-1 bg-red-50 rounded text-xs"
                    title="Delete Team"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTeams.length === 0 && !loading && (
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm">
          No teams found
        </div>
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Team</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {editError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
                  {editError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sport
                  </label>
                  <select
                    name="sport"
                    value={editFormData.sport}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Sport</option>
                    {SPORTS_OPTIONS.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    value={editFormData.department}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coach
                  </label>
                  <input
                    type="text"
                    name="coach"
                    value={editFormData.coach}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={editFormData.imageUrl}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    {editLoading ? "Updating..." : "Update Team"}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
