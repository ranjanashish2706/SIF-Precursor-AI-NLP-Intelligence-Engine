import React, { useEffect, useRef } from 'react';

export default function CelestialBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle System: Celestial Stardust & Cyber Data Fragments
    const particleCount = Math.min(Math.floor((width * height) / 12000), 120);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.1, // Slow floating upward
      opacity: Math.random() * 0.8 + 0.2,
      color: ['#06b6d4', '#f59e0b', '#a855f7', '#38bdf8', '#ef4444'][Math.floor(Math.random() * 5)],
      pulseSpeed: Math.random() * 0.02 + 0.005
    }));

    // Floating Holographic Grid Rays
    let rayOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Celestial Deep Sky Gradient Base
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.3, 100,
        width * 0.5, height * 0.5, Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0a1128');
      bgGrad.addColorStop(0.4, '#070d1e');
      bgGrad.addColorStop(0.8, '#030712');
      bgGrad.addColorStop(1, '#020409');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Atmospheric Nebula Aurora Lights
      const now = Date.now() * 0.0005;
      const auroraGrad1 = ctx.createRadialGradient(
        width * 0.2 + Math.sin(now) * 100, height * 0.2 + Math.cos(now) * 50, 50,
        width * 0.2, height * 0.2, 500
      );
      auroraGrad1.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      auroraGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auroraGrad1;
      ctx.fillRect(0, 0, width, height);

      const auroraGrad2 = ctx.createRadialGradient(
        width * 0.8 - Math.cos(now) * 80, height * 0.8 - Math.sin(now) * 60, 50,
        width * 0.8, height * 0.8, 600
      );
      auroraGrad2.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      auroraGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auroraGrad2;
      ctx.fillRect(0, 0, width, height);

      // 3. Floating Celestial Stardust & Data Particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(now * 5) * p.pulseSpeed;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow ring around larger stardust
        if (p.size > 1.8) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 4. Subtle Horizon Perspective Grid Rays
      rayOffset = (rayOffset + 0.2) % 40;
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
      ctx.lineWidth = 1;
      for (let x = -width; x < width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(width * 0.5 + (x - width * 0.5) * 0.2, height * 0.3);
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}
