'use client'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import PoemCard from './PoemCard'
import { useLoadingStore } from '@/app/lib/store/loadingStore'


interface Poem {
   id: number
   slug: string
   title: string
   created_at: string
   content: string
}

export default function PoemsList() {
   const [poems, setPoems] = useState<Poem[]>([])
   const { startLoading, finishLoading } = useLoadingStore()
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchPoems = async () => {
         try {
            startLoading('Fetching Poems')
            const response = await fetch('/api/poems')
            if (!response.ok) {
               throw new Error('Failed to fetch poems')
            }
            const data = await response.json()
            setPoems(data)
         } catch (err) {
            if (err instanceof Error) setError(err.message)
         } finally {
            finishLoading('Poems fetched')
         }
      }
      fetchPoems()
   }, [startLoading, finishLoading])


   if (error) {
      return <div className={styles.poemCard}><p>error...</p></div>
   }

   return (
      <div className={styles.poemList}>
         <div className={styles.poemCard}>
            {poems.map((poem) => (
               <PoemCard key={poem.id} poem={poem} />
            ))}
         </div>
      </div>
   )
}