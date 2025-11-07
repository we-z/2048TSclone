import React, { useEffect, useState } from "react";

export interface ParticleEffectProps {
  tileValue: number;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  type: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
  rotation: number;
  delay: number;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  tileValue,
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Optimized particle count - fewer particles for better performance
    const particleCount = Math.min(3 + tileValue, 10);
    const newParticles: Particle[] = [];

    // Simplified particle types - just sparkles and stars for performance
    const particleTypes = ["✨", "⭐"];

    // Add more variety only for higher levels
    if (tileValue >= 5) particleTypes.push("💫");
    if (tileValue >= 7) particleTypes.push("🌟");

    for (let i = 0; i < particleCount; i++) {
      const angle = (360 / particleCount) * i + Math.random() * 20 - 10;
      // Start from closer to the border edge (50-60px from center) and travel outward
      const distance = 50 + Math.random() * 30 + tileValue * 8; // Farther for higher values

      newParticles.push({
        id: i,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        x: 0,
        y: 0,
        angle,
        distance,
        rotation: Math.random() * 360,
        delay: Math.random() * 50, // Stagger slightly
      });
    }

    setParticles(newParticles);

    // Clean up after animation completes - faster for better performance
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 600); // Faster animation duration

    return () => clearTimeout(timer);
  }, [tileValue, onComplete]);

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={
            {
              "--particle-angle": `${particle.angle}deg`,
              "--particle-distance": `${particle.distance}px`,
              "--particle-rotation": `${particle.rotation}deg`,
              "--particle-delay": `${particle.delay}ms`,
            } as React.CSSProperties
          }
        >
          {particle.type}
        </div>
      ))}
    </div>
  );
};

export default ParticleEffect;
