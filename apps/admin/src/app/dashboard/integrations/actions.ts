"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveIntegration(formData: FormData) {
  const supabase = await createClient()
  const providerType = formData.get('providerType') as string
  const providerName = formData.get('providerName') as string
  const apiKeyInput = (formData.get('apiKey') as string) ?? ''
  const isActive = formData.get('isActive') === 'true'

  // El input de clave llega vacío por diseño (nunca reenviamos la clave guardada
  // al navegador, ver page.tsx). Si el usuario no escribe nada nueva Y el proveedor
  // no ha cambiado, conservamos la clave que ya había en vez de sobreescribirla con
  // una cadena vacía. Si cambia de proveedor (p. ej. openai -> gemini) sin escribir
  // clave nueva, no arrastramos la clave del proveedor anterior: mejor forzar que la
  // introduzca de nuevo que guardar una clave de OpenAI como si fuera de Gemini.
  let apiKey = apiKeyInput.trim()
  if (!apiKey) {
    const { data: existing } = await supabase
      .from('tenant_integrations')
      .select('api_key, provider_name')
      .eq('provider_type', providerType)
      .single()
    apiKey = existing?.provider_name === providerName ? (existing.api_key ?? '') : ''
  }

  // Upsert the integration
  const { error } = await supabase
    .from('tenant_integrations')
    .upsert({
      provider_type: providerType,
      provider_name: providerName,
      api_key: apiKey,
      is_active: isActive,
      updated_at: new Date().toISOString()
    }, { onConflict: 'provider_type' })

  if (error) {
    console.error('Error saving integration:', error)
    throw new Error('No se pudo guardar la integración')
  }

  revalidatePath('/dashboard/integrations')
}
