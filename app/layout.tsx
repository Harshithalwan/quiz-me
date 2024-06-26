import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiz Me",
  description: "Custom quizzez",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center py-24 px-8 gap-8">
        <div className="max-w-5xl">{children}</div>
      </body>
    </html>
  );
}
