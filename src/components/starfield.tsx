'use client'

import React, { useRef, useEffect } from 'react';

type Star = {
  x: number;
  y: number;
  z: number;
};

interface StarfieldProps {
  speedFactor?: number;
  backgroundColor?: string;
  starColor?: [number, number, number];
  starCount?: number;
}

const Starfield: React.FC<StarfieldProps> = ({
  speedFactor = 0.05,
  backgroundColor = 'black',
  starColor = [255, 255, 255],
  starCount = 5000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useRef<Star[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
      }));
    });
    resizeObserver.observe(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
    }));

    let animationFrameId: number;

    const render = () => {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      const [r, g, b] = starColor;
      context.fillStyle = `rgba(${r},${g},${b},.7)`;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const mouseX = mouse.current.x;
      const mouseY = mouse.current.y;
      
      stars.current.forEach(star => {
        star.z -= speedFactor;

        if (star.z <= 0) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
          star.z = canvas.width;
        }

        const k = 128 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const size = ((1 - star.z / canvas.width) * 5);
          context.fillRect(px, py, size, size);
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = (e.clientX - rect.left) - canvas.width / 2;
        mouse.current.y = (e.clientY - rect.top) - canvas.height / 2;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [speedFactor, backgroundColor, starColor, starCount]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

export default Starfield;
