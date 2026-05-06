import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RTDB Inspector | Firebase Realtime Database Security & Data Analysis",
  description: "A clean, minimal, modern Firebase Realtime Database analysis tool. Analyze database security rules, explore data, and monitor realtime configurations in a single dashboard.",
  keywords: ["Firebase", "Realtime Database", "RTDB", "Database Inspector", "Security Rules", "Data Explorer", "Firebase tools", "Real time db analyzer", "DB viewer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className={`min-h-full flex flex-col ${inter.className}`}>{children}</body>
    </html>
  );
}
