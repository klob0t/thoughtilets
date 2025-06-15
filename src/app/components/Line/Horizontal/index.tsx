
"use client" 

import { useEffect, useRef } from 'react'
import styles from './index.module.css'

export default function ScribbleHR() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawScribble = () => {
      
      const config = {
        segments: 100,      
        maxOffsetY: 4,     
        lineWidth: 1.5,
        color: '#000'   
      }
      
      const canvasWidth = canvas.width / window.devicePixelRatio
      const canvasHeight = canvas.height / window.devicePixelRatio
      
      
      const startX = 0
      const endX = canvasWidth
      const totalWidth = endX - startX
      const centerY = canvasHeight / 2 

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = config.lineWidth
      ctx.strokeStyle = '#000'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      
      const points = []
      for (let i = 0; i <= config.segments; i++) {
        const t = i / config.segments
        
        const x = startX + t * totalWidth
        
        const y = centerY + (Math.random() * 2 - 1) * config.maxOffsetY
        points.push({ x, y })
      }

      
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2
        const midY = (points[i].y + points[i + 1].y) / 2
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY)
      }
      
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
      ctx.stroke()
    }

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      
      canvas.width = rect.width * dpr
      canvas.height = 20 * dpr 
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `20px`
      
      ctx.scale(dpr, dpr)
      drawScribble()
    }

    
    setupCanvas()
    window.addEventListener('resize', setupCanvas)

    
    return () => {
      window.removeEventListener('resize', setupCanvas)
    }
  }, []) 

  return (
    <canvas ref={canvasRef} className={styles.hrCanvas} />
  )
}