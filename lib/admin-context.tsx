"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_KEY = "nylived-admin";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMIN_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch { }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      if (user) {
        localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(ADMIN_KEY);
      }
    }
  }, [user, hydrated]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser({ email: data.email, name: data.name, role: data.role });
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch { }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AdminContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
