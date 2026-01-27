import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { API_ENDPOINTS } from "../config/api";
import axios from "axios";

interface Rule {
  _id: string;
  title: string;
  description: string;
  sport: string;
  category: string;
  order: number;
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sports, setSports] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.RULES_LIST);
      const rulesData = response.data.rules || [];
      setRules(rulesData);
      
      const uniqueSports = [...new Set(rulesData.map((r: Rule) => r.sport).filter(Boolean))] as string[];
      const uniqueCategories = [...new Set(rulesData.map((r: Rule) => r.category).filter(Boolean))] as string[];
      setSports(uniqueSports);
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  };

  const filteredRules = rules.filter((rule) => {
    const sportMatch = selectedSport === "All" || rule.sport === selectedSport;
    const categoryMatch = selectedCategory === "All" || rule.category === selectedCategory;
    return sportMatch && categoryMatch;
  });

  // Group rules by sport
  const groupedBySport = filteredRules.reduce((acc, rule) => {
    if (!acc[rule.sport]) {
      acc[rule.sport] = [];
    }
    acc[rule.sport].push(rule);
    return acc;
  }, {} as Record<string, Rule[]>);

  const getSportIcon = (sport: string) => {
    const icons: Record<string, string> = {
      Football: "⚽",
      Volleyball: "🏐",
      Basketball: "🏀",
      Kabaddi: "🤼",
      Badminton: "🏸",
      Chess: "♟️",
      "Kho Kho": "🏃",
      "Table Tennis": "🏓",
      "Tug of War": "🪢",
      "Sack Race": "🏃",
      General: "📋",
    };
    return icons[sport] || "📖";
  };

  const getSportColor = (sport: string) => {
    const colors: Record<string, string> = {
      Football: "from-green-500 to-green-600",
      Volleyball: "from-yellow-500 to-yellow-600",
      Basketball: "from-orange-500 to-orange-600",
      Kabaddi: "from-red-500 to-red-600",
      Badminton: "from-blue-500 to-blue-600",
      Chess: "from-gray-600 to-gray-700",
      "Kho Kho": "from-purple-500 to-purple-600",
      "Table Tennis": "from-cyan-500 to-cyan-600",
      "Tug of War": "from-amber-500 to-amber-600",
      "Sack Race": "from-pink-500 to-pink-600",
      General: "from-slate-500 to-slate-600",
    };
    return colors[sport] || "from-blue-500 to-blue-600";
  };

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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "General Rules": "📜",
      "Game Rules": "🎮",
      "Eligibility": "✅",
      "Conduct": "🤝",
      "Scoring": "🏆",
      "Equipment": "🎒",
      "Other": "📌",
    };
    return icons[category] || "📄";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              📖 Rule Book
            </h1>
            <p className="text-slate-300 mt-1 text-sm sm:text-base">
              Official rules and regulations for all sports events
            </p>
          </div>
        </div>

        {/* Main Content */}
        <section className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8">
          {/* Filter Section */}
          <div className="rounded-xl bg-white shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b bg-slate-50">
              <h2 className="font-semibold text-slate-900 mb-3">Filter Rules</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Sport Filter */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Sport</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSport("All")}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                        selectedSport === "All"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      All Sports
                    </button>
                    {sports.map((sport) => (
                      <button
                        key={sport}
                        onClick={() => setSelectedSport(sport)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                          selectedSport === sport
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {getSportIcon(sport)} {sport}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                      selectedCategory === "All"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {getCategoryIcon(cat)} {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rules Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading rules...</p>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-700">No Rules Found</h3>
              <p className="text-gray-500 mt-2">
                {selectedSport === "All" && selectedCategory === "All"
                  ? "No rules have been added yet."
                  : "No rules found for the selected filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedBySport)
                .sort()
                .map((sport) => (
                  <div key={sport} className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Sport Header */}
                    <div className={`bg-gradient-to-r ${getSportColor(sport)} px-4 sm:px-6 py-3 sm:py-4`}>
                      <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">{getSportIcon(sport)}</span>
                        {sport} Rules
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {groupedBySport[sport].length} rule{groupedBySport[sport].length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Rules List */}
                    <div className="divide-y">
                      {groupedBySport[sport]
                        .sort((a, b) => a.order - b.order)
                        .map((rule, index) => (
                          <div
                            key={rule._id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <button
                              onClick={() => setExpandedRule(expandedRule === rule._id ? null : rule._id)}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-start gap-3"
                            >
                              {/* Rule Number */}
                              <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-slate-200 text-slate-700 font-bold rounded-full text-sm">
                                {index + 1}
                              </span>

                              {/* Rule Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                                    {rule.title}
                                  </h3>
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(rule.category)}`}>
                                    {rule.category}
                                  </span>
                                </div>
                                <p className={`text-slate-600 text-sm ${expandedRule === rule._id ? "" : "line-clamp-2"}`}>
                                  {rule.description}
                                </p>
                              </div>

                              {/* Expand Icon */}
                              <span className="text-slate-400 text-lg flex-shrink-0">
                                {expandedRule === rule._id ? "▲" : "▼"}
                              </span>
                            </button>

                            {/* Expanded Content */}
                            {expandedRule === rule._id && (
                              <div className="px-4 sm:px-6 pb-4 pt-0 ml-11">
                                <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm whitespace-pre-wrap">
                                  {rule.description}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Quick Navigation */}
          {!loading && filteredRules.length > 0 && selectedSport === "All" && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Navigation</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {sports.map((sport) => {
                  const count = rules.filter((r) => r.sport === sport).length;
                  return (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow text-center"
                    >
                      <div className="text-3xl mb-2">{getSportIcon(sport)}</div>
                      <div className="font-semibold text-slate-900 text-sm">{sport}</div>
                      <div className="text-xs text-slate-500 mt-1">{count} rule{count !== 1 ? "s" : ""}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
