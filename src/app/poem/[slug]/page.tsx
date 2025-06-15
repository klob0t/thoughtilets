'use client'
import { useState, useEffect, use, useRef } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './page.module.css'
import ScribbleHR from '@/app/components/Line/Horizontal'
import Line, { drawLine } from '@/app/components/Line'
import { RiShareBoxLine } from 'react-icons/ri'
import html2canvas from 'html2canvas'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/all'

gsap.registerPlugin(SplitText)

interface Poem {
   title: string,
   content: string,
   created_at: string
}

export default function PoemsPage({ params }: { params: Promise<{ slug: string }> }) {
   const [poem, setPoem] = useState<Poem | null>(null)
   const [error, setError] = useState<string | null>(null)
   const [isLoading, setIsLoading] = useState(true)
   const poemContentRef = useRef<HTMLDivElement>(null)
   const watermarkRef = useRef<HTMLDivElement>(null)
   const buttonRef = useRef<HTMLButtonElement>(null)
   const footerRef = useRef<HTMLDivElement>(null)
   const lineRef = useRef<HTMLCanvasElement>(null)

   const { slug } = use(params)

   useEffect(() => {
      if (!slug) return
      const fetchPoems = async () => {
         try {
            setError(null)
            const response = await fetch(`/api/poems/${slug}`)

            if (!response.ok) {
               throw new Error('Poem not found')
            }

            const data: Poem = await response.json()
            setPoem(data)
         } catch (err) {
            if (err instanceof Error) {
               setError(err.message)
            } else {
               setError('An unknown error occurered')
            }
         } finally {
            setIsLoading(false)
         }
      }

      if (slug) {
         fetchPoems()
      }
   }, [slug])

   useGSAP(() => {
      const poem = poemContentRef.current?.querySelector('p')
      console.log(poem)

      if (poem) {
         const split = new SplitText([poem], { type: 'words' })

         gsap.from(split.words, {
            duration: 0.4,
            opacity: 0,
            ease: 'power3.inOut',
            stagger: {
               each: 0.1
            },
            delay: 0.1
         })
      }
   }, { scope: poemContentRef, dependencies: [poem] })

   const handleDownload = async () => {
      const element = poemContentRef.current
      const footer = footerRef.current
      const watermark = watermarkRef.current
      const button = buttonRef.current
      const lineCanvas = lineRef.current
      if (!element || !footer || !watermark || !button || !lineCanvas) return

      const canvas = document.createElement('canvas')
      const scale = 2

      const originalWidth = lineCanvas.width
      const originalHeight = lineCanvas.height

      canvas.width = originalWidth * scale
      canvas.height = originalHeight * scale

      const ctx = canvas.getContext('2d')

      if (ctx) {
         ctx.scale(scale, scale)
         drawLine(canvas)
      }

      const tempImage = new Image()
      tempImage.src = canvas.toDataURL()

      tempImage.style.width = `${originalWidth}px`
      tempImage.style.height = `${originalHeight}px`

      const tempWrapper = document.createElement('div')
      tempWrapper.style.display = 'flex'
      tempWrapper.style.width = `${originalWidth}px`
      tempWrapper.style.justifyContent = 'center'
      tempWrapper.style.alignItems = 'center'
      tempWrapper.appendChild(tempImage)


      try {
         watermark.style.visibility = 'visible'
         button.style.visibility = 'hidden'
         footer.style.visibility = 'hidden'
         lineCanvas.style.display = 'none'
         element.style.aspectRatio = '4/5'
         element.style.width = '1080px'
         lineCanvas.parentElement?.appendChild(tempWrapper)

         const canvas = await html2canvas(element, {
            backgroundColor: '#f9fafb',
            scale: 2
         })

         const data = canvas.toDataURL('image/png')
         const link = document.createElement('a')
         link.href = data
         link.download = `${slug} - thoughtilets.png`
         document.body.appendChild(link)
         link.click()
         document.body.removeChild(link)

      } catch (error) {
         console.error('Snapshot failed: ', error)
      } finally {
         watermark.style.visibility = 'hidden'
         button.style.visibility = 'visible'
         footer.style.visibility = 'visible'
         lineCanvas.style.display = 'block'
         element.style.width = '100%'
         element.style.aspectRatio = 'unset'
         if (tempWrapper.parentNode) {
            tempWrapper.parentNode.removeChild(tempWrapper)
         }
      }

   }

   if (isLoading) {
      return <main className={styles.container}><p></p></main>
   }


   if (error) {
      return (
         <main className={styles.container}>
            <p>Error: {error}</p>
            <Link href="/">Back to collection</Link>
         </main>
      )
   }

   return (
      <main className={styles.page}>
         <div className={styles.fullContainer} ref={poemContentRef}>
            <div className={styles.wrapper}>
               <div className={styles.container}>
                  <header className={styles.header}>
                     <h1>{poem?.title}</h1>
                  </header>
                  <ScribbleHR />
                  <article className={styles.content}>
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {poem?.content}
                     </ReactMarkdown>
                     <div className={styles.note}>
                        <p>—thcl</p>
                     </div>
                  </article>

                  <footer className={styles.footer} ref={footerRef}>

                     <Link href="/">← Back to collection</Link>
                     <button
                        ref={buttonRef}
                        onClick={handleDownload}
                        title="Download as Image"
                        style={{
                           border: 'none',
                           backgroundColor: 'none',
                           padding: 0,
                           width: '40px',
                           height: '40px',
                           verticalAlign: 'middle',
                           cursor: 'pointer'
                        }}
                     >
                        <RiShareBoxLine
                           style={{
                              fontSize: '1.5rem'
                           }}
                        />
                     </button>
                  </footer>
               </div>
               <div className={styles.line}>
                  <Line ref={lineRef} />
                  <div className={styles.info}>

                     <div
                        ref={watermarkRef}
                        className={styles.watermarkRef}
                        style={{
                           visibility: 'hidden',
                           fontFamily: 'var(--font-serif)', fontSize: '1em',
                        }}>
                        thoughtilets.vercel.app
                     </div>
                  </div>

               </div>



            </div>


         </div>

      </main>
   )
}