'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

export async function saveBlog(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string | null
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const is_published = formData.get('is_published') === 'on'

  const blogData: any = {
    title,
    slug,
    excerpt,
    // blog/[slug].astro lo renderiza con set:html — igual que RichTextBlock,
    // se sanea aquí antes de guardar, no confiando en que el editor ya lo hizo.
    content: sanitizeHtml(content),
    is_published,
    updated_at: new Date().toISOString()
  }

  if (is_published) {
    blogData.published_at = new Date().toISOString()
  }

  if (id) {
    await supabase.from('blogs').update(blogData).eq('id', id)
  } else {
    await supabase.from('blogs').insert([blogData])
  }

  revalidatePath('/dashboard/blogs')
  redirect('/dashboard/blogs')
}
