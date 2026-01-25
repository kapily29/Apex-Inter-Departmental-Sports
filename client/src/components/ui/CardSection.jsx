export default function CardSection({ children, className = "" }) {
  return <div className={`p-5 space-y-5 ${className}`}>{children}</div>;
}
