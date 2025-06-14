// src/app/components/RichTextEditor/index.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import * as Toolbar from '@radix-ui/react-toolbar';
import {
  LuStrikethrough,
  LuBold,
  LuItalic,
  LuList,
  LuListOrdered,
  LuHeading1,
  LuHeading2,
  LuHeading3,
} from 'react-icons/lu';
import styles from './index.module.css';

interface RichTextEditorProps {
  content: string;
  onUpdate: (html: string) => void;
}

const RichTextEditor = ({ content, onUpdate }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editorWrapper}>
      <Toolbar.Root className={styles.toolbar} aria-label="Formatting options">
        {/* Bold Button */}
        <Toolbar.Button
          className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.isActive : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <LuBold className="h-4 w-4" />
        </Toolbar.Button>

        {/* Italic Button */}
        <Toolbar.Button
          className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.isActive : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <LuItalic className="h-4 w-4" />
        </Toolbar.Button>
        
        {/* Strikethrough Button */}
        <Toolbar.Button
          className={`${styles.toolbarButton} ${editor.isActive('strike') ? styles.isActive : ''}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <LuStrikethrough className="h-4 w-4" />
        </Toolbar.Button>
        
        <Toolbar.Separator className={styles.separator} />

        {/* Heading 1 */}
        <Toolbar.Button
          className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <LuHeading1 className="h-4 w-4" />
        </Toolbar.Button>

        {/* Heading 2 */}
        <Toolbar.Button
          className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <LuHeading2 className="h-4 w-4" />
        </Toolbar.Button>

        {/* Heading 3 */}
        <Toolbar.Button
          className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 3 }) ? styles.isActive : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <LuHeading3 className="h-4 w-4" />
        </Toolbar.Button>
        
        <Toolbar.Separator className={styles.separator} />

        {/* Bullet List */}
        <Toolbar.Button
          className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.isActive : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <LuList className="h-4 w-4" />
        </Toolbar.Button>

        {/* Ordered List */}
        <Toolbar.Button
          className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.isActive : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <LuListOrdered className="h-4 w-4" />
        </Toolbar.Button>
      </Toolbar.Root>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;