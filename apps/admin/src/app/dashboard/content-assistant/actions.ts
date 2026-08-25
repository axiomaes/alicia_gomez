'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Slug simple y determinista a partir del título generado por la IA -- el
// usuario lo puede retocar después en la pantalla de edición normal del
// Blog/Base de Conocimiento, igual que si lo hubiera escrito a mano.
function slugify(title: string): string {
  // Quita los diacríticos (acentos) tras normalizar a NFD -- construido con
  // fromCharCode(0x0300, 0x036f) en vez de un literal para evitar cualquier
  // problema de codificación de los propios caracteres combinantes en este
  // fichero fuente.
  const diacriticsRange = String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f)
  const diacritics = new RegExp('[' + diacriticsRange + ']', 'g')
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(diacritics, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)

  return `${base || 'borrador'}-${Date.now().toString(36)}`
}

// El borrador se guarda sin publicar (is_published queda en su default
// false) y se redirige a la pantalla de edición ya existente de Blog/Base de
// Conocimiento para el pulido final -- no se construye un editor paralelo
// aquí, se reutiliza el mismo saveBlog/saveKbArticle de siempre en cuanto el
// usuario pulsa "Guardar Cambios" ahí.
export async function createDraftFromAi(
  type: 'blog' | 'kb',
  data: { title: string; excerpt: string; contentHtml: string }
) {
  const supabase = await createClient()
  const table = type === 'blog' ? 'blogs' : 'knowledge_base_articles'

  const { data: row, error } = await supabase
    .from(table)
    .insert([{
      title: data.title,
      slug: slugify(data.title),
      excerpt: data.excerpt,
      content: data.contentHtml,
    }])
    .select('id')
    .single()

  if (error || !row) {
    throw new Error(error?.message || 'No se pudo guardar el borrador.')
  }

  redirect(type === 'blog' ? `/dashboard/blogs/edit/${row.id}` : `/dashboard/knowledge-base/edit/${row.id}`)
}
