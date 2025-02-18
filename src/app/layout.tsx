import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wildfire Calculator AI",
  description: "Next Gen AI Finds The Money – get the wildfire claim you’re truly owed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="gradient-background flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}