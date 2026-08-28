"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Mismo orden que PROVIDER_PRIORITY en apps/admin/src/actions/ai.ts -- se
// guardan aquí uno por uno, no importa el orden de guardado.
const AI_PROVIDERS = ['openai', 'gemini', 'claude', 'groq']

// Antes solo se podía tener UN proveedor de IA guardado a la vez
// (UNIQUE(provider_type)); ahora cada proveedor es su propia fila
// (UNIQUE(provider_type, provider_name)) y se pueden activar varios para
// que apps/admin/src/actions/ai.ts pruebe el siguiente si el primero
// falla. El formulario manda un par apiKey_<proveedor>/isActive_<proveedor>
// por cada uno; aquí se hace un upsert en lote.
export async function saveAiIntegrations(formData: FormData) {
  const supabase = await createClient()

  const { data: existingRows } = await supabase
    .from('tenant_integrations')
    .select('provider_name, api_key')
    .eq('provider_type', 'ai_llm')

  const existingKeyByProvider = new Map((existingRows || []).map((r) => [r.provider_name, r.api_key ?? '']))

  const rows = AI_PROVIDERS.map((provider) => {
    const inputKey = ((formData.get(`apiKey_${provider}`) as string) ?? '').trim()
    // Igual que antes: el campo de clave llega vacío por diseño (nunca se
    // reenvía la clave guardada al navegador) -- si no se escribe una
    // nueva, se conserva la que ya había para ESE proveedor.
    const apiKey = inputKey || existingKeyByProvider.get(provider) || ''
    const isActive = formData.get(`isActive_${provider}`) === 'true'

    return {
      provider_type: 'ai_llm',
      provider_name: provider,
      api_key: apiKey,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    }
  })

  const { error } = await supabase
    .from('tenant_integrations')
    .upsert(rows, { onConflict: 'provider_type,provider_name' })

  if (error) {
    console.error('Error saving AI integrations:', error)
    throw new Error('No se pudieron guardar las integraciones de IA')
  }

  revalidatePath('/dashboard/integrations')
}

// El email sigue siendo un único proveedor a la vez (Brevo o Mailchimp, no
// los dos) -- resolveEmailSender() en apps/admin/src/app/dashboard/leads/actions.ts
// espera como mucho una fila provider_type='email'. Si el cliente cambia de
// proveedor, se borra la fila anterior en vez de dejarla huérfana con el
// UNIQUE(provider_type, provider_name) nuevo (antes, cambiar de proveedor
// sobreescribía la misma fila sola gracias a UNIQUE(provider_type)).
export async function saveEmailIntegration(formData: FormData) {
  const supabase = await createClient()
  const providerName = formData.get('providerName') as string
  const apiKeyInput = (formData.get('apiKey') as string) ?? ''
  const isActive = formData.get('isActive') === 'true'

  const { data: existing } = await supabase
    .from('tenant_integrations')
    .select('id, api_key, provider_name')
    .eq('provider_type', 'email')
    .maybeSingle()

  let apiKey = apiKeyInput.trim()
  if (!apiKey && existing?.provider_name === providerName) {
    apiKey = existing.api_key ?? ''
  }

  if (existing && existing.provider_name !== providerName) {
    await supabase.from('tenant_integrations').delete().eq('id', existing.id)
  }

  const { error } = await supabase
    .from('tenant_integrations')
    .upsert({
      provider_type: 'email',
      provider_name: providerName,
      api_key: apiKey,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'provider_type,provider_name' })

  if (error) {
    console.error('Error saving email integration:', error)
    throw new Error('No se pudo guardar la integración de email')
  }

  revalidatePath('/dashboard/integrations')
}
