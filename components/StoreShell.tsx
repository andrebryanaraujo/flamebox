"use client";

import { usePathname } from "next/navigation";
import Header, { ChatButton, Toast } from "@/components/Header";
import Footer from "@/components/Footer";

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatButton />
      <Toast />
    </>
  );
}
