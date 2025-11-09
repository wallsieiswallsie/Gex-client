import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from "../utils/constants";

const EXPIRY_KEY = "auth_expiry";
const THREE_MONTHS = 90 * 24 * 60 * 60 * 1000; // 90 hari

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);

    // ✅ Jika tidak ada expiry → anggap logout
    if (!expiry) {
      setInitializing(false);
      return;
    }

    // ✅ Jika lewat dari expiry → logout otomatis
    if (Date.now() > Number(expiry)) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      setUser(null);
      setInitializing(false);
      return;
    }

    // ✅ Jika masih valid → tetap login
    if (storedUser && accessToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    setInitializing(false);
  }, []);

  const login = useCallback(({ userData, accessToken, refreshToken }) => {
    if (userData) {
      const expiryTime = Date.now() + THREE_MONTHS;

      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(EXPIRY_KEY, expiryTime);

      setUser(userData);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}