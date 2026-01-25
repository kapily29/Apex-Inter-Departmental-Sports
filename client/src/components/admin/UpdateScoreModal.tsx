import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

interface UpdateScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string | null;
  matchDetails?: any;
  onScoreUpdated: () => void;
}

export default function UpdateScoreModal({
  isOpen,
  onClose,
  matchId,
  matchDetails,
  onScoreUpdated,
}: UpdateScoreModalProps) {
  const { token } = useAdmin();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    scoreA: "",
    scoreB: "",
    status: "scheduled",
  });

  // Pre-fill form with existing match data when modal opens, reset when closed
  useEffect(() => {
    if (isOpen && matchDetails) {
      setFormData({
        scoreA: matchDetails.scoreA?.toString() || "",
        scoreB: matchDetails.scoreB?.toString() || "",
        status: matchDetails.status || "scheduled",
      });
      setError("");
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        scoreA: "",
        scoreB: "",
        status: "scheduled",
      });
      setError("");
    }
  }, [isOpen, matchDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        API_ENDPOINTS.MATCHES_UPDATE_SCORE(matchId || ""),
        {
          scoreA: parseInt(formData.scoreA),
          scoreB: parseInt(formData.scoreB),
          status: formData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showNotification("Score updated successfully", "success");
      onScoreUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update score");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !matchId) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" onClick={onClose}></div>
      
      {/* Modal Panel */}
      <div className="fixed bottom-0 right-0 left-0 sm:left-auto w-full sm:w-96 h-[80vh] sm:h-screen bg-white shadow-2xl z-50 overflow-y-auto rounded-t-2xl sm:rounded-none">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Update Score</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl p-1"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 sm:p-3 bg-red-100 text-red-800 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4 p-2 sm:p-3 bg-gray-100 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600">
                {matchDetails?.team1Name || "Team 1"} vs{" "}
                {matchDetails?.team2Name || "Team 2"}
              </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team A Score
              </label>
              <input
                type="number"
                name="scoreA"
                value={formData.scoreA}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team B Score
              </label>
              <input
                type="number"
                name="scoreB"
                value={formData.scoreB}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 text-sm sm:text-base"
            >
              {loading ? "Updating..." : "Update Score"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
