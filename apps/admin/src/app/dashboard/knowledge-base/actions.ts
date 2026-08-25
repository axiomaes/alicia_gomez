'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

// Calco de apps/admin/src/app/dashboard/blogs/actions.ts -- mismo shape de
// tabla (knowledge_base_articles), mismo saneado antes de guardar porque
// apps/web/.../base-de-conocimiento/[slug].astro lo renderiza con set:html
// igual que el Blog.
export async function saveKbArticle(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string | null
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const is_published = formData.get('is_published') === 'on'

  const articleData: any = {
    title,
    slug,
    excerpt,
    content: sanitizeHtml(content),
    is_published,
    updated_at: new Date().toISOString()
  }

  if (is_published) {
    articleData.published_at = new Date().toISOString()
  }

  if (id) {
    await supabase.from('knowledge_base_articles').update(articleData).eq('id', id)
  } else {
    await supabase.from('knowledge_base_articles').insert([articleData])
  }

  revalidatePath('/dashboard/knowledge-base')
  redirect('/dashboard/knowledge-base')
}

export async function deleteKbArticle(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  await supabase.from('knowledge_base_articles').delete().eq('id', id)
  revalidatePath('/dashboard/knowledge-base')
}
