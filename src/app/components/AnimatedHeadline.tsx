"use client";

import React from "react";

export default function AnimatedHeadline() {
  return (
    <div className="animate-fade-down my-4 px-4 sm:px-8">
      <h1
        className="animated-gradient-headline text-left sm:text-center"
        style={{
          fontSize: "3.5rem", // Desktop size; mobile will use a utility class override (e.g. text-[3rem])
          lineHeight: 1.2,
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
          fontWeight: 900,
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Your AI Claims Assistant
      </h1>
      <h2
        className="animated-subhead text-left sm:text-center"
        style={{
          fontSize: "1.2rem",
          marginTop: "0.25rem",
          marginBottom: "1rem",
          fontWeight: 700,
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Maximize your compensation with our advanced claims tool.
      </h2>
    </div>
  );
}