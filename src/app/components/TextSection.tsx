"use client";

import React from "react";

export default function TextSection() {
  return (
    <div className="text-center">
      {/* Headline */}
      <h1
        style={{
          fontFamily: "'BarlowCondensed-Black', sans-serif",
          fontSize: "2.5rem",
          lineHeight: "3.2rem",
          letterSpacing: "0.12rem",
          textAlign: "center",
        }}
      >
        AI: A Game Changer for Wildfire Compensation
      </h1>
      
      {/* Subhead */}
      <p
        style={{
          fontFamily: "'BarlowCondensed-MediumItalic', sans-serif",
          fontSize: "1.67rem",
          marginBottom: "10%",
          textAlign: "center",
        }}
      >
        🔥 Maximize your payout with a quick, AI-driven claim estimate.
      </p>
      
      {/* Emphasis Text */}
      <p
        style={{
          fontFamily: "'Montserrat ExtraBold', sans-serif",
          fontSize: "1.1rem",
          textAlign: "center",
        }}
      >
        Were You Injured In The Eaton Fire?
      </p>
    </div>
  );
}