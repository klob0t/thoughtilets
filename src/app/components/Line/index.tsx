// // src/app/components/Line/index.tsx (Final Connected & Animated Version)
// "use client"

// import { useEffect, useRef } from 'react'
// import styles from './index.module.css'
// import gsap from 'gsap'
// import { useLoadingStore } from '@/app/lib/store/loadingStore'

// export default function Line() {
//    const canvasRef = useRef<HTMLCanvasElement>(null)
//    const isAppLoading = useLoadingStore(state => state.activeLoaders > 0)

//    useEffect(() => {
//       const canvas = canvasRef.current
//       if (!canvas) return
//       const ctx = canvas.getContext('2d')
//       if (!ctx) return

//       if (!isAppLoading) {

//          const parentHeight = canvas.parentElement?.getBoundingClientRect().height || 0
//          let animation: gsap.core.Tween | null = null
//          const setupAndAnimate = () => {

//             const parentWidth = canvas.parentElement?.getBoundingClientRect().width || 0
//             const dpr = 2

//             const maxWidth = 400
//             const size = Math.min(maxWidth, parentWidth)

//             if (size <= 0) return

//             canvas.width = parentWidth * dpr
//             canvas.height = parentHeight * dpr
//             canvas.style.width = `${canvas.width / 2}px`
//             canvas.style.height = `${canvas.height / 2}px`

//             ctx.scale(dpr, dpr)

//             const config = {
//                segmentsBottom: Math.floor(canvas.height / 30),
//                segmentsTop: Math.floor(canvas.height / 6),
//                maxOffsetBottom: Math.floor(canvas.width * 0.01),
//                maxOffsetTop: Math.floor(canvas.width * 0.2),
//                transitionHeight: 0.4,
//                lineWidth: 1.2,
//                color: '#000'
//             }

//             const canvasWidth = parentWidth
//             const canvasHeight = parentHeight
//             const centerX = canvasWidth / 2
//             const startY = canvasHeight
//             const endY = 0.1 * canvasHeight
//             const totalHeight = startY - endY
//             const transitionY = startY - (totalHeight * config.transitionHeight)

//             console.log(`canvas height: ${canvas.height}, canvas style height: ${canvasHeight}`)

//             const points = []
//             for (let i = 0; i <= config.segmentsBottom; i++) {
//                const t = i / config.segmentsBottom
//                const y = startY - t * (totalHeight * config.transitionHeight)
//                const x = centerX + (Math.random() * 2 - 1) * config.maxOffsetBottom
//                points.push({ x, y })
//             }
//             for (let i = 1; i <= config.segmentsTop; i++) {
//                const t = i / config.segmentsTop
//                const y = transitionY - t * (totalHeight * (1 - config.transitionHeight))
//                const smoothFactor = Math.pow(t, 2)
//                const maxOffset = config.maxOffsetBottom + (config.maxOffsetTop - config.maxOffsetBottom) * smoothFactor
//                const x = centerX + (Math.random() * 2 - 1) * maxOffset
//                points.push({ x, y })
//             }

//             ctx.clearRect(0, 0, canvas.width, canvas.height)
//             ctx.lineWidth = config.lineWidth
//             ctx.strokeStyle = config.color
//             ctx.lineCap = 'round'
//             ctx.lineJoin = 'round'

//             // --- THIS IS THE CORRECTED DRAWING LOGIC ---
//             const path = new Path2D()
//             path.moveTo(points[0].x, points[0].y)
//             const transitionIndex = config.segmentsBottom + 1

//             // Stage 1: Draw the calm part
//             for (let i = 1; i < transitionIndex; i++) {
//                const midX = (points[i].x + points[i + 1].x) / 2
//                const midY = (points[i].y + points[i + 1].y) / 2
//                path.quadraticCurveTo(points[i].x, points[i].y, midX, midY)
//             }
//             // This lineTo is crucial for ensuring the connection is solid
//             path.lineTo(points[transitionIndex].x, points[transitionIndex].y)

//             // Stage 2: Draw the chaotic part
//             for (let i = transitionIndex; i < points.length - 1; i++) {
//                const p0 = points[i]
//                const p1 = points[i + 1]
//                const t = (i - transitionIndex) / config.segmentsTop
//                const chaosFactor = Math.pow(t, 2) * 100
//                const cp1x = p0.x + (Math.random() - 0.5) * chaosFactor
//                const cp1y = p0.y - (Math.random()) * chaosFactor * 0.5
//                const cp2x = p1.x - (Math.random() - 0.5) * chaosFactor
//                const cp2y = p1.y + (Math.random()) * chaosFactor * 0.5
//                path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1.x, p1.y)
//             }
//             // --- END OF CORRECTED LOGIC ---

//             let approxLength = 0
//             let prev = points[0]
//             for (let i = 1; i < points.length; i++) {
//                const cur = points[i]
//                approxLength += Math.hypot(cur.x - prev.x, cur.y - prev.y)
//                prev = cur
//             }

//             console.log(approxLength)

//             const pathLength = approxLength
//             ctx.setLineDash([pathLength])

//             animation = gsap.from(ctx, {
//                lineDashOffset: pathLength,
//                duration: 3,
//                ease: 'power1.inOut',
//                onUpdate: function () {
//                   ctx.clearRect(0, 0, canvas.width, canvas.height)
//                   ctx.stroke(path)
//                }
//             })
//          }

//          const resizeObserver = new ResizeObserver(setupAndAnimate)
//          if (canvas.parentElement) {
//             // We delay the initial call slightly to ensure layout is stable
//             setTimeout(() => {
//                resizeObserver.observe(canvas.parentElement!)
//             }, 10)
//          }

//          setupAndAnimate()
//          window.addEventListener('resize', setupAndAnimate)

//          return

//       }
//    }, [isAppLoading])

//    return (
//       <canvas ref={canvasRef} className={styles.canvas} />
//    )
// }

'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLoadingStore } from '@/app/lib/store/loadingStore'


export default function Line() {
   const svgRef = useRef<SVGSVGElement>(null)
   const pathRef = useRef<SVGPathElement>(null)
   const wrapperRef = useRef<HTMLDivElement>(null)
   const isAppLoading = useLoadingStore(state => state.activeLoaders > 0)

   useEffect(() => {
      const svg = svgRef.current
      const path = pathRef.current
      const wrapper = wrapperRef.current
      if (!svg || !path) return

      let tween: gsap.core.Tween | null = null

      const draw = () => {
         if (tween) tween.kill()
         path.removeAttribute('d')

         const { width, height } = wrapper!.getBoundingClientRect()
         svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

         const cfg = {
            segmentsBottom: Math.floor(height / 30),
            segmentsTop: Math.floor(height / 6),
            maxOffsetBottom: width * 0.01,
            maxOffsetTop: width * 0.6,
            transitionHeight: 0.2
         }

         const centerX = width / 2
         const startY = height
         const endY = height * 0.1
         const totalH = startY - endY
         const transitionH = startY - (totalH * cfg.transitionHeight)

         const points: { x: number; y: number }[] = []

         for (let i = 0; i <= cfg.segmentsBottom; i++) {
            const t = i / cfg.segmentsBottom
            const y = startY - t * (totalH * cfg.transitionHeight)
            const x = centerX + (Math.random() * 2 - 1) * cfg.maxOffsetBottom
            points.push({ x, y })
         }

         for (let i = 1; i <= cfg.segmentsTop; i++) {
            const t = i / cfg.segmentsTop
            const y = transitionH - t * (totalH * (1 - cfg.transitionHeight))
            const s = t * t
            const maxOff = cfg.maxOffsetBottom + (cfg.maxOffsetTop - cfg.maxOffsetBottom) * s
            const x = centerX + (Math.random() * 2 - 1) * maxOff
            points.push({ x, y })
         }

         let d = `M${points[0].x} ${points[0].y}`
         const transitionIndex = cfg.segmentsBottom + 1

         for (let i = 1; i < transitionIndex; i++) {
            const p0 = points[i]
            const p1 = points[i + 1]
            const mx = (p0.x + p1.x) / 2
            const my = (p0.y + p1.y) / 2
            d += ` Q${p0.x} ${p0.y} ${mx} ${my}`
         }

         d += ` L${points[transitionIndex].x} ${points[transitionIndex].y}`

         for (let i = transitionIndex; i < points.length - 1; i++) {
            const p0 = points[i]
            const p1 = points[i + 1]
            const t = (i - transitionIndex) / cfg.segmentsTop
            const chaos = t * t * 100
            const cp1x = p0.x + (Math.random() - 0.5) * chaos
            const cp1y = p0.y - (Math.random() * chaos * 0.5)
            const cp2x = p1.x - (Math.random() - 0.5) * chaos
            const cp2y = p1.y + (Math.random() * chaos * 0.5)
            d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p1.x} ${p1.y}`
         }

         path.setAttribute('d', d)
         const length = path.getTotalLength()
         path.style.strokeDasharray = `${length}`
         path.style.strokeDashoffset = `${length}`

         tween = gsap.to(path.style, {
            strokeDashoffset: 0,
            duration: 3,
            ease: 'power1.inOut'
         })
      }

      const ro = new ResizeObserver(draw)
      if (svg.parentElement) ro.observe(svg.parentElement)
      window.addEventListener('resize', draw)


      draw()

      return () => {
         ro.disconnect()
         window.removeEventListener('resize', draw)
         if (tween) tween.kill()
      }
   }, [isAppLoading])


   return (
      <div
         ref={wrapperRef}
         style={{
            width: '100%',
            height: '100%'
         }}>
         <svg ref={svgRef}
            style={{
               display: 'block',
               width: '100%',
               height: '100%',
               overflow: 'visible'
            }}>
            <path
               ref={pathRef}
               fill="none"
               stroke="black"
               strokeWidth="1.2"
               strokeLinecap="round"
               strokeLinejoin="round"
            />
         </svg>
      </div>
   )
}

