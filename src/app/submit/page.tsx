'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TurndownService from 'turndown';
import styles from './page.module.css'
import RichTextEditor from '@/app/components/Editor';

export default function SubmitPage() {
   const [title, setTitle] = useState('');
   const [slug, setSlug] = useState('');
   const [editorHtml, setEditorHtml] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   useEffect(() => {
      const generateSlug = (title: string) => {
         return title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
      }
      setSlug(generateSlug(title))
   },[title])

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);

      const turndownService = new TurndownService();
      turndownService.addRule('brToNewline', {
         filter: 'br',
         replacement: () => '  \n'
      });
      const markdownContent = turndownService.turndown(editorHtml);

      try {
         const response = await fetch('/api/poems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, slug, content: markdownContent }),
         });

         if (!response.ok) throw new Error('Failed to submit poem');
         router.push('/');

      } catch (error) {
         console.error(error);
         alert('Something went wrong!');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <main className={styles.main}>
         <h1>new poem</h1>
         <form onSubmit={handleSubmit}>
            <div className={styles.input}>
               <label htmlFor="title">title</label><br />
               <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
               />
            </div>
            <div className={styles.input}>
               <label style={{ display: 'block', marginBottom: '0.5rem' }}>content</label>
               <RichTextEditor
                  content="<p>...</p>"
                  onUpdate={setEditorHtml}
               />
            </div>
            <div className={styles.button}>
               <button type="submit" disabled={isLoading} style={{ padding: '10px 15px' }}>
                  {isLoading ? 'posting...' : 'post'}
               </button>
            </div>
         </form>
      </main>
   );
}