import { Navigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";

interface PlayerProtectedRouteProps {
  children: React.ReactNode;
}

export default function PlayerProtectedRoute({ children }: PlayerProtectedRouteProps) {
  const { isAuthenticated } = usePlayer();

  if (!isAuthenticated) {
    return <Navigate to="/player-login" replace />;
  }

  return <>{children}</>;
}
