'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tenant_settings')
    .select('*')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching settings:", error)
    return null
  }

  return data
}

export async function updateSettings(id: string | null, payload: any) {
  const supabase = await createClient()
  
  if (id) {
    const { error } = await supabase
      .from('tenant_settings')
      .update({
        tenant_name: payload.tenant_name,
        primary_color: payload.primary_color,
        accent_color: payload.accent_color,
        font_family: payload.font_family,
        logo_url: payload.logo_url,
        favicon_url: payload.favicon_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  } else {
    // If no row exists, insert one
    const { error } = await supabase
      .from('tenant_settings')
      .insert({
        tenant_name: payload.tenant_name,
        primary_color: payload.primary_color,
        accent_color: payload.accent_color,
        font_family: payload.font_family,
        logo_url: payload.logo_url,
        favicon_url: payload.favicon_url
      })

    if (error) throw error
  }

  revalidatePath('/dashboard/settings')
  // We cannot trigger a revalidate on the Astro site from here unless we call a webhook, 
  // but Astro SSR will fetch fresh data on next reload.
}
