import { saveBlog } from '../actions'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewBlogPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/blogs" className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Nuevo Artículo</h1>
            <p className="text-zinc-400 mt-1">Escribe una nueva entrada para tu blog.</p>
          </div>
        </div>
      </div>

      <form action={saveBlog} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Título</label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder="El título de tu artículo..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg font-medium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Slug (URL)</label>
            <input 
              type="text" 
              name="slug" 
              required
              placeholder="ejemplo: mi-primer-articulo"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Resumen (Extracto)</label>
            <textarea 
              name="excerpt" 
              rows={2}
              placeholder="Una breve descripción para mostrar en la lista de artículos..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Contenido Principal (Soporta Markdown/HTML)</label>
            <textarea 
              name="content" 
              rows={12}
              required
              placeholder="Escribe el contenido completo aquí..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-3 py-2 border-t border-zinc-800/50 mt-4 pt-6">
            <input 
              type="checkbox" 
              id="is_published" 
              name="is_published"
              className="w-5 h-5 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-zinc-900"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-zinc-200">
              Publicar inmediatamente
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20">
            <Save className="w-5 h-5" />
            Guardar Artículo
          </button>
        </div>
      </form>
    </div>
  )
}
