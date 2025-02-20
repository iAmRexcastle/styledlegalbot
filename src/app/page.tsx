"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/app/Logo.svg";
import AnimatedHeadline from "@/app/components/AnimatedHeadline";
import AnimatedGradientBackground from "@/app/components/AnimatedGradientBackground";

export default function LandingPage() {
  const [animateClass, setAnimateClass] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleBoxClick = (option: string) => {
    setAnimateClass("animate-fade-out");
    setTimeout(() => {
      setSelectedOption(option);
      console.log("Selected option:", option);
      setAnimateClass("animate-fade-in");
    }, 1000);
  };

  return (
    <main className="relative w-full h-screen flex flex-col justify-between bg-transparent overflow-hidden">
      {/* Full-Page Animated Gradient Background */}
      <AnimatedGradientBackground />

      {/* Top Section: Attorney Advertisement & Logo */}
      <header className="flex flex-col items-center">
        <p className="attorney-ad">Legal Advertisement</p>
        <div className="animate-fade-down mt-2 mb-4">
          <Image
            src={Logo}
            alt="Logo"
            width={100}
            height={100}
            className="pulse-logo"
          />
        </div>
      </header>

      {/* Middle Section: Animated Headline & Subhead with mobile padding */}
      <section className="flex flex-col items-center flex-grow justify-center px-6 sm:px-12 text-center">
        <AnimatedHeadline />
      </section>

      {/* Bottom Section: Quiz Question & Option Buttons */}
      <footer className="w-full flex flex-col items-center mb-12">
        <p
          className="quiz-question animate-fade-down mb-4"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "1.5rem",
          }}
        >
          Injured In Eaton Fires?
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => handleBoxClick("Yes")}
            className={`glass-box ${animateClass}`}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "1.3rem",
            }}
          >
            <span className="mr-2">🤕</span>Yes
          </button>
          <button
            onClick={() => handleBoxClick("No")}
            className={`glass-box ${animateClass}`}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "1.3rem",
            }}
          >
            <span className="mr-2">🙅</span>No
          </button>
        </div>
        <div className="mt-16"></div>
      </footer>
    </main>
  );
}