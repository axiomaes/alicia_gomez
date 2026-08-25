"use client"

import { useState } from 'react'

interface ProviderOption {
  id: string
  label: string
  badge?: string
}

interface ProviderRadioGroupProps {
  name: string
  options: ProviderOption[]
  defaultValue: string
  /** Clases de Tailwind completas (no interpoladas) para la opción activa -- se pasan
      literales desde el padre para que el JIT de Tailwind las detecte. */
  activeClassName: string
}

// El resaltado de la opción elegida no puede depender del valor que llegó
// del servidor en el primer render (aiIntegration.provider_name) -- ese
// valor no cambia al hacer clic, así que el borde se quedaba "pegado" en la
// opción guardada aunque el radio interno sí cambiara de verdad. Se
// necesita estado de cliente para que el resaltado siga al clic.
export function ProviderRadioGroup({ name, options, defaultValue, activeClassName }: ProviderRadioGroupProps) {
  const [selected, setSelected] = useState(defaultValue)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {options.map(({ id, label, badge }) => {
        const active = selected === id
        return (
          <label
            key={id}
            className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${
              active ? activeClassName : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={id}
              checked={active}
              onChange={() => setSelected(id)}
              className="sr-only"
            />
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className="block text-sm font-medium text-zinc-900 dark:text-white">{label}</span>
                {badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mt-0.5">{badge}</span>
                )}
              </span>
            </span>
          </label>
        )
      })}
    </div>
  )
}
