"use client"

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { TablerIcon } from './TablerIcon'

interface IconPickerProps {
  value: string
  onChange: (name: string) => void
}

// Selección curada, no la librería entera de Tabler (~5900 iconos) -- para
// un usuario no técnico, mostrar todo sería peor que el campo de texto que
// sustituye. Cubre los temas de un despacho/servicio profesional (legal,
// negocio, confianza, contacto, tiempo). Si hace falta un icono fuera de
// esta lista, el campo "o escribe el nombre exacto" de abajo sigue
// aceptando cualquier nombre válido de Tabler como antes.
const CURATED_ICONS = [
  'Gavel', 'Scale', 'Certificate', 'License', 'FileText', 'FileCheck', 'FileDescription',
  'ClipboardText', 'ClipboardCheck', 'Report', 'Notebook',
  'BuildingBank', 'Building', 'Home', 'Briefcase', 'Users', 'UserCheck',
  'Shield', 'ShieldCheck', 'Lock', 'Key',
  'Clock', 'Calendar', 'Bolt', 'Headset', 'MessageCircle', 'Phone', 'Mail', 'MapPin', 'Video', 'Globe',
  'Star', 'Award', 'ThumbUp', 'Heart', 'TrendingUp', 'ChartBar', 'Coin', 'CreditCard',
  'DeviceLaptop', 'Language', 'Brain', 'Search',
]

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0">
          {value ? <TablerIcon name={value} size={20} /> : <span className="text-xs text-zinc-400">?</span>}
        </span>
        <span className="flex-1 text-left text-sm">
          {value || 'Elegir un icono...'}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Elige un icono</p>
            <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {CURATED_ICONS.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setIsOpen(false) }}
                className={`flex items-center justify-center aspect-square rounded-lg border transition-colors ${
                  value === name
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <TablerIcon name={name} size={20} />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1.5">
              ¿No está el que buscas? Escribe el nombre exacto (Tabler Icons):
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ej: Certificate"
              className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
