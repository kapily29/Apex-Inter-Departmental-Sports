import { useState } from "react";
import { useCaptain } from "../../context/CaptainContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamAdded: () => void;
  eligiblePlayers: Array<{
    _id: string;
    name: string;
    rNumber: string;
    sport: string;
  }>;
}

export default function AddTeamModalCaptain({
  isOpen,
  onClose,
  onTeamAdded,
  eligiblePlayers,
}: AddTeamModalProps) {
  const { token } = useCaptain();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    players: [] as string[],
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlayerSelect = (playerId: string) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.includes(playerId)
        ? prev.players.filter((id) => id !== playerId)
        : [...prev.players, playerId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(
        API_ENDPOINTS.CAPTAIN_CREATE_TEAM,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Team created successfully!", "success");
      onTeamAdded();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Add Team</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              ×
            </button>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Team Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sport
              </label>
              <input
                type="text"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Players
              </label>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                {eligiblePlayers.length === 0 ? (
                  <div className="text-slate-500 text-sm">No eligible players found.</div>
                ) : (
                  eligiblePlayers.map((player) => (
                    <label key={player._id} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={formData.players.includes(player._id)}
                        onChange={() => handlePlayerSelect(player._id)}
                      />
                      <span>{player.name} ({player.rNumber}) - {player.sport}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
