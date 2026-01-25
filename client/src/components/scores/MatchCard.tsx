type Props = {
  type: "live" | "finished";
  title: string;
  teamA: string;
  teamB: string;
  score: string;
  scoreB: string;
  status: "LIVE" | "FINAL";
  compact?: boolean;
  venue?: string;
  date?: string;
};

export default function MatchCard({
  type,
  title,
  teamA,
  teamB,
  score,
  scoreB,
  status,
  compact,
  venue,
  date,
}: Props) {
  const scoreANum = parseInt(score) || 0;
  const scoreBNum = parseInt(scoreB) || 0;
  const teamAWins = scoreANum > scoreBNum;
  const teamBWins = scoreBNum > scoreANum;
  const isDraw = scoreANum === scoreBNum;

  return (
    <div className="rounded-xl bg-white shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow">
      {/* header */}
      {!compact && (
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-700 px-3 sm:px-5 py-2 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-lg">🏆</span>
            <h3 className="font-bold text-white text-sm sm:text-base">{title}</h3>
          </div>
          {status === "LIVE" && (
            <span className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-red-500 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-bold text-white animate-pulse">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white"></span>
              LIVE
            </span>
          )}
        </div>
      )}

      {/* body */}
      <div className={`${compact ? "p-3 sm:p-4" : "p-4 sm:p-6"}`}>
        <div className="flex items-center justify-between">
          {/* Team A */}
          <div className={`flex items-center gap-2 sm:gap-3 flex-1 min-w-0 ${teamAWins ? "opacity-100" : type === "finished" && !isDraw ? "opacity-60" : ""}`}>
            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full grid place-items-center font-black text-sm sm:text-lg flex-shrink-0 ${
              teamAWins 
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white ring-2 ring-emerald-300" 
                : "bg-slate-100 text-slate-600"
            }`}>
              {teamA[0]}
            </div>
            <div className="min-w-0">
              <div className={`font-bold text-sm sm:text-base truncate ${teamAWins ? "text-emerald-700" : "text-slate-800"}`}>
                {teamA}
              </div>
              {teamAWins && type === "finished" && (
                <span className="text-xs font-semibold text-emerald-600 hidden sm:inline">🏆 Winner</span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 sm:gap-2 mx-2 sm:mx-4">
            <div className={`text-xl sm:text-3xl font-black ${teamAWins ? "text-emerald-600" : "text-slate-700"}`}>
              {score}
            </div>
            <div className="rounded-full bg-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold text-white">
              VS
            </div>
            <div className={`text-xl sm:text-3xl font-black ${teamBWins ? "text-emerald-600" : "text-slate-700"}`}>
              {scoreB}
            </div>
          </div>

          {/* Team B */}
          <div className={`flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0 ${teamBWins ? "opacity-100" : type === "finished" && !isDraw ? "opacity-60" : ""}`}>
            <div className="text-right min-w-0">
              <div className={`font-bold text-sm sm:text-base truncate ${teamBWins ? "text-emerald-700" : "text-slate-800"}`}>
                {teamB}
              </div>
              {teamBWins && type === "finished" && (
                <span className="text-xs font-semibold text-emerald-600 hidden sm:inline">🏆 Winner</span>
              )}
            </div>
            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full grid place-items-center font-black text-sm sm:text-lg flex-shrink-0 ${
              teamBWins 
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white ring-2 ring-emerald-300" 
                : "bg-slate-100 text-slate-600"
            }`}>
              {teamB[0]}
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      {!compact && (
        <div className="border-t bg-slate-50 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <span className="flex items-center gap-1 truncate">
              <span>📍</span>
              <span className="truncate">{venue || "Venue TBD"}</span>
            </span>
            {type === "live" ? (
              <span className="text-red-600 font-semibold whitespace-nowrap">● Live</span>
            ) : (
              <span className="text-slate-600 hidden sm:inline">Match Completed</span>
            )}
          </div>
          {isDraw && type === "finished" && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
              Draw
            </span>
          )}
        </div>
      )}
    </div>
  );
}
