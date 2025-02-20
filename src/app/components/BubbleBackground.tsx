"use client";

import React from "react";

export default function AnimatedGradientBackground() {
  // Covers entire viewport behind content
  return <div className="absolute inset-0 -z-10 gradient-background" />;
}