// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wildfire Calculator AI",
  description:
    "Next Gen AI Finds The Money – get the wildfire claim you’re truly owed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen relative overflow-hidden flex flex-col">
        <div className="w-full max-w-screen-xl mx-auto px-4 pt-4">
          {children}
        </div>
      </body>
    </html>
  );
}