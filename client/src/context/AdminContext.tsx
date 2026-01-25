import { createContext, useContext, useState, useEffect } from "react";

interface AdminData {
  _id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  phone?: string;
  bio?: string;
  role?: string;
}

interface AdminContextType {
  token: string | null;
  admin: AdminData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, admin: AdminData) => void;
  logout: () => void;
  updateAdmin: (admin: AdminData) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize from localStorage immediately to prevent flicker
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("adminToken");
  });
  const [admin, setAdmin] = useState<AdminData | null>(() => {
    const stored = localStorage.getItem("adminData");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verify token is still valid
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminData");
    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, adminData: AdminData) => {
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminData", JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
  };

  const updateAdmin = (adminData: AdminData) => {
    setAdmin(adminData);
    localStorage.setItem("adminData", JSON.stringify(adminData));
  };

  const value: AdminContextType = {
    token,
    admin,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    updateAdmin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

