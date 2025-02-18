"use client";

import React from "react";

export default function AnimatedHeadline() {
  return (
    <div className="text-center">
      <h1
        className="animated-gradient-headline"
        style={{
          fontFamily: "'BarlowCondensed-Black', sans-serif",
          fontSize: "2.5rem",
          lineHeight: "3.2rem",
          letterSpacing: "0.12rem",
        }}
      >
        AI: A Game Changer for Wildfire Compensation
      </h1>
      <p
        className="animated-subhead"
        style={{
          fontFamily: "'BarlowCondensed-MediumItalic', sans-serif",
          fontSize: "1.67rem",
          marginBottom: "10%",
        }}
      >
        🔥 Maximize your payout with a quick, AI-driven claim estimate.
      </p>
    </div>
  );
}