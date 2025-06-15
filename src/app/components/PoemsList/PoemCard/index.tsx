'use client'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/all'
import { useRef } from 'react'
import Link from 'next/link'
import ScribbleHR from '@/app/components/Line/Horizontal'
import styles from './index.module.css'

gsap.registerPlugin(SplitText)

interface Poem {
   id: number
   slug: string
   title: string
   content: string
}

interface PoemCardProps {
   poem: Poem
}

export default function PoemCard({ poem }: PoemCardProps) {
   const cardRef = useRef<HTMLDivElement>(null)

   useGSAP(() => {
      const title = cardRef.current?.querySelector('h3')
      const content = cardRef.current?.querySelector('p')

      if (title) {
         gsap.from(title, {
            duration: 0.8,
            opacity: 0,
            ease: 'power1.out'
         })
      }

      if (content) {
         const split = new SplitText(content, { type: 'words' })

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
   }, { scope: cardRef })

   return (
      <div ref={cardRef}>
         <Link href={`/poems/${poem.slug}`}>
            <h3>{poem.title}</h3>
            <p>{poem.content}</p>
            <ScribbleHR />
         </Link>
      </div>
   )
}