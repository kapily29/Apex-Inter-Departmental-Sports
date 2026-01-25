import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScheduleDateFilter from "../components/schedule/ScheduleDateFilter";
import ScheduleMatchCard from "../components/schedule/ScheduleMatchCard";
import TodayMatches from "../components/schedule/TodayMatches";
import Announcements from "../components/schedule/Announcements";
import { API_ENDPOINTS } from "../config/api";
import axios from "axios";

export default function SchedulePage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sports, setSports] = useState<string[]>([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    filterMatches();
  }, [matches, selectedSport, selectedDate]);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.MATCHES_LIST);
      const matchesData = response.data.matches || [];
      setMatches(matchesData);
      
      // Extract unique sports
      const uniqueSports = [...new Set(matchesData.map((m: any) => m.sport).filter(Boolean))] as string[];
      setSports(uniqueSports);
    } catch (err) {
      console.error("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  const filterMatches = () => {
    let filtered = [...matches];
    
    // Filter by sport
    if (selectedSport !== "All") {
      filtered = filtered.filter((m) => m.sport === selectedSport);
    }
    
    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((m) => {
        const matchDate = new Date(m.date).toDateString();
        return matchDate === new Date(selectedDate).toDateString();
      });
    }
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setFilteredMatches(filtered);
  };

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Match Schedule
            </h1>
            <p className="text-slate-300 mt-1 text-sm sm:text-base">View upcoming matches and set reminders</p>
          </div>
        </div>

        {/* Date Filter */}
        <ScheduleDateFilter 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />

        {/* Main Content Grid */}
        <section className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Left side - Matches */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Sport Tabs */}
              <div className="rounded-xl bg-white shadow-md overflow-hidden">
                <div className="flex items-center gap-2 border-b bg-slate-100 px-3 sm:px-4 py-2 sm:py-3 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setSelectedSport("All")}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                      selectedSport === "All"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    All Sports
                  </button>
                  {sports.map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors ${
                        selectedSport === sport
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>

                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {loading ? (
                    <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">Loading matches...</div>
                  ) : filteredMatches.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <p className="text-base sm:text-lg">No matches found</p>
                      <p className="text-xs sm:text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  ) : (
                    filteredMatches.map((match) => (
                      <ScheduleMatchCard
                        key={match._id}
                        date={formatFullDate(match.date)}
                        sport={match.sport}
                        teamA={match.teamA?.name || "Team A"}
                        teamB={match.teamB?.name || "Team B"}
                        venue={match.venue}
                        time={new Date(match.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        status={match.status}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              <TodayMatches />
              <Announcements />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
