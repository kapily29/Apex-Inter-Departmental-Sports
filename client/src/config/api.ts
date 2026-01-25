// API configuration for flexible deployment
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
// Remove trailing slash if present
const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

export default API_BASE_URL;

export const API_ENDPOINTS = {
  // Admin
  ADMIN_SIGNUP: `${API_BASE_URL}/admin/signup`,
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  ADMIN_PROFILE: `${API_BASE_URL}/admin/profile`,
  ADMIN_PROFILE_UPDATE: `${API_BASE_URL}/admin/profile/update`,

  // Teams
  TEAMS_LIST: `${API_BASE_URL}/teams`,
  TEAMS_BY_ID: (id: string) => `${API_BASE_URL}/teams/${id}`,
  TEAMS_CREATE: `${API_BASE_URL}/teams`,
  TEAMS_UPDATE: (id: string) => `${API_BASE_URL}/teams/${id}`,
  TEAMS_DELETE: (id: string) => `${API_BASE_URL}/teams/${id}`,

  // Matches
  MATCHES_LIST: `${API_BASE_URL}/matches`,
  MATCHES_BY_ID: (id: string) => `${API_BASE_URL}/matches/${id}`,
  MATCHES_CREATE: `${API_BASE_URL}/matches`,
  MATCHES_UPDATE: (id: string) => `${API_BASE_URL}/matches/${id}`,
  MATCHES_UPDATE_SCORE: (id: string) => `${API_BASE_URL}/matches/${id}/score`,
  MATCHES_DELETE: (id: string) => `${API_BASE_URL}/matches/${id}`,

  // Players
  PLAYERS_LIST: `${API_BASE_URL}/players`,
  PLAYERS_BY_ID: (id: string) => `${API_BASE_URL}/players/${id}`,
  PLAYERS_CREATE: `${API_BASE_URL}/players`,
  PLAYERS_UPDATE: (id: string) => `${API_BASE_URL}/players/${id}`,
  PLAYERS_APPROVE: (id: string) => `${API_BASE_URL}/players/${id}/approve`,
  PLAYERS_DELETE: (id: string) => `${API_BASE_URL}/players/${id}`,

  // Announcements
  ANNOUNCEMENTS_LIST: `${API_BASE_URL}/announcements`,
  ANNOUNCEMENTS_BY_ID: (id: string) => `${API_BASE_URL}/announcements/${id}`,
  ANNOUNCEMENTS_CREATE: `${API_BASE_URL}/announcements`,
  ANNOUNCEMENTS_UPDATE: (id: string) => `${API_BASE_URL}/announcements/${id}`,
  ANNOUNCEMENTS_DELETE: (id: string) => `${API_BASE_URL}/announcements/${id}`,

  // Gallery
  GALLERY_LIST: `${API_BASE_URL}/gallery`,
  GALLERY_BY_ID: (id: string) => `${API_BASE_URL}/gallery/${id}`,
  GALLERY_CREATE: `${API_BASE_URL}/gallery`,
  GALLERY_UPDATE: (id: string) => `${API_BASE_URL}/gallery/${id}`,
  GALLERY_DELETE: (id: string) => `${API_BASE_URL}/gallery/${id}`,
};
