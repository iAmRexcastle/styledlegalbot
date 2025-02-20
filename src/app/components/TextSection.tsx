"use client";

import React from "react";

// Extracted style objects for clarity
const headlineStyle: React.CSSProperties = {
  fontFamily: "'BarlowCondensed-Black', sans-serif",
  fontSize: "2.5rem",
  lineHeight: "3.2rem",
  letterSpacing: "0.12rem",
  textAlign: "center",
};

const subheadStyle: React.CSSProperties = {
  fontFamily: "'BarlowCondensed-MediumItalic', sans-serif",
  fontSize: "1.67rem",
  marginBottom: "10%",
  textAlign: "center",
};

const emphasisStyle: React.CSSProperties = {
  fontFamily: "'Montserrat ExtraBold', sans-serif",
  fontSize: "1.1rem",
  textAlign: "center",
};

export default function TextSection() {
  return (
    <section className="text-center">
      {/* Headline */}
      <h1 style={headlineStyle}>
        AI: A Game Changer for Wildfire Compensation
      </h1>
      
      {/* Subhead */}
      <p style={subheadStyle}>
        🔥 Maximize your payout with a quick, AI-driven claim estimate.
      </p>
      
      {/* Emphasis Text */}
      <p style={emphasisStyle}>
        Were You Injured In The Eaton Fire?
      </p>
    </section>
  );
}