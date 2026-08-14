import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getContent(lang: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('content')
    .select('key, value')
    .eq('lang', lang)

  if (error || !data) {
    console.error('Error fetching content:', error)
    return {}
  }

  // Convert array of {key, value} to a dictionary object
  return data.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, string>)
}

export async function getTenantSettings() {
  const { data, error } = await supabase
    .from('tenant_settings')
    .select('*')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching tenant settings:', error)
  }

  return data || null
}
