import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import ScoresPage from "../pages/ScoresPage";
import SchedulePage from "../pages/SchedulePage";
import LiveScorePage from "../pages/LiveScorePage";
import GalleryPage from "../pages/GalleryPage";
import AdminPage from "../pages/AdminPage";
import TeamsPage from "../pages/TeamsPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import PlayerRegisterPage from "../pages/PlayerRegisterPage";
import PlayerLoginPage from "../pages/PlayerLoginPage";
import PlayerDashboardPage from "../pages/PlayerDashboardPage";
import PlayerVerifyPage from "../pages/PlayerVerifyPage";
import RulesPage from "../pages/RulesPage";
import ProtectedRoute from "./ProtectedRoute";
import PlayerProtectedRoute from "./PlayerProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/scores" element={<ScoresPage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/live" element={<LiveScorePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/rules" element={<RulesPage />} />

      {/* Player Routes */}
      <Route path="/player-register" element={<PlayerRegisterPage />} />
      <Route path="/player-login" element={<PlayerLoginPage />} />
      <Route path="/player-verify" element={<PlayerVerifyPage />} />
      <Route
        path="/player-dashboard"
        element={
          <PlayerProtectedRoute>
            <PlayerDashboardPage />
          </PlayerProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
