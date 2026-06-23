import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "할 일 목록",
  description: "Next.js(App Router) + FastAPI Todo 앱 — 3차 과제",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
