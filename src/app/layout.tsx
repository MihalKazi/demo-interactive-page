import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interactive Story",
  description: "Data journalism template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning prevents browser extensions from crashing Next.js */}
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}