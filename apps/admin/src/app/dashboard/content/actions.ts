'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

export async function saveContentBatch(
  lang: string,
  updates: { key: string; value: string; type?: string; isNew?: boolean }[]
) {
  const supabase = await createClient()

  // Find which ones need to be inserted vs updated
  const { data: existingRecords } = await supabase
    .from('content')
    .select('id, key')
    .eq('lang', lang)

  const existingKeys = new Map(existingRecords?.map(r => [r.key, r.id]) || [])

  for (const update of updates) {
    // Los campos 'richtext' se renderizan en la web con dangerouslySetInnerHTML
    // (RichTextBlock): siempre se sanean en servidor antes de guardarse, sin
    // confiar en que el editor del navegador ya lo haya hecho.
    const value = update.type === 'richtext' ? sanitizeHtml(update.value) : update.value

    if (existingKeys.has(update.key)) {
      // Update existing
      await supabase
        .from('content')
        .update({ value })
        .eq('id', existingKeys.get(update.key))
    } else {
      // Insert new
      await supabase
        .from('content')
        .insert([{ lang, key: update.key, value }])
    }
  }

  revalidatePath('/dashboard/content')
  revalidatePath('/[lang]', 'layout') // revalidate the main site if they share cache (they don't, but good practice)
  return { success: true }
}
