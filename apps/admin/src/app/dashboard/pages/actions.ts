'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPage() {
  const supabase = await createClient()

  const { count } = await supabase.from('pages').select('id', { count: 'exact', head: true })
  
  if (count !== null && count >= 5) {
    throw new Error("Límite de 5 páginas alcanzado.")
  }

  // Create empty page
  const { data, error } = await supabase.from('pages').insert({
    slug: { es: `nueva-pagina-${Date.now()}`, ca: `nova-pagina-${Date.now()}` },
    title: { es: "Nueva Página", ca: "Nova Pàgina" },
    meta_description: { es: "", ca: "" },
    content: { es: [], ca: [] },
    is_published: false,
    menu_order: count || 0
  }).select().single()

  if (error) {
    console.error("Error creating page:", error)
    throw error
  }

  revalidatePath('/dashboard/pages')
  redirect(`/dashboard/pages/${data.id}`)
}

export async function updatePageOrder(updates: { id: string, menu_order: number }[]) {
  const supabase = await createClient()

  for (const update of updates) {
    await supabase.from('pages').update({ menu_order: update.menu_order }).eq('id', update.id)
  }

  revalidatePath('/dashboard/pages')
  // We should also revalidate the frontend cache if possible, but for now revalidating this route is enough
}

export async function deletePage(id: string) {
  const supabase = await createClient()
  await supabase.from('pages').delete().eq('id', id)
  revalidatePath('/dashboard/pages')
}

export async function updatePage(id: string, payload: any) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('pages')
    .update({
      title: payload.title,
      slug: payload.slug,
      meta_description: payload.meta_description,
      content: payload.content,
      is_published: payload.is_published
    })
    .eq('id', id)

  if (error) {
    console.error("Error updating page:", error)
    throw error
  }

  revalidatePath('/dashboard/pages')
  revalidatePath(`/dashboard/pages/${id}`)
}

