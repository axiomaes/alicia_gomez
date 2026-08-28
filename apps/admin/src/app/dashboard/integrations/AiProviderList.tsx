"use client"

import { useState } from 'react'

interface AiProviderListProps {
  integrations: {
    provider_name: string
    api_key: string | null
    is_active: boolean
    base_url?: string | null
    model_override?: string | null
  }[]
}

// No hay fallback automático (ver plan de implementación del 25/08/2026: el
// cliente decide qué IA usa, nunca el sistema por él) -- Alicia usa
// Prudencia.ai, una IA jurídica especializada, y le importa CUÁL responde,
// no solo que "alguna" lo haga.
const AI_PROVIDERS = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'claude', label: 'Claude' },
  { id: 'groq', label: 'Groq', badge: 'Capa gratuita' },
  { id: 'prudencia', label: 'Prudencia', badge: 'IA jurídica', needsEndpoint: true },
]

// El cliente puede guardar la clave de varios proveedores a la vez (para
// cambiar rápido si al que usa se le acaban los tokens, sin tener que
// volver a pegar la clave), pero elige a mano cuál está "en uso" -- de ahí
// el radio "En uso" en vez de un checkbox "Activo" independiente por
// tarjeta. Ver actions.ts (saveAiIntegrations).
export function AiProviderList({ integrations }: AiProviderListProps) {
  const byProvider = new Map(integrations.map((i) => [i.provider_name, i]))
  const currentlyActive = integrations.find((i) => i.is_active)?.provider_name
  const [selected, setSelected] = useState(currentlyActive || '')

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Puedes guardar la clave de varios proveedores, pero solo uno está en uso a la vez. Si al que usas se le acaban
        los créditos, marca otro aquí y guarda -- no hace falta volver a pegar su clave si ya la tenías guardada.
      </p>

      {AI_PROVIDERS.map((p) => {
        const existing = byProvider.get(p.id)
        const isSelected = selected === p.id
        return (
          <div
            key={p.id}
            className={`rounded-xl border p-4 transition-colors ${
              isSelected ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="activeProvider"
                  value={p.id}
                  checked={isSelected}
                  onChange={() => setSelected(p.id)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">{p.label}</span>
                {p.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">{p.badge}</span>
                )}
                {isSelected && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">En uso</span>
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
            {p.needsEndpoint && (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Prudencia no publica documentación técnica pública -- si te han dado una URL/modelo específico al darte de alta, ponlos aquí.
                </p>
                <input
                  type="text"
                  name={`baseUrl_${p.id}`}
                  defaultValue={existing?.base_url || ''}
                  placeholder="URL de la API (ej: https://api.prudencia.ai/v1)"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name={`modelOverride_${p.id}`}
                  defaultValue={existing?.model_override || ''}
                  placeholder="Modelo (opcional)"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
