import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

interface Player {
  _id: string;
  name: string;
  email: string;
  rNumber: string;
  uniqueId: string;
  phone?: string;
  department: string;
  position?: string;
  status: string;
  createdAt: string;
}

interface PlayerApprovalsProps {
  refreshKey?: number;
}

export default function PlayerApprovals({ refreshKey }: PlayerApprovalsProps) {
  const { token } = useAdmin();
  const { showNotification } = useNotification();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [activeTab, setActiveTab] = useState<"approvals" | "verify">("approvals");
  
  // Verification form state
  const [verifyForm, setVerifyForm] = useState({ rNumber: "", uniqueId: "" });
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    verified: boolean;
    player?: { name: string; department: string; status: string };
  } | null>(null);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    fetchPlayers();
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

  const handleApprove = async (id: string) => {
    try {
      await axios.put(
        API_ENDPOINTS.PLAYERS_APPROVE(id),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayers(
        players.map((p) => (p._id === id ? { ...p, status: "approved" } : p))
      );
      showNotification("Player approved successfully!", "success");
    } catch (error) {
      showNotification("Failed to approve player", "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.put(
        API_ENDPOINTS.PLAYERS_UPDATE(id),
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlayers(
        players.map((p) => (p._id === id ? { ...p, status: "rejected" } : p))
      );
      showNotification("Player rejected", "success");
    } catch (error) {
      showNotification("Failed to reject player", "error");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");
    setVerifyResult(null);
    setVerifyLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.PLAYER_VERIFY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verifyForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setVerifyError(data.error || "Verification failed");
        return;
      }

      setVerifyResult(data);
    } catch (err: any) {
      setVerifyError(err.message || "An error occurred");
    } finally {
      setVerifyLoading(false);
    }
  };

  const filteredPlayers = players.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const pendingCount = players.filter((p) => p.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Tabs - Approvals vs Verify */}
      <div className="flex gap-2 border-b pb-4">
        <button
          onClick={() => setActiveTab("approvals")}
          className={`px-6 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 ${
            activeTab === "approvals"
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          ✅ Player Approvals
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          className={`px-6 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 ${
            activeTab === "verify"
              ? "bg-sky-600 text-white shadow-lg"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          🔍 Verify Player
        </button>
      </div>

      {activeTab === "verify" && (
        <div className="max-w-xl">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Verify Player Credentials</h3>
            <p className="text-sm text-slate-500 mb-6">
              Enter a player's R-Number and Unique ID to verify their registration.
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              {verifyError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {verifyError}
                </div>
              )}

              {verifyResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3 text-green-700">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-lg">Verified Successfully!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-slate-500 text-xs">Name</p>
                      <p className="font-semibold text-slate-800">{verifyResult.player?.name}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-slate-500 text-xs">Department</p>
                      <p className="font-semibold text-slate-800">{verifyResult.player?.department}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 col-span-2">
                      <p className="text-slate-500 text-xs">Status</p>
                      <p className={`font-semibold capitalize ${
                        verifyResult.player?.status === "approved" ? "text-green-600" : 
                        verifyResult.player?.status === "pending" ? "text-amber-600" : "text-red-600"
                      }`}>
                        {verifyResult.player?.status}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  R-Number (College Roll Number)
                </label>
                <input
                  type="text"
                  value={verifyForm.rNumber}
                  onChange={(e) => setVerifyForm({ ...verifyForm, rNumber: e.target.value })}
                  placeholder="e.g., R2021001"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Unique Player ID
                </label>
                <input
                  type="text"
                  value={verifyForm.uniqueId}
                  onChange={(e) => setVerifyForm({ ...verifyForm, uniqueId: e.target.value })}
                  placeholder="e.g., APX-0001-AB12"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifyLoading}
                className="w-full py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50"
              >
                {verifyLoading ? "Verifying..." : "🔍 Verify Player"}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "approvals" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">
                {players.filter((p) => p.status === "pending").length}
              </p>
              <p className="text-sm text-amber-700">Pending</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {players.filter((p) => p.status === "approved").length}
              </p>
              <p className="text-sm text-green-700">Approved</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-600">
                {players.filter((p) => p.status === "rejected").length}
              </p>
              <p className="text-sm text-red-700">Rejected</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            filter === "pending"
              ? "bg-amber-600 text-white"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          Pending {pendingCount > 0 && `(${pendingCount})`}
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            filter === "approved"
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            filter === "all"
              ? "bg-slate-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All
        </button>
      </div>

      {/* Players List */}
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <div className="text-5xl mb-4">
            {filter === "pending" ? "✅" : "👥"}
          </div>
          <p className="text-slate-600">
            {filter === "pending"
              ? "No pending approvals"
              : "No players found"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPlayers.map((player) => (
            <div
              key={player._id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">
                        {player.name}
                      </h3>
                      <p className="text-sm text-slate-500">{player.department}</p>
                    </div>
                    <span
                      className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                        player.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : player.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-500 text-xs">Unique ID</p>
                      <p className="font-mono font-semibold text-emerald-600">
                        {player.uniqueId}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-500 text-xs">R-Number</p>
                      <p className="font-mono font-semibold text-sky-600">
                        {player.rNumber}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-500 text-xs">Email</p>
                      <p className="font-medium text-slate-700 truncate">
                        {player.email}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-500 text-xs">Phone</p>
                      <p className="font-medium text-slate-700">
                        {player.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  {player.position && (
                    <p className="text-sm text-slate-500 mt-2">
                      Position: <span className="font-medium">{player.position}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                {player.status === "pending" && (
                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={() => handleApprove(player._id)}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(player._id)}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}
