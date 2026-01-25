export default function ScoresFilterBar() {
  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Live Scores & Results
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Track all matches, scores, and game updates in real-time
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <select className="rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-medium text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option className="text-slate-900">All Sports</option>
              <option className="text-slate-900">Football</option>
              <option className="text-slate-900">Basketball</option>
              <option className="text-slate-900">Baseball</option>
              <option className="text-slate-900">Soccer</option>
            </select>

            <select className="rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-medium text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
              <option className="text-slate-900">All Teams</option>
              <option className="text-slate-900">Bulls</option>
              <option className="text-slate-900">Eagles</option>
              <option className="text-slate-900">Chargers</option>
              <option className="text-slate-900">Spartans</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
