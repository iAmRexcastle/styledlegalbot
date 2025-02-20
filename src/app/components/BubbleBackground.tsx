"use client";

import { useCallback } from "react";
import Particles from "@tsparticles/react";
import type { Engine, Container } from "@tsparticles/engine";
// IMPORTANT: Import loadFull from "tsparticles" instead of "@tsparticles/engine"
import { loadFull } from "tsparticles";

export default function BubbleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    // loadFull is imported from "tsparticles"
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Optional: perform any post-load actions
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      className="absolute inset-0 -z-10"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
          number: { value: 50, density: { enable: true, area: 800 } },
          color: { value: "#00e5ff" },
          shape: { type: "circle" },
          opacity: { value: 0.8 },
          size: { value: { min: 3, max: 8 } },
          move: {
            enable: true,
            speed: 1.8,
            direction: "none",
            outModes: { default: "out" },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
        },
        detectRetina: true,
      }}
    />
  );
}