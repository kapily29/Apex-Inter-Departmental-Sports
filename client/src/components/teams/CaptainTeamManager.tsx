import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/api";
import { useCaptain } from "../../context/CaptainContext";

const SPORTS = [
  "Football",
  "Volleyball",
  "Basketball",
  "Kabaddi",
  "Badminton",
  "Chess",
  "Kho Kho",
  "Table Tennis",
  "Tug of War",
  "Athletics (100 or 200 meter)",
  "Cricket",
];

export default function CaptainTeamManager() {
  const { token } = useCaptain();

  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Create Team modal
  const [showModal, setShowModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const [teamName, setTeamName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  // ✅ Add Member modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberTeamId, setAddMemberTeamId] = useState<string | null>(null);
  const [addMemberSelectedPlayers, setAddMemberSelectedPlayers] = useState<string[]>([]);
  const [addMemberError, setAddMemberError] = useState("");
  const [addMemberLoading, setAddMemberLoading] = useState(false);

  // ✅ Edit Team modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTeam, setEditTeam] = useState<any>(null);
  const [editTeamName, setEditTeamName] = useState("");
  const [editTeamError, setEditTeamError] = useState("");
  const [editTeamLoading, setEditTeamLoading] = useState(false);

  // ✅ fetch only when token available
  useEffect(() => {
    if (!token) return;
    fetchTeams();
    fetchPlayers();
  }, [token]);

  // ✅ whenever editTeam changes
  useEffect(() => {
    if (!editTeam) return;
    setEditTeamName(editTeam.name || "");
    setEditTeamError("");
  }, [editTeam]);

  const fetchTeams = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_ENDPOINTS.CAPTAIN_TEAMS_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch teams");

      setTeams(data.teams || []);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    if (!token) return;

    try {
      const res = await fetch(API_ENDPOINTS.CAPTAIN_PLAYERS_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch players");

      setPlayers((data.players || []).filter((p: any) => p.status === "approved"));
    } catch (e) {
      console.error("Failed to fetch players:", e);
    }
  };

  // ✅ Create Team
  const openModal = () => {
    setSelectedSport("");
    setTeamName("");
    setSelectedPlayers([]);
    setError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleCreateTeam = async (e: any) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_ENDPOINTS.CAPTAIN_CREATE_TEAM, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sport: selectedSport,
          name: teamName,
          playerIds: selectedPlayers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create team");

      setShowModal(false);
      fetchTeams();
    } catch (err: any) {
      setError(err.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Team
  const handleDeleteTeam = async (teamId: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_ENDPOINTS.CAPTAIN_TEAMS_DELETE(teamId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete team");

      fetchTeams();
    } catch (e: any) {
      alert(e.message || "Error deleting team");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Team
  const openEditTeamModal = (team: any) => {
    setEditTeam(team);
    setShowEditModal(true);
  };

  const closeEditTeamModal = () => {
    setShowEditModal(false);
    setEditTeam(null);
    setEditTeamName("");
    setEditTeamError("");
  };

  const handleEditTeam = async (e: any) => {
    e.preventDefault();
    if (!token || !editTeam) return;

    setEditTeamLoading(true);
    setEditTeamError("");

    try {
      const res = await fetch(API_ENDPOINTS.CAPTAIN_TEAMS_UPDATE(editTeam._id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editTeamName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update team");

      closeEditTeamModal();
      fetchTeams();
    } catch (e: any) {
      setEditTeamError(e.message || "Error updating team");
    } finally {
      setEditTeamLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">My Teams</h3>

        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Create Team
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : teams.length === 0 ? (
        <div className="text-slate-500">No teams created yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                  Sport
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                  Team Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                  Players
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {teams.map((team) => (
                <tr key={team._id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">{team.sport}</td>
                  <td className="px-4 py-2">{team.name}</td>
                  <td className="px-4 py-2">
                    {team.players && team.players.length > 0
                      ? team.players.map((p: any) => p.name).join(", ")
                      : "No players"}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        onClick={() => {
                          setAddMemberTeamId(team._id);
                          setAddMemberSelectedPlayers([]);
                          setAddMemberError("");
                          setShowAddMemberModal(true);
                        }}
                      >
                        Add Member
                      </button>

                      <button
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                        onClick={() => openEditTeamModal(team)}
                      >
                        Edit
                      </button>

                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        onClick={() => handleDeleteTeam(team._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Create Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Create Team</h2>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sport</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  required
                >
                  <option value="">Select Sport</option>
                  {SPORTS.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Players</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  multiple
                  value={selectedPlayers}
                  onChange={(e) =>
                    setSelectedPlayers(
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                >
                  {players.map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.sport})
                    </option>
                  ))}
                </select>

                <div className="text-xs text-slate-500 mt-1">
                  Hold Ctrl (Cmd on Mac) to select multiple players
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-200 rounded-lg text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Edit Team Modal */}
      {showEditModal && editTeam && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Edit Team</h2>

            {editTeamError && (
              <div className="mb-2 text-red-600 text-sm">{editTeamError}</div>
            )}

            <form onSubmit={handleEditTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editTeamName}
                  onChange={(e) => setEditTeamName(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeEditTeamModal}
                  className="px-4 py-2 bg-slate-200 rounded-lg text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  disabled={editTeamLoading}
                >
                  {editTeamLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Add Members to Team</h2>

            {addMemberError && (
              <div className="mb-2 text-red-600 text-sm">{addMemberError}</div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!token || !addMemberTeamId) return;

                setAddMemberLoading(true);
                setAddMemberError("");

                try {
                  const res = await fetch(
                    API_ENDPOINTS.CAPTAIN_TEAMS_ADD_MEMBERS(addMemberTeamId),
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ playerIds: addMemberSelectedPlayers }),
                    }
                  );

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Failed to add members");

                  setShowAddMemberModal(false);
                  fetchTeams();
                } catch (err: any) {
                  setAddMemberError(err.message || "Failed to add members");
                } finally {
                  setAddMemberLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Select Players</label>

                <select
                  className="w-full border px-3 py-2 rounded"
                  multiple
                  value={addMemberSelectedPlayers}
                  onChange={(e) =>
                    setAddMemberSelectedPlayers(
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                >
                  {players.map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.sport})
                    </option>
                  ))}
                </select>

                <div className="text-xs text-slate-500 mt-1">
                  Hold Ctrl (Cmd on Mac) to select multiple players
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-slate-200 rounded-lg text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={addMemberLoading}
                >
                  {addMemberLoading ? "Adding..." : "Add Members"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
