"use client"

import { useState } from 'react'

interface AiProviderListProps {
  integrations: { provider_name: string; api_key: string | null; is_active: boolean }[]
}

// Mismo orden que PROVIDER_PRIORITY en apps/admin/src/actions/ai.ts -- se
// usa tanto para el orden en que se muestran las tarjetas como para el
// orden real de fallback si uno falla.
const AI_PROVIDERS = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'claude', label: 'Claude' },
  { id: 'groq', label: 'Groq', badge: 'Capa gratuita' },
]

// Sustituye al ProviderRadioGroup de selección única para IA -- ahora se
// pueden activar varios proveedores a la vez, cada uno con su propia
// clave, para que haya un respaldo si al que se está usando se le acaban
// los tokens. Un solo <form> envía todo junto (apiKey_<id>/isActive_<id>
// por cada proveedor); ver actions.ts (saveAiIntegrations).
export function AiProviderList({ integrations }: AiProviderListProps) {
  const byProvider = new Map(integrations.map((i) => [i.provider_name, i]))
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(AI_PROVIDERS.map((p) => [p.id, byProvider.get(p.id)?.is_active ?? false]))
  )

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Activa uno o varios. Si el que se está usando falla (sin créditos, error, lo que sea), se prueba automáticamente
        el siguiente que tengas activo, en este orden: {AI_PROVIDERS.map((p) => p.label).join(' → ')}.
      </p>

      {AI_PROVIDERS.map((p) => {
        const existing = byProvider.get(p.id)
        const isActive = active[p.id]
        return (
          <div
            key={p.id}
            className={`rounded-xl border p-4 transition-colors ${
              isActive ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name={`isActive_${p.id}`}
                  value="true"
                  checked={isActive}
                  onChange={(e) => setActive((prev) => ({ ...prev, [p.id]: e.target.checked }))}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">{p.label}</span>
                {p.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{p.badge}</span>
                )}
              </label>
            </div>
            <input
              type="password"
              name={`apiKey_${p.id}`}
              autoComplete="off"
              placeholder={existing?.api_key ? '•••••••••••••••• (clave guardada — escribe para reemplazarla)' : 'Pega aquí la clave...'}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )
      })}
    </div>
  )
}
