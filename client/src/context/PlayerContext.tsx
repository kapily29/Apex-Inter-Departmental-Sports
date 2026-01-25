import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Player {
  id: string;
  name: string;
  email: string;
  rNumber: string;
  uniqueId: string;
  phone?: string;
  department: string;
  position?: string;
  team?: any;
  status: string;
}

interface PlayerContextType {
  player: Player | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, player: Player) => void;
  logout: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(() => {
    const stored = localStorage.getItem("playerData");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("playerToken");
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("playerToken");
    const storedPlayer = localStorage.getItem("playerData");

    if (storedToken && storedPlayer) {
      setToken(storedToken);
      setPlayer(JSON.parse(storedPlayer));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newPlayer: Player) => {
    setToken(newToken);
    setPlayer(newPlayer);
    localStorage.setItem("playerToken", newToken);
    localStorage.setItem("playerData", JSON.stringify(newPlayer));
  };

  const logout = () => {
    setToken(null);
    setPlayer(null);
    localStorage.removeItem("playerToken");
    localStorage.removeItem("playerData");
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        token,
        isAuthenticated: !!token && !!player,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
