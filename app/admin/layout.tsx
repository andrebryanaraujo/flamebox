"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminProvider, useAdmin } from "@/lib/admin-context";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileNav from "@/components/AdminMobileNav";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Allow login page without auth
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }
    if (!isAuthenticated) {
      router.replace("/admin/login");
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!checked || !isAuthenticated) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        color: "var(--text-muted)",
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <AdminMobileNav />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminProvider>
  );
}
