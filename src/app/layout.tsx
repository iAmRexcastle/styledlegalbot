import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wildfire Calculator AI",
  description: "Next Gen AI Finds The Money – get the wildfire claim you’re truly owed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className="gradient-background flex items-center justify-center">
=======
      <body className="gradient-background min-h-screen flex flex-col">
>>>>>>> 9c6f96b (Initial commit)
        {children}
      </body>
    </html>
  );
}