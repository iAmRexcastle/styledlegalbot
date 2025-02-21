"use client";

import React from "react";

export default function AnimatedHeadline() {
  return (
    <div className="animate-fade-down my-4 px-4">
      <h1 className="animated-gradient-headline text-[2rem] sm:text-[2.75rem] leading-tight font-extrabold mt-2 mb-2">
        Your AI Claims Assistant
      </h1>
      <h2 className="animated-subhead text-[1rem] sm:text-[1.2rem] leading-relaxed font-semibold mt-1 mb-4">
        Maximize your compensation with our advanced claims tool.
      </h2>
    </div>
  );
}