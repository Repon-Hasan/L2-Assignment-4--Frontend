"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser } from "@/services";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  // Fetch current user from backend
  const refreshUser = async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easier usage
export const useUser = () => useContext(UserContext);
