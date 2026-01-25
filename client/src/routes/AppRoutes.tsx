import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import ScoresPage from "../pages/ScoresPage";
import SchedulePage from "../pages/SchedulePage";
import LiveScorePage from "../pages/LiveScorePage";
import GalleryPage from "../pages/GalleryPage";
import AdminPage from "../pages/AdminPage";
import TeamsPage from "../pages/TeamsPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import ProtectedRoute from "./ProtectedRoute";

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
