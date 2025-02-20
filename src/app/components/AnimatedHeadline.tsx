"use client";

import React from "react";

export default function AnimatedHeadline() {
  return (
    <div className="animate-fade-down my-4">
      {/* 
        text-[3rem] => 3rem on mobile
        sm:text-[3.5rem] => 3.5rem on screens >= sm breakpoint
        leading-[1.2] => line-height: 1.2
        font-[900] => bold
      */}
      <h1
        className="animated-gradient-headline text-[3rem] sm:text-[3.5rem] leading-[1.2] font-[900] font-[Montserrat] mt-2 mb-2"
      >
        Your AI Claims Assistant
      </h1>

      {/* 
        text-[1rem] => 1rem on mobile
        sm:text-[1.2rem] => 1.2rem on screens >= sm
        leading-[1.4] => line-height: 1.4
        font-[700] => bold
      */}
      <h2
        className="animated-subhead text-[1rem] sm:text-[1.2rem] leading-[1.4] font-[700] font-[Montserrat] mt-1 mb-4"
      >
        Maximize your compensation with our advanced claims tool.
      </h2>
    </div>
  );
}