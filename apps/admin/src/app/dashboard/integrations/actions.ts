"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Mismo orden que en AiProviderList.tsx. Prudencia además de clave necesita
// URL/modelo (no tiene endpoint fijo conocido, a diferencia de los otros
// cuatro) -- ver apps/admin/src/actions/ai.ts (getAiModel).
const AI_PROVIDERS = ['openai', 'gemini', 'claude', 'groq', 'prudencia']

// El cliente puede guardar la clave de varios proveedores a la vez (cada
// uno su propia fila, UNIQUE(provider_type, provider_name)), pero elige a
// mano cuál está "en uso" -- nunca automático (ver plan de implementación
// del 25/08/2026: Alicia usa Prudencia.ai, una IA jurídica especializada,
// y le importa cuál responde). El formulario manda un campo
// apiKey_<proveedor> por cada tarjeta y un único radio "activeProvider"
// con el elegido; aquí se hace un upsert en lote marcando is_active=true
// solo en ese, false en el resto.
export async function saveAiIntegrations(formData: FormData) {
  const supabase = await createClient()

  const { data: existingRows } = await supabase
    .from('tenant_integrations')
    .select('provider_name, api_key')
    .eq('provider_type', 'ai_llm')

  const existingKeyByProvider = new Map((existingRows || []).map((r) => [r.provider_name, r.api_key ?? '']))
  const activeProvider = formData.get('activeProvider') as string | null

  const rows = AI_PROVIDERS.map((provider) => {
    const inputKey = ((formData.get(`apiKey_${provider}`) as string) ?? '').trim()
    // Igual que antes: el campo de clave llega vacío por diseño (nunca se
    // reenvía la clave guardada al navegador) -- si no se escribe una
    // nueva, se conserva la que ya había para ESE proveedor.
    const apiKey = inputKey || existingKeyByProvider.get(provider) || ''

    const row: Record<string, unknown> = {
      provider_type: 'ai_llm',
      provider_name: provider,
      api_key: apiKey,
      is_active: provider === activeProvider,
      updated_at: new Date().toISOString(),
    }

    if (provider === 'prudencia') {
      row.base_url = ((formData.get(`baseUrl_${provider}`) as string) ?? '').trim() || null
      row.model_override = ((formData.get(`modelOverride_${provider}`) as string) ?? '').trim() || null
    }

    return row
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
