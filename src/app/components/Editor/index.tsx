'use client'
import { useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface TiptapProps {
   content: string
   onUpdate: (html: string) => void
}

const Editor = ({content, onUpdate}: TiptapProps) => {
   const editor = useEditor({
      extensions: [StarterKit],
      content: content,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
         onUpdate(editor.getHTML())
      }
   })

   return (
      <div className='tiptap-editor'>
         <EditorContent editor={editor} />
      </div>
   )
}

export default Editor