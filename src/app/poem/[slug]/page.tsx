'use client'
import { useState, useEffect, use, useRef } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './page.module.css'
import ScribbleHR from '@/app/components/Line/Horizontal'
import Line from '@/app/components/Line'
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
   const watermark = useRef<HTMLDivElement>(null)
   const button = useRef<HTMLButtonElement>(null)

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
      if (!element) return

      watermark.current!.style.display = 'block'
      button.current!.style.display = 'none'

      const canvas = await html2canvas(element, {
         backgroundColor: '#f9fafb',
         scale: 2
      })

      watermark.current!.style.display = 'none'
      button.current!.style.display = 'block'

      const data = canvas.toDataURL('image/png')

      const link = document.createElement('a')
      link.href = data
      link.download = `${slug}.png`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
   }
   if (isLoading) {
      return <main className={styles.container}><p></p></main>;
   }


   if (error) {
      return (
         <main className={styles.container}>
            <p>Error: {error}</p>
            <Link href="/">Back to collection</Link>
         </main>
      );
   }

   return (
      <main className={styles.page}>
         <div className={styles.fullContainer} ref={poemContentRef} >
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
                     <p>#thoughtilets</p>

                  </div>

               </article>
               <footer className={styles.footer}>
                  <Link href="/">← Back to collection</Link>

               </footer>
            </div>
            <div className={styles.line}>
               <Line />
               <div className={styles.info}>
                  <button
                     ref={button}
                     onClick={handleDownload}
                     style={{
                        border: 'none',
                        backgroundColor: 'none',
                        padding: 0
                     }}
                  >
                     <RiShareBoxLine
                        style={{
                           cursor: 'pointer',
                           fontSize: '1.4rem',
                           margin: '0em 0em 0em 1em',
                           display: 'block'
                        }}
                        title="Download as Image" />
                  </button>
                  <div
                     ref={watermark}
                     className={styles.watermark}
                     style={{ display: 'none' }}
                  >
                     thoughtilets.vercel.app
                  </div>
               </div>
            </div>
         </div>
      </main>
   )
}