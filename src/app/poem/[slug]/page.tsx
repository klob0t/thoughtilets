'use client'
import { useState, useEffect, use, useRef } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './page.module.css'
import ScribbleHR from '@/app/components/Line/Horizontal'
import Line, { } from '@/app/components/Line'
import { RiShareBoxLine } from 'react-icons/ri'
import html2canvas from 'html2canvas'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/all'
import { useLoadingStore } from '@/app/lib/store/loadingStore'

gsap.registerPlugin(SplitText)

interface Poem {
   title: string,
   content: string,
   created_at: string
}

export default function PoemsPage({ params }: { params: Promise<{ slug: string }> }) {
   const { startLoading, finishLoading } = useLoadingStore()
   const isAppLoading = useLoadingStore(state => state.activeLoaders > 0)
   const [poem, setPoem] = useState<Poem | null>(null)
   const [error, setError] = useState<string | null>(null)
   const pageRef = useRef<HTMLDivElement | null>(null)
   const poemContentRef = useRef<HTMLDivElement | null>(null)
   const watermarkRef = useRef<HTMLDivElement>(null)
   const buttonRef = useRef<HTMLButtonElement>(null)
   const footerRef = useRef<HTMLDivElement>(null)

   const { slug } = use(params)

   useEffect(() => {
      finishLoading('Initial Page Load')
   }, [finishLoading])

   useGSAP(() => {
      const page = pageRef.current

      if (!isAppLoading) {
         gsap.fromTo(page, {
            opacity: 0,
         }, {
            opacity: 1,
            duration: 1,
         })
      }
   }, { dependencies: [isAppLoading] })

   useEffect(() => {
      if (!slug) return
      const fetchPoems = async () => {
         try {
            setError(null)
            startLoading('Poem Page')
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
            finishLoading('Poem Page')
         }
      }

      if (slug) {
         fetchPoems()
      }
   }, [finishLoading, startLoading, slug])



   useGSAP(() => {
      const poem = poemContentRef.current?.querySelector('p')

      if (poem) {
         const split = new SplitText([poem], { type: 'words' })

         gsap.from(split.words, {
            duration: 0.4,
            opacity: 0,
            ease: 'power3.inOut',
            stagger: {
               each: 0.1
            },
         })
      }
   }, { scope: poemContentRef, dependencies: [poem] })

   const handleDownload = async () => {
      const element = poemContentRef.current
      const footer = footerRef.current
      const watermark = watermarkRef.current
      const button = buttonRef.current

      try {
         watermark!.style.visibility = 'visible'
         button!.style.visibility = 'hidden'
         footer!.style.visibility = 'hidden'

         const canvas = await html2canvas(element!.parentElement!, {
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
         watermark!.style.visibility = 'hidden'
         button!.style.visibility = 'visible'
         footer!.style.visibility = 'visible'
         element!.style.aspectRatio = 'unset'

         element!.style.border = 'none'
      }
   }

   if (isAppLoading) {
      return <main className={styles.container}><p>loading...</p></main>
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
      <main className={styles.page} ref={pageRef}>
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



                  </footer>
               </div>
               <div className={styles.line}>
                  <Line />
               </div>

            </div>
            <div className={styles.snapshot}>
                <button
               ref={buttonRef}
               onClick={handleDownload}
               title="Download as Image"
               style={{
                  border: 'none',
                  backgroundColor: 'var(--white)',
                  padding: 0,
                  width: '20px',
                  height: '20px',
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                  margin: '1em 0em 0em 0em'
               }}
            >

               <RiShareBoxLine
                  style={{
                     fontSize: '1rem',
                     color: 'black'
                  }}
               />
            </button>
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
      </main>
   )
}