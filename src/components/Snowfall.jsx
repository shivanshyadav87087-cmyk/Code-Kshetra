import React, { useEffect, useRef } from 'react';

export default function Snowfall({ enabled = true, flakeCount = 45 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize Snowflake Particles
    const flakes = [];
    const symbols = ['❄', '❅', '❆', '•'];

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        density: Math.random() * flakeCount,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        isChar: Math.random() > 0.45,
        fontSize: Math.floor(Math.random() * 8 + 10)
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.01;

      for (let i = 0; i < flakes.length; i++) {
        const flake = flakes[i];

        // Update positions with gentle wind sway
        flake.y += flake.speedY;
        flake.x += Math.sin(angle + flake.density) * 0.6;

        // Wrap around boundaries
        if (flake.y > height) {
          flake.y = -10;
          flake.x = Math.random() * width;
        }
        if (flake.x > width + 10) flake.x = -10;
        else if (flake.x < -10) flake.x = width + 10;

        // Draw Snowflake
        if (flake.isChar) {
          ctx.font = `${flake.fontSize}px sans-serif`;
          ctx.fillStyle = `rgba(186, 230, 253, ${flake.opacity})`;
          ctx.fillText(flake.symbol, flake.x, flake.y);
        } else {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, false);
          ctx.fillStyle = `rgba(224, 242, 254, ${flake.opacity * 0.8})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, flakeCount]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 opacity-75"
      style={{ pointerEvents: 'none' }}
    />
  );
}
