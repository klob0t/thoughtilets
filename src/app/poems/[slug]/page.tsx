'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './page.module.css'

interface Poem {
   title: string,
   content: string,
   created_at: string
}


export default function PoemsPage({ params }: { params: Promise<{ slug: string }> }) {
   const [poem, setPoem] = useState<Poem | null>(null)
   const [error, setError] = useState<string | null>(null)
   const [isLoading, setIsLoading] = useState(true)

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

   if (isLoading) {
      return <main className={styles.container}><p>Loading poem...</p></main>;
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
      <main className={styles.container}>
            <header className={styles.header}>
                <h1>{poem?.title}</h1>
                <p>Published on {new Date(poem?.created_at).toLocaleDateString()}</p>
            </header>
            <article className={styles.content}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {poem?.content}
                </ReactMarkdown>
            </article>
            <footer className={styles.footer}>
                <Link href="/">← Back to collection</Link>
            </footer>
        </main>
   )
}