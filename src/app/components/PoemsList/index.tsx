'use client'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import PoemCard from './PoemCard'


interface Poem {
   id: number
   slug: string
   title: string
   created_at: string
   content: string
}

export default function PoemsList() {
   const [poems, setPoems] = useState<Poem[]>([])
   const [isLoading, setIsLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchPoems = async () => {
         try {
            const response = await fetch('/api/poems')
            if (!response.ok) {
               throw new Error('Failed to fetch poems')
            }
            const data = await response.json()
            setPoems(data)
         } catch (err: any) {
            setError(err.message)
         } finally {
            setIsLoading(false)
         }
      }
      fetchPoems()
   }, [])

   if (isLoading) {
      return <div className={styles.poemCard}><p>loading...</p></div>
   }

   if (error) {
      return <div className={styles.poemCard}><p>error...</p></div>
   }

   return (
      <div className={styles.poemCard}>
         {poems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} />
         ))}
      </div>
   )
}