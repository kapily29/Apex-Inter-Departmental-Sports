import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "danger" | "warning";

type ButtonProps = {
  children: React.ReactNode;
  to?: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  to,
  variant = "primary",
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const base =
    "rounded-md px-4 py-3 text-sm font-bold text-center transition-colors";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-700 text-white hover:bg-blue-800",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-red-700 text-white hover:bg-red-800",
    warning: "bg-yellow-500 text-slate-900 hover:bg-yellow-400",
  };

  const styles = `${base} ${variants[variant]} ${
    fullWidth ? "block w-full" : ""
  } ${className}`;

  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
