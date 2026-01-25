type Props = {
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
};

export default function ScheduleDateFilter({ selectedDate, onDateChange }: Props) {
  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        full: date.toISOString().split("T")[0],
        day: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
        weekday: i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    return dates;
  };

  const dates = generateDates();

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-6 bg-white border-b">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => onDateChange(null)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg transition-colors ${
              selectedDate === null
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Dates
          </button>
          {dates.map((d) => (
            <button
              key={d.full}
              onClick={() => onDateChange(d.full)}
              className={`flex flex-col items-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg transition-colors min-w-12 sm:min-w-16 ${
                selectedDate === d.full
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span className="text-xs opacity-80">{d.weekday}</span>
              <span className="text-base sm:text-lg font-bold">{d.day}</span>
              <span className="text-xs opacity-80">{d.month}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            onChange={(e) => onDateChange(e.target.value || null)}
            className="w-full sm:w-auto rounded-lg border border-slate-300 px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
