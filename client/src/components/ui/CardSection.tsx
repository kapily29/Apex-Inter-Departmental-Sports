import { ReactNode } from "react";

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export default function CardSection({ children, className = "" }: CardSectionProps) {
  return <div className={`p-5 space-y-5 ${className}`}>{children}</div>;
}
