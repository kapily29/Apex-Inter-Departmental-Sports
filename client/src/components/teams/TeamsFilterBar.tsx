type Props = {
  sports: string[];
  selectedSport: string;
  onSportChange: (sport: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export default function TeamsFilterBar({
  sports,
  selectedSport,
  onSportChange,
  searchQuery,
  onSearchChange,
}: Props) {
  return (
    <div className="bg-white border-b shadow-sm sticky top-14 sm:top-0 z-10">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
        {/* Sport Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-2 scrollbar-hide">
          <button
            onClick={() => onSportChange("All Sports")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedSport === "All Sports"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Sports
          </button>
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => onSportChange(sport)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedSport === sport
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search teams by name or sport..."
              className="w-full pl-9 sm:pl-12 pr-4 py-2 sm:py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
