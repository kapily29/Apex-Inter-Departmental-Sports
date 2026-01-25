import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import TeamsFilterBar from "../components/teams/TeamsFilterBar";
import TeamCard from "../components/teams/TeamCard";
import TeamsFAQ from "../components/teams/TeamsFAQ";
import TeamsLocation from "../components/teams/TeamsLocation";
import { API_ENDPOINTS } from "../config/api";

interface Team {
  _id: string;
  name: string;
  sport: string;
  department: string;
  record: string;
  wins: string;
  standings: string;
  coach: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [searchQuery, setSearchQuery] = useState("");
  const [sports, setSports] = useState<string[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.TEAMS_LIST);
        const data = await response.json();
        const teamsData = data.teams || [];
        setTeams(teamsData);
        
        // Extract unique sports
        const uniqueSports = [...new Set(teamsData.map((t: Team) => t.sport).filter(Boolean))] as string[];
        setSports(uniqueSports);
      } catch (err: any) {
        setError(err.message || "Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [teams, selectedSport, searchQuery]);

  const filterTeams = () => {
    let filtered = [...teams];
    
    // Filter by sport
    if (selectedSport !== "All Sports") {
      filtered = filtered.filter((t) => t.sport === selectedSport);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.sport.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTeams(filtered);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-10 sm:py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTItNCAwLTQgMiAwIDQgMiA0IDQgMiA0IDIgMC0yIDItNHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <span className="text-blue-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Apex Sports</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 tracking-tight">OUR TEAMS</h1>
          <p className="text-sm sm:text-lg text-slate-300 mt-2 sm:mt-3 max-w-2xl mx-auto">
            Meet our talented college sports teams competing across multiple disciplines
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="bg-white/10 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <span className="font-bold text-white">{teams.length}</span>
              <span className="text-slate-300 ml-1">Teams</span>
            </div>
            <div className="bg-white/10 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <span className="font-bold text-white">{sports.length}</span>
              <span className="text-slate-300 ml-1">Sports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <TeamsFilterBar
        sports={sports}
        selectedSport={selectedSport}
        onSportChange={setSelectedSport}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Teams Grid */}
      <section className="mx-auto max-w-6xl px-3 sm:px-4 py-8 sm:py-12">
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
            <p className="text-slate-600 mt-3 sm:mt-4 text-sm sm:text-base">Loading teams...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 sm:py-12 bg-red-50 rounded-xl">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredTeams.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow">
                <p className="text-slate-500 text-base sm:text-lg">No teams found</p>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredTeams.map((team) => (
                  <TeamCard
                    key={team._id}
                    name={team.name}
                    sport={team.sport}
                    department={team.department}
                    record={team.record}
                    wins={team.wins}
                    standings={team.standings}
                    coach={team.coach}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* FAQ Section */}
      <TeamsFAQ />

      {/* Location Section */}
      <TeamsLocation />

      <Footer />
    </div>
  );
}
