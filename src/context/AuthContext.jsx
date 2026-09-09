/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { login as loginAPI } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("basquiat_token");
    const saved = localStorage.getItem("basquiat_user");
    return token && saved ? JSON.parse(saved) : null;
  });
  const loading = false;

  const login = async (username, password) => {
    const data = await loginAPI(username, password);
    localStorage.setItem("basquiat_token", data.token);
    localStorage.setItem("basquiat_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("basquiat_token");
    localStorage.removeItem("basquiat_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
