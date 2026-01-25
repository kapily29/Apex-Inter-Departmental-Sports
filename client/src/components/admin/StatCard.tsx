type Props = {
  icon: string;
  count: string;
  label: string;
  color: string;
};

export default function StatCard({ icon, count, label, color }: Props) {
  return (
    <div className={`rounded-lg ${color} text-white p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-4xl font-extrabold">{count}</div>
          <div className="text-sm font-semibold mt-1">{label}</div>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
