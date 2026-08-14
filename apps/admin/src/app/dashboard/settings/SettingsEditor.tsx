"use client"

import { useState } from 'react'
import { updateSettings } from './actions'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { Save } from 'lucide-react'

export function SettingsEditor({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState({
    tenant_name: initialSettings?.tenant_name || 'Axioma Starter',
    primary_color: initialSettings?.primary_color || '#0C4DA2',
    accent_color: initialSettings?.accent_color || '#ED1C24',
    font_family: initialSettings?.font_family || 'inter',
    logo_url: initialSettings?.logo_url || '',
    favicon_url: initialSettings?.favicon_url || '',
  })
  
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings(initialSettings?.id || null, settings)
      alert("Configuración guardada exitosamente.")
    } catch (error) {
      console.error(error)
      alert("Error al guardar la configuración.")
    }
    setIsSaving(false)
  }

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mt-6">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <h2 className="font-semibold text-lg">Apariencia Global</h2>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre del Proyecto (Tenant)</label>
            <input 
              type="text"
              value={settings.tenant_name}
              onChange={e => handleChange('tenant_name', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Clínica López"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Color Primario</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color"
                  value={settings.primary_color}
                  onChange={e => handleChange('primary_color', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text"
                  value={settings.primary_color}
                  onChange={e => handleChange('primary_color', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Color Secundario (Acento)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color"
                  value={settings.accent_color}
                  onChange={e => handleChange('accent_color', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text"
                  value={settings.accent_color}
                  onChange={e => handleChange('accent_color', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tipografía Global</label>
            <select
              value={settings.font_family}
              onChange={e => handleChange('font_family', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="inter">Inter (Moderna, Limpia)</option>
              <option value="poppins">Poppins (Redondeada, Amigable)</option>
              <option value="montserrat">Montserrat (Geométrica, Elegante)</option>
              <option value="exo2">Exo 2 (Tecnológica, Dinámica)</option>
              <option value="merriweather">Merriweather (Clásica, Serif)</option>
            </select>
          </div>
        </div>

        {/* Branding Assets */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Logo Principal</label>
            <p className="text-xs text-zinc-500 mb-2">Recomendado: SVG o PNG con fondo transparente.</p>
            <ImageUploader 
              value={settings.logo_url}
              onChange={(url) => handleChange('logo_url', url)}
            />
          </div>

          <div className="space-y-1.5 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Favicon</label>
            <p className="text-xs text-zinc-500 mb-2">Icono para la pestaña del navegador (Formato cuadrado .png, .svg, o .ico).</p>
            <ImageUploader 
              value={settings.favicon_url}
              onChange={(url) => handleChange('favicon_url', url)}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
