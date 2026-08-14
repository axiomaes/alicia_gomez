"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { improveTextWithAi } from '@/actions/ai'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[150px] px-4 py-3',
      },
    },
  })

  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiMenuOpen, setAiMenuOpen] = useState(false)

  const handleAiAction = async (instruction: string) => {
    if (!editor) return
    setIsAiLoading(true)
    setAiMenuOpen(false)
    const currentHtml = editor.getHTML()
    const result = await improveTextWithAi(currentHtml, instruction)
    
    if (result.success && result.html) {
      editor.commands.setContent(result.html)
    } else if (result.error) {
      alert("Error de IA: " + result.error)
    }
    setIsAiLoading(false)
  }

  if (!editor) {
    return null
  }

  return (
    <div className="w-full rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 relative">
        
        {/* Magic AI Button */}
        <div className="relative">
          <button
            onClick={(e) => { e.preventDefault(); setAiMenuOpen(!aiMenuOpen) }}
            disabled={isAiLoading}
            className="p-1.5 rounded-md text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center justify-center disabled:opacity-50"
            title="Mejorar con IA"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
          
          {aiMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl overflow-hidden z-50 py-1">
              <button onClick={(e) => { e.preventDefault(); handleAiAction('improve') }} className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">✨ Mejorar redacción</button>
              <button onClick={(e) => { e.preventDefault(); handleAiAction('fix') }} className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">📝 Corregir ortografía</button>
              <button onClick={(e) => { e.preventDefault(); handleAiAction('seo') }} className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">🚀 Optimizar para SEO</button>
            </div>
          )}
        </div>
        
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('bold') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('italic') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run() }}
          className={`p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
          title="Título 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
          className={`p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
          title="Título 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
          className={`p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
          title="Lista"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
          className={`p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('orderedList') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
          title="Lista Numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      
      <div className="bg-zinc-50 dark:bg-zinc-950/50">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
