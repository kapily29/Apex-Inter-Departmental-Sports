import { Navigate } from "react-router-dom";
import { useCaptain } from "../context/CaptainContext";

interface Props {
  children: React.ReactNode;
}

export default function CaptainProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useCaptain();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/captain-login" replace />;
  }

  return <>{children}</>;
}
