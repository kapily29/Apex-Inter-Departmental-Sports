import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

interface Player {
  _id: string;
  name: string;
  team?: any;
  department?: string;
  position: string;
  number: number;
  status: string;
  joinDate: string;
}

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

interface ManagePlayersProps {
  refreshKey?: number;
}

export default function ManagePlayers({ refreshKey }: ManagePlayersProps) {
  const { token } = useAdmin();
  const { showNotification, showConfirm } = useNotification();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit modal state
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    team: "",
    department: "",
    position: "",
    number: "",
    status: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, [token, refreshKey]);

  const fetchPlayers = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_ENDPOINTS.PLAYERS_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayers(response.data.players || []);
    } catch (error) {
      console.error("Failed to fetch players");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_ENDPOINTS.TEAMS_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data.teams || []);
    } catch (error) {
      console.error("Failed to fetch teams");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.put(API_ENDPOINTS.PLAYERS_APPROVE(id), {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayers(
        players.map((p) => (p._id === id ? { ...p, status: "approved" } : p))
      );
      showNotification("Player approved successfully", "success");
    } catch (error) {
      showNotification("Failed to approve player", "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.put(API_ENDPOINTS.PLAYERS_UPDATE(id), { status: "rejected" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlayers(
        players.map((p) => (p._id === id ? { ...p, status: "rejected" } : p))
      );
      showNotification("Player rejected", "success");
    } catch (error) {
      showNotification("Failed to reject player", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("Are you sure you want to delete this player?");
    if (confirmed) {
      try {
        await axios.delete(API_ENDPOINTS.PLAYERS_DELETE(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayers(players.filter((p) => p._id !== id));
        showNotification("Player deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete player", "error");
      }
    }
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setEditFormData({
      name: player.name || "",
      team: player.team?._id || player.team || "",
      department: player.department || "",
      position: player.position || "",
      number: player.number?.toString() || "",
      status: player.status || "",
    });
    setEditError("");
  };

  const closeEditModal = () => {
    setEditingPlayer(null);
    setEditError("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;

    setEditLoading(true);
    setEditError("");

    try {
      await axios.put(
        API_ENDPOINTS.PLAYERS_UPDATE(editingPlayer._id),
        {
          ...editFormData,
          number: parseInt(editFormData.number),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refetch to get updated team data
      fetchPlayers();
      closeEditModal();
      showNotification("Player updated successfully", "success");
    } catch (err: any) {
      setEditError(err.response?.data?.error || "Failed to update player");
    } finally {
      setEditLoading(false);
    }
  };

  const filteredPlayers = players.filter((player) => {
    const statusMatch = selectedStatus === "All" || player.status?.toLowerCase() === selectedStatus.toLowerCase();
    const searchMatch = searchQuery === "" || 
      player.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position?.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-600 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      case "active":
        return "bg-blue-600 text-white";
      case "inactive":
        return "bg-gray-600 text-white";
      default:
        return "bg-slate-300";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Manage Players</h2>
      </div>

      {/* Filter Bar */}
      <div className="border-b px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search by name, team, position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[200px] sm:w-auto"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none w-full sm:w-auto"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Mobile Cards */}
      <div className="block sm:hidden">
        {filteredPlayers.map((player) => (
          <div key={player._id} className="border-b p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900">{player.name}</h3>
              <span
                className={`px-2 py-0.5 rounded text-white text-xs font-semibold ${getStatusColor(
                  player.status
                )}`}
              >
                {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
              </span>
            </div>
            <div className="text-xs text-slate-500 space-y-1 mb-3">
              <div>🏃 {player.team?.name || "No team"} • {player.position} #{player.number}</div>
              <div>📚 {player.department || "No department"}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {player.status.toLowerCase() === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(player._id)}
                    className="flex-1 text-green-600 hover:text-green-700 font-semibold px-2 py-1.5 bg-green-50 rounded text-xs"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(player._id)}
                    className="flex-1 text-orange-600 hover:text-orange-700 font-semibold px-2 py-1.5 bg-orange-50 rounded text-xs"
                  >
                    ✕ Reject
                  </button>
                </>
              )}
              <button
                onClick={() => openEditModal(player)}
                className="flex-1 text-blue-600 hover:text-blue-700 font-semibold px-2 py-1.5 bg-blue-50 rounded text-xs"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(player._id)}
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
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Team</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Department</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">
                Position
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredPlayers.map((player) => (
              <tr key={player._id} className="hover:bg-slate-50">
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-900 font-medium">
                  {player.name}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                  {player.team?.name || "-"}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                  {player.department || "-"}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                  {player.position} #{player.number}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${getStatusColor(
                      player.status
                    )}`}
                  >
                    {player.status.charAt(0).toUpperCase() +
                      player.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  {player.status.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(player._id)}
                        className="text-green-600 hover:text-green-700 font-semibold text-xs"
                        title="Approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(player._id)}
                        className="text-orange-600 hover:text-orange-700 font-semibold text-xs"
                        title="Reject"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => openEditModal(player)}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-xs"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(player._id)}
                    className="text-red-600 hover:text-red-700 font-semibold text-xs"
                    title="Delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPlayers.length === 0 && !loading && (
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm">
          No players found
        </div>
      )}

      {/* Edit Player Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Edit Player</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
                >
                  ×
                </button>
              </div>

              {editError && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                  {editError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team
                  </label>
                  <select
                    name="team"
                    value={editFormData.team}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={editFormData.department}
                    onChange={handleEditChange}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={editFormData.position}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    name="number"
                    value={editFormData.number}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
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
