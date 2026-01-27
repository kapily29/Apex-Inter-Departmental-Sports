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

interface ManageRulesProps {
  refreshKey?: number;
  onEditRule?: (rule: Rule) => void;
}

export default function ManageRules({ refreshKey, onEditRule }: ManageRulesProps) {
  const { token } = useAdmin();
  const { showNotification, showConfirm } = useNotification();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRules();
  }, [token, refreshKey]);

  const fetchRules = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_ENDPOINTS.RULES_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRules(response.data.rules || []);
    } catch (error) {
      console.error("Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("Are you sure you want to delete this rule?");
    if (confirmed) {
      try {
        await axios.delete(API_ENDPOINTS.RULES_DELETE(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRules(rules.filter((r) => r._id !== id));
        showNotification("Rule deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete rule", "error");
      }
    }
  };

  const filteredRules = rules.filter((rule) => {
    const sportMatch = selectedSport === "All" || rule.sport === selectedSport;
    const categoryMatch = selectedCategory === "All" || rule.category === selectedCategory;
    const searchMatch = searchQuery === "" || 
      rule.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return sportMatch && categoryMatch && searchMatch;
  });

  const sports = ["All", ...new Set(rules.map((r) => r.sport).filter(Boolean))];
  const categories = ["All", ...new Set(rules.map((r) => r.category).filter(Boolean))];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "General Rules": "bg-blue-100 text-blue-800",
      "Game Rules": "bg-green-100 text-green-800",
      "Eligibility": "bg-purple-100 text-purple-800",
      "Conduct": "bg-red-100 text-red-800",
      "Scoring": "bg-yellow-100 text-yellow-800",
      "Equipment": "bg-orange-100 text-orange-800",
      "Other": "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Manage Rules</h2>
      </div>

      {/* Filter Bar */}
      <div className="border-b px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search rules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[200px] sm:w-auto"
        />
        <div className="flex gap-2">
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
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block sm:hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading rules...</div>
        ) : filteredRules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No rules found</div>
        ) : (
          filteredRules.map((rule) => (
            <div key={rule._id} className="border-b p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-500">{rule.sport}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getCategoryColor(rule.category)}`}>
                  {rule.category}
                </span>
              </div>
              <div className="font-semibold text-slate-900 text-sm mb-1">
                {rule.title}
              </div>
              <div className="text-xs text-slate-600 mb-3 line-clamp-2">
                {rule.description}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEditRule?.(rule)}
                  className="flex-1 px-3 py-1.5 bg-yellow-500 text-white rounded text-xs font-semibold hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(rule._id)}
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
              <th className="px-6 py-3 font-semibold">Title</th>
              <th className="px-6 py-3 font-semibold">Description</th>
              <th className="px-6 py-3 font-semibold">Sport</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Loading rules...
                </td>
              </tr>
            ) : filteredRules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No rules found
                </td>
              </tr>
            ) : (
              filteredRules.map((rule) => (
                <tr key={rule._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{rule.title}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{rule.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                      {rule.sport}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(rule.category)}`}>
                      {rule.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditRule?.(rule)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-xs font-semibold hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rule._id)}
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
