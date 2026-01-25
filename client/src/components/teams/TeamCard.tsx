type Props = {
  name: string;
  sport: string;
  department?: string;
  record: string;
  wins: string;
  standings: string;
  coach?: string;
};

export default function TeamCard({ name, sport, department, record, wins, standings, coach }: Props) {
  // Generate a consistent color based on sport
  const sportColors: Record<string, string> = {
    Basketball: "from-orange-500 to-red-600",
    Football: "from-green-500 to-emerald-600",
    Volleyball: "from-purple-500 to-violet-600",
    Kabaddi: "from-red-500 to-rose-600",
    Badminton: "from-cyan-500 to-teal-600",
    Chess: "from-gray-600 to-gray-800",
    "Kho Kho": "from-yellow-500 to-amber-600",
    "Table Tennis": "from-blue-500 to-indigo-600",
    "Tug of War": "from-pink-500 to-rose-600",
    "Sack Race": "from-lime-500 to-green-600",
  };

  const gradientClass = sportColors[sport] || "from-blue-500 to-blue-700";

  return (
    <div className="group rounded-xl sm:rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Team Header */}
      <div className={`h-24 sm:h-32 bg-gradient-to-br ${gradientClass} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl sm:text-7xl opacity-20">🏆</span>
        </div>
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {sport}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 sm:p-4">
          <h3 className="text-base sm:text-xl font-black text-white tracking-tight truncate">{name}</h3>
        </div>
      </div>

      {/* Team Info */}
      <div className="p-3 sm:p-5">
        {/* Department */}
        {department && (
          <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-slate-100">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
              {department}
            </span>
          </div>
        )}
        
        {/* Coach */}
        {coach && (
          <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs sm:text-sm">
              👤
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Head Coach</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{coach}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <div className="text-center p-1.5 sm:p-2 bg-slate-50 rounded-lg overflow-hidden">
            <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">{record || "0-0"}</div>
            <div className="text-xs text-slate-500 mt-0.5">Record</div>
          </div>
          <div className="text-center p-1.5 sm:p-2 bg-emerald-50 rounded-lg overflow-hidden">
            <div className="text-xs sm:text-sm font-bold text-emerald-600 truncate">{wins || "0"}</div>
            <div className="text-xs text-slate-500 mt-0.5">Wins</div>
          </div>
          <div className="text-center p-1.5 sm:p-2 bg-blue-50 rounded-lg overflow-hidden">
            <div className="text-xs sm:text-sm font-bold text-blue-600 truncate">{standings || "-"}</div>
            <div className="text-xs text-slate-500 mt-0.5">Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
}
