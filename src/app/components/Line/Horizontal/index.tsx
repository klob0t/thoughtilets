// src/app/components/ScribbleHR/index.tsx
"use client"; // This component uses browser APIs, so it must be a Client Component

import { useEffect, useRef } from 'react';
import styles from './index.module.css';

export default function ScribbleHR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawScribble = () => {
      // --- Configuration for a subtle horizontal line ---
      const config = {
        segments: 100,      // Number of small line segments
        maxOffsetY: 4,      // How "wavy" the line is (in pixels)
        lineWidth: 1,
        color: '#000'   // A soft gray color
      };
      
      const canvasWidth = canvas.width / window.devicePixelRatio;
      const canvasHeight = canvas.height / window.devicePixelRatio;
      
      // We're drawing horizontally now
      const startX = 0;
      const endX = canvasWidth;
      const totalWidth = endX - startX;
      const centerY = canvasHeight / 2; // The line will wiggle around the vertical center

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = config.lineWidth;
      ctx.strokeStyle = config.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // --- Point Generation (Horizontal) ---
      const points = [];
      for (let i = 0; i <= config.segments; i++) {
        const t = i / config.segments;
        // The X position progresses steadily from left to right
        const x = startX + t * totalWidth;
        // The Y position wiggles randomly around the center
        const y = centerY + (Math.random() * 2 - 1) * config.maxOffsetY;
        points.push({ x, y });
      }

      // --- Drawing Logic ---
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }
      // Draw the final segment
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
    };

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      // Get the width of the parent container
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      
      canvas.width = rect.width * dpr;
      canvas.height = 20 * dpr; // Use the height from our CSS
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `20px`;
      
      ctx.scale(dpr, dpr);
      drawScribble();
    };

    // --- Event Listeners ---
    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    // Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, []); // Run only once on mount

  return (
    <canvas ref={canvasRef} className={styles.hrCanvas} />
  );
}