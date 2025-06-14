'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TurndownService from 'turndown'
import Editor from '@/app/components/Editor'

export default function SubmitPage() {
   const [title, setTitle] = useState('')
   const [slug, setSlug] = useState('')
   const [editorHtml, setEditorHtml] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const router = useRouter()

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsLoading(true)

      const turndownService = new TurndownService()

      turndownService.addRule('brToNewLine', {
         filter: 'br',
         replacement: () => ' \n'
      })

      const markdownContent = turndownService.turndown(editorHtml)

      try {
         const response = await fetch('/api/poems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, slug, content: markdownContent })
         })

         if (!response.ok) throw new Error('Failed to submit poem')
         router.push('/')
      } catch (error) {
         console.error(error)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <main>
         <h1>new poem</h1>
         <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
               <label htmlFor='title'>title</label><br />
               <input
                  id='title'
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px' }}
               />
            </div>
            <div style={{ marginBottom: '1rem' }}>
               <label htmlFor='slug'>url</label><br />
               <input
                  id='slug'
                  type='text'
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px' }}
               />
               <div style={{ marginBottom: '1.5rem' }}>
                  <label>content</label><br />
                  <Editor
                     content='<p>write poem here...</p>'
                     onUpdate={setEditorHtml}
                  />
               </div>
               <div>
                  <button type='submit' disabled={isLoading} style={{ padding: '10px 15px'}}>
                     {isLoading? 'submitting...' : 'submit'}
                  </button>
               </div>
            </div>
         </form>
      </main>
   )
}