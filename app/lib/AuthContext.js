"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  /* Load user from localStorage on mount */
  useEffect(() => {
    function init() {
      try {
        const stored = localStorage.getItem("purpl-user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch {
        // ignore parse errors
      } finally {
        setMounted(true);
      }
    }
    init();
  }, []);

  /* login — called after successful API response */
  function login(userData) {
    setUser(userData);
    localStorage.setItem("purpl-user", JSON.stringify(userData));

    // Set a plain cookie so middleware can check auth without localStorage
    document.cookie = `purpl-token=${userData.accessToken || "authenticated"}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }

  /* logout — clear everything and redirect */
  function logout() {
    setUser(null);
    localStorage.removeItem("purpl-user");
    localStorage.removeItem("purpl-saved-posts");

    // Clear the cookie
    document.cookie = "purpl-token=; path=/; max-age=0";

    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, mounted }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;
