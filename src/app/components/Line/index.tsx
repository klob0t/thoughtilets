// src/app/components/Line/index.tsx (Final Connected & Animated Version)
"use client";

import { useEffect, useRef } from 'react';
import styles from './index.module.css';
import gsap from 'gsap';

export default function Line() {
   const componentRef = useRef<HTMLDivElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animation: gsap.core.Tween | null = null;

      const setupAndAnimate = () => {
         if (animation) animation.kill();

         const dpr = window.devicePixelRatio || 1;
         const parentWidth = canvas.parentElement?.getBoundingClientRect().width || 0;
         const containerWidth = parentWidth > 0 ? parentWidth : window.innerWidth * 0.8;
         const maxWidth = 400;
         const size = Math.min(maxWidth, containerWidth);

         if (size <= 0) return;

         canvas.width = size * dpr;
         canvas.height = size * 1.3 * dpr;
         canvas.style.width = `${size}px`;
         canvas.style.height = `${size * 1.3}px`;
         ctx.scale(dpr, dpr);

         const config = {
            segmentsBottom: 15,
            segmentsTop: 120,
            maxOffsetBottom: 30,
            maxOffsetTop: 80,
            transitionHeight: 0.7,
            lineWidth: 1.2,
            color: '#000'
         };

         const canvasWidth = size;
         const canvasHeight = size * 1.3;
         const centerX = canvasWidth / 2;
         const startY = canvasHeight - 50;
         const endY = 50;
         const totalHeight = startY - endY;
         const transitionY = startY - (totalHeight * config.transitionHeight);

         const points = [];
         for (let i = 0; i <= config.segmentsBottom; i++) {
            const t = i / config.segmentsBottom;
            const y = startY - t * (totalHeight * config.transitionHeight);
            const x = centerX + (Math.random() * 2 - 1) * config.maxOffsetBottom;
            points.push({ x, y });
         }
         for (let i = 1; i <= config.segmentsTop; i++) {
            const t = i / config.segmentsTop;
            const y = transitionY - t * (totalHeight * (1 - config.transitionHeight));
            const smoothFactor = Math.pow(t, 2);
            const maxOffset = config.maxOffsetBottom + (config.maxOffsetTop - config.maxOffsetBottom) * smoothFactor;
            const x = centerX + (Math.random() * 2 - 1) * maxOffset;
            points.push({ x, y });
         }

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.lineWidth = config.lineWidth;
         ctx.strokeStyle = config.color;
         ctx.lineCap = 'round';
         ctx.lineJoin = 'round';

         // --- THIS IS THE CORRECTED DRAWING LOGIC ---
         const path = new Path2D();
         path.moveTo(points[0].x, points[0].y);
         const transitionIndex = config.segmentsBottom + 1;

         // Stage 1: Draw the calm part
         for (let i = 1; i < transitionIndex; i++) {
            const midX = (points[i].x + points[i + 1].x) / 2;
            const midY = (points[i].y + points[i + 1].y) / 2;
            path.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
         }
         // This lineTo is crucial for ensuring the connection is solid
         path.lineTo(points[transitionIndex].x, points[transitionIndex].y);

         // Stage 2: Draw the chaotic part
         for (let i = transitionIndex; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const t = (i - transitionIndex) / config.segmentsTop;
            const chaosFactor = Math.pow(t, 2) * 100;
            const cp1x = p0.x + (Math.random() - 0.5) * chaosFactor;
            const cp1y = p0.y - (Math.random()) * chaosFactor * 0.5;
            const cp2x = p1.x - (Math.random() - 0.5) * chaosFactor;
            const cp2y = p1.y + (Math.random()) * chaosFactor * 0.5;
            path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1.x, p1.y);
         }
         // --- END OF CORRECTED LOGIC ---

         let approxLength = 0;
         let prev = points[0];
         for (let i = 1; i < points.length; i++) {
            const cur = points[i];
            approxLength += Math.hypot(cur.x - prev.x, cur.y - prev.y);
            prev = cur;
         }

         const pathLength = approxLength * 1.2;
         ctx.setLineDash([pathLength]);


         animation = gsap.from(ctx, {
            lineDashOffset: pathLength,
            duration: 3,
            ease: 'power1.inOut',
            onUpdate: function () {
               ctx.clearRect(0, 0, canvas.width, canvas.height);
               ctx.stroke(path);
            }
         });
         if (componentRef.current) {
            gsap.from(componentRef.current, { opacity: 1, duration: 1.5, ease: 'power2.out' });
         }
      };

      const resizeObserver = new ResizeObserver(setupAndAnimate);
      if (canvas.parentElement) {
         // We delay the initial call slightly to ensure layout is stable
         setTimeout(() => {
            resizeObserver.observe(canvas.parentElement!);
         }, 10);
      }

      return () => {
         resizeObserver.disconnect();
         if (animation) animation.kill();
      };
   }, []);

   return (
      <div ref={componentRef} className={styles.container}>
         <canvas ref={canvasRef} className={styles.canvas} />
      </div>
   );
}