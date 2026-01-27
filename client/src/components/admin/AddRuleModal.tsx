import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

interface Rule {
  _id: string;
  title: string;
  description: string;
  sport: string;
  category: string;
  order: number;
}

interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRuleAdded: () => void;
  editRule?: Rule | null;
}

const SPORTS = [
  "General",
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

const CATEGORIES = [
  "General Rules",
  "Game Rules",
  "Eligibility",
  "Conduct",
  "Scoring",
  "Equipment",
  "Other",
];

export default function AddRuleModal({ 
  isOpen, 
  onClose, 
  onRuleAdded,
  editRule 
}: AddRuleModalProps) {
  const { token } = useAdmin();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sport: "General",
    category: "General Rules",
    order: "0",
  });

  useEffect(() => {
    if (editRule) {
      setFormData({
        title: editRule.title,
        description: editRule.description,
        sport: editRule.sport,
        category: editRule.category,
        order: editRule.order.toString(),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        sport: "General",
        category: "General Rules",
        order: "0",
      });
    }
  }, [editRule, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        sport: formData.sport,
        category: formData.category,
        order: parseInt(formData.order),
      };

      if (editRule) {
        await axios.put(API_ENDPOINTS.RULES_UPDATE(editRule._id), payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Rule updated successfully", "success");
      } else {
        await axios.post(API_ENDPOINTS.RULES_CREATE, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Rule added successfully", "success");
      }

      onRuleAdded();
      onClose();
      setFormData({
        title: "",
        description: "",
        sport: "General",
        category: "General Rules",
        order: "0",
      });
    } catch (error: any) {
      showNotification(error.response?.data?.error || "Failed to save rule", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">
            {editRule ? "Edit Rule" : "Add New Rule"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter rule title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter rule description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Sport *
              </label>
              <select
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SPORTS.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Order (for sorting)
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : editRule ? "Update" : "Add Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
