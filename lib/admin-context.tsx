"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_KEY = "nylived-admin";

// Simulated admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@nylived.com",
  password: "admin123",
  name: "Administrador",
  role: "admin",
};

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

  const login = useCallback((email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
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
