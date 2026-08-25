import { createClient } from '@/utils/supabase/server'
import { saveIntegration } from './actions'
import { Lock, Cpu, Mail } from 'lucide-react'
import { ProviderRadioGroup } from './ProviderRadioGroup'

export default async function IntegrationsPage() {
  const supabase = await createClient()

  // Get tenant plan
  const { data: tenant } = await supabase
    .from('tenant_settings')
    .select('subscription_plan')
    .limit(1)
    .single()

  const isPro = tenant?.subscription_plan === 'pro' || tenant?.subscription_plan === 'enterprise'

  // Get integrations
  const { data: integrations } = await supabase
    .from('tenant_integrations')
    .select('*')

  const aiIntegration = integrations?.find(i => i.provider_type === 'ai_llm') || { provider_name: 'openai', api_key: '', is_active: false }
  const emailIntegration = integrations?.find(i => i.provider_type === 'email') || { provider_name: 'brevo', api_key: '', is_active: false }

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">Integraciones y APIs</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Configura los proveedores de Inteligencia Artificial y Correo Electrónico. Elige tu proveedor favorito e introduce tu clave API para habilitar las funciones en el panel.
        </p>
      </div>

      <div className="grid gap-8">
        
        {/* IA INTEGRATION */}
        <section className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
          {!isPro && (
            <div className="absolute inset-0 bg-zinc-900/10 dark:bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
              <Lock className="w-12 h-12 text-zinc-700 dark:text-zinc-300 mb-4" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Funcionalidad Pro</h3>
              <p className="text-zinc-700 dark:text-zinc-300 mt-2 max-w-sm text-center">
                El Módulo Experto IA solo está disponible en el Plan Pro y Enterprise.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Inteligencia Artificial (LLMs)</h2>
              <p className="text-sm text-zinc-500">Asistente de redacción y análisis automático de leads.</p>
            </div>
          </div>

          <form action={async (formData) => {
            "use server"
            formData.append('providerType', 'ai_llm')
            await saveIntegration(formData)
          }} className="space-y-6 max-w-2xl">
            
            <ProviderRadioGroup
              name="providerName"
              defaultValue={aiIntegration.provider_name}
              activeClassName="border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10"
              options={[
                { id: 'openai', label: 'OpenAI' },
                { id: 'gemini', label: 'Gemini' },
                { id: 'claude', label: 'Claude' },
                { id: 'groq', label: 'Groq', badge: 'Capa gratuita' },
              ]}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">API Key</label>
              <input
                type="password"
                name="apiKey"
                autoComplete="off"
                placeholder={aiIntegration.api_key ? '•••••••••••••••• (clave guardada — escribe para reemplazarla)' : 'sk-...'}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-zinc-500">Por seguridad, la clave guardada nunca se muestra. Deja este campo vacío para conservarla o escribe una nueva para sustituirla.</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isActive" value="true" defaultChecked={aiIntegration.is_active} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-zinc-900 dark:text-zinc-300">Habilitar IA en el Panel</span>
              </label>
            </div>

            <button type="submit" disabled={!isPro} className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
              Guardar Configuración IA
            </button>
          </form>
        </section>

        {/* EMAIL INTEGRATION */}
        <section className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Proveedor de Email</h2>
              <p className="text-sm text-zinc-500">Envío de respuestas a leads desde el CRM.</p>
            </div>
          </div>

          <form action={async (formData) => {
            "use server"
            formData.append('providerType', 'email')
            await saveIntegration(formData)
          }} className="space-y-6 max-w-2xl">
            
            <ProviderRadioGroup
              name="providerName"
              defaultValue={emailIntegration.provider_name}
              activeClassName="border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10"
              options={[
                { id: 'brevo', label: 'Brevo' },
                { id: 'mailchimp', label: 'Mailchimp' },
              ]}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">API Key</label>
              <input
                type="password"
                name="apiKey"
                autoComplete="off"
                placeholder={emailIntegration.api_key ? '•••••••••••••••• (clave guardada — escribe para reemplazarla)' : 'v3-...'}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-zinc-500">Por seguridad, la clave guardada nunca se muestra. Deja este campo vacío para conservarla o escribe una nueva para sustituirla.</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isActive" value="true" defaultChecked={emailIntegration.is_active} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-600"></div>
                <span className="ml-3 text-sm font-medium text-zinc-900 dark:text-zinc-300">Habilitar envíos desde el CRM</span>
              </label>
            </div>

            <button type="submit" className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
              Guardar Configuración Email
            </button>
          </form>
        </section>

      </div>
    </div>
  )
}
