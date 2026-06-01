import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NanoTop — Apoya, Vota y Asciende",
  description:
    "Ranking local para usuarios de Nano. Manizales será la primera comunidad NanoTop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
