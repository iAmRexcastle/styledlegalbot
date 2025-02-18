"use client";

import { useState } from "react";
import Image from "next/image";
import Particles from "react-tsparticles";
import type { ContainerOptions } from "tsparticles-engine";
import Logo from "@/app/Logo.svg";
import AnimatedHeadline from "@/app/components/AnimatedHeadline";

export default function LandingPage() {
  const [animateClass, setAnimateClass] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleBoxClick = (option: string) => {
    setAnimateClass("animate-fade-out");
    setTimeout(() => {
      setSelectedOption(option);
      console.log("Selected option:", option);
      // Proceed to next funnel step
      setAnimateClass("animate-fade-in");
    }, 2500);
  };

  // Particle configuration (feel free to adjust these values)
  const particlesOptions: ContainerOptions = {
    background: {
      color: {
        value: "#070017"
      }
    },
    fpsLimit: 60,
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: false,
        },
        onClick: {
          enable: false,
        },
        resize: true,
      },
    },
    particles: {
      color: {
        value: "#ffffff"
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        outModes: {
          default: "bounce"
        }
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 50,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 3 }
      },
    },
    detectRetina: true,
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      {/* Content Overlay */}
      <div className="gradient-background min-h-screen w-full flex flex-col overflow-hidden relative z-10">
        {/* Header Section for Attorney Advertisement */}
        <header className="w-full text-center mt-4">
          <p className="attorney-ad text-[1rem]">Legal Advertisement</p>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-grow px-[1%]">
          <div className="container w-full max-w-xl mx-auto text-center">
            {/* Logo with enhanced pulsing effect */}
            <div
              className="flex justify-center animate-fade-down neon-logo-container"
              style={{ marginTop: "2.5%", marginBottom: "5%" }}
            >
              <Image
                src={Logo}
                alt="Logo"
                width={100}
                height={100}
                className="logo-pulse"
              />
            </div>

            {/* Animated Headline & Subhead */}
            <AnimatedHeadline />
          

            {/* Key Emoji */}
            <p className="emoji-paragraph animate-fade-down animate-delay-1000 text-3xl">
              🔑
            </p>

            {/* Quiz Question */}
            <p className="quiz-question animate-fade-down animate-delay-1000">
              <span
                style={{
                  fontFamily: "'Montserrat ExtraBold', sans-serif",
                  fontSize: "1.1rem",
                }}
              >
                Were You Injured In The Eaton Fire?
              </span>
            </p>

            {/* Option Buttons */}
            <div className="flex flex-row justify-center gap-6 mt-4 mb-[25%]">
              <button
                onClick={() => handleBoxClick("Yes")}
                className={`glass-box ${animateClass} neon-button`}
                style={{
                  fontFamily: "'Montserrat ExtraBold', sans-serif",
                  fontSize: "1.25rem",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleBoxClick("No")}
                className={`glass-box ${animateClass} neon-button`}
                style={{
                  fontFamily: "'Montserrat ExtraBold', sans-serif",
                  fontSize: "1.25rem",
                }}
              >
                No
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}