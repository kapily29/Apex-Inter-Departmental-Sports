const pendingScores = [
  {
    id: 1,
    teamA: "Eagles",
    teamB: "Rockets",
    sport: "Soccer",
    date: "Apr 20, 2024",
  },
  {
    id: 2,
    teamA: "Mavericks",
    teamB: "Cougars",
    sport: "Volleyball",
    date: "Apr 18, 2024",
  },
];

export default function PendingScoreUpdates() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          Pending Score Updates
        </h2>
      </div>

      <div className="divide-y">
        {pendingScores.map((score) => (
          <div
            key={score.id}
            className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">⚽</span>
              <div>
                <h3 className="font-extrabold text-slate-900">
                  {score.teamA} vs {score.teamB}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {score.sport} | {score.date}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-950">
              Update Score
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <button className="w-full px-6 py-2 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200">
          View All Matches ▼
        </button>
      </div>
    </div>
  );
}
