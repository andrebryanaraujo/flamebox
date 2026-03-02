import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SettingsProvider } from "@/lib/settings-context";
import StoreShell from "@/components/StoreShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Contas de Jogos",
  description: "Encontre as melhores contas de jogos com os melhores preços!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <SettingsProvider>
          <CartProvider>
            <StoreShell>{children}</StoreShell>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
