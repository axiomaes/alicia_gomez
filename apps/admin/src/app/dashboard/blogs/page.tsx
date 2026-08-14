import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'

export default async function BlogsPage() {
  const supabase = await createClient()
  const { data: blogs } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Artículos del Blog</h1>
          <p className="text-zinc-400 mt-2">Gestiona el contenido de tu blog.</p>
        </div>
        <Link 
          href="/dashboard/blogs/new" 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Nuevo Artículo
        </Link>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden">
        {blogs?.length ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-4 text-sm font-semibold text-zinc-300">Título</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-300">Estado</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-300">Fecha</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-300 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-zinc-200 font-medium">{blog.title}</p>
                    <p className="text-zinc-500 text-sm">/{blog.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${blog.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'}`}>
                      {blog.is_published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <button className="text-zinc-500 hover:text-white transition-colors" title="Ver">
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link href={`/dashboard/blogs/edit/${blog.id}`} className="text-zinc-500 hover:text-indigo-400 transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button className="text-zinc-500 hover:text-red-400 transition-colors" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-zinc-500">
            No has creado ningún artículo todavía.
          </div>
        )}
      </div>
    </div>
  )
}
