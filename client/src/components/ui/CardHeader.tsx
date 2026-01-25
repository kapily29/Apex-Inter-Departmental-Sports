interface CardHeaderProps {
  title: string;
  className?: string;
}

export default function CardHeader({ title, className = "" }: CardHeaderProps) {
  return (
    <div className={`border-b px-5 py-4 ${className}`}>
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
    </div>
  );
}
