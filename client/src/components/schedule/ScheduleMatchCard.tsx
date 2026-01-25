type Props = {
  date: string;
  sport: string;
  teamA: string;
  teamB: string;
  venue: string;
  time: string;
  status?: string;
};

export default function ScheduleMatchCard({
  date,
  sport,
  teamA,
  teamB,
  venue,
  time,
  status,
}: Props) {
  const isLive = status === "live";
  const isCompleted = status === "completed" || status === "finished";

  return (
    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col sm:flex-row">
        {/* Date Section */}
        <div className={`px-3 sm:px-5 py-2 sm:py-4 sm:min-w-24 flex flex-row sm:flex-col justify-between sm:justify-center items-center border-b sm:border-b-0 sm:border-r ${
          isLive 
            ? "bg-gradient-to-r sm:bg-gradient-to-b from-red-500 to-red-600 text-white" 
            : isCompleted
            ? "bg-gradient-to-r sm:bg-gradient-to-b from-slate-200 to-slate-300 text-slate-700"
            : "bg-gradient-to-r sm:bg-gradient-to-b from-blue-500 to-blue-600 text-white"
        }`}>
          <div className="text-xs sm:text-sm font-semibold opacity-90">{date}</div>
          <div className="text-sm sm:text-lg font-bold sm:mt-1">{time}</div>
          {isLive && (
            <span className="sm:mt-2 px-2 py-0.5 bg-white/20 rounded text-xs font-bold animate-pulse">
              LIVE
            </span>
          )}
          {isCompleted && (
            <span className="sm:mt-2 px-2 py-0.5 bg-slate-400 rounded text-xs font-bold text-white">
              ENDED
            </span>
          )}
        </div>

        {/* Match Info */}
        <div className="flex-1 px-3 sm:px-5 py-3 sm:py-4">
          {/* Sport Tag */}
          <div className="mb-2 sm:mb-3">
            <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-800 text-white text-xs font-semibold rounded-full">
              {sport}
            </span>
          </div>

          {/* Teams */}
          <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 grid place-items-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                {teamA[0]}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 truncate">{teamA}</div>
            </div>
            <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 flex-shrink-0">
              VS
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
              <div className="text-sm sm:text-base font-bold text-slate-900 truncate">{teamB}</div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                {teamB[0]}
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
            <span>📍</span>
            <span className="font-medium truncate">{venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
