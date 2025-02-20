"use client";

import React from "react";

export default function AnimatedHeadline() {
  return (
    <div className="animate-fade-down my-4">
      {/* Headline: 2.75rem on mobile, 3.5rem on larger screens; line-height 1 on mobile */}
      <h1
        className="animated-gradient-headline text-[2.75rem] sm:text-[3.5rem] leading-[1] font-[900] font-[Montserrat] mt-2 mb-2"
      >
        Your AI Claims Assistant
      </h1>
      <h2
        className="animated-subhead text-[1rem] sm:text-[1.2rem] leading-[1.4] font-[700] font-[Montserrat] mt-1 mb-4"
      >
        Maximize your compensation with our advanced claims tool.
      </h2>
    </div>
  );
}