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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      stars.current = Array.from({ length: starCount }, () => ({
        x: (Math.random() - 0.5) * canvas.width,
        y: (Math.random() - 0.5) * canvas.height,
        z: Math.random() * canvas.width,
      }));
    });
    if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
    }
    
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;

    stars.current = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * canvas.width,
      y: (Math.random() - 0.5) * canvas.height,
      z: Math.random() * canvas.width,
    }));

    let animationFrameId: number;

    const render = () => {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      const [r, g, b] = starColor;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      stars.current.forEach(star => {
        star.z -= speedFactor;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
          star.z = canvas.width;
        }

        const k = 128 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const size = ((1 - star.z / canvas.width) * 5);
          context.fillStyle = `rgba(${r},${g},${b},${1 - star.z/canvas.width})`;
          context.fillRect(px, py, size, size);
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
    };
  }, [speedFactor, backgroundColor, starColor, starCount]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />;
};

export default Starfield;
