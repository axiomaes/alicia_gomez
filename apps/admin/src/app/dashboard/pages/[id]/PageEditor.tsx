"use client"

import { useState } from 'react'
import { updatePage } from '../actions'
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

type BlockType = 'text' | 'image_text' | 'gallery' | 'contact' | 'pricing'

export function PageEditor({ initialData }: { initialData: any }) {
  const [lang, setLang] = useState<'es' | 'ca'>('es')
  const [page, setPage] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updatePage(page.id, page)
      alert("Página guardada exitosamente")
    } catch (e) {
      alert("Error al guardar la página")
    }
    setIsSaving(false)
  }

  const handleFieldChange = (field: string, value: any) => {
    setPage((prev: any) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }))
  }

  const currentContent = page.content[lang] || []

  const addBlock = (type: BlockType) => {
    const newBlock = { id: Date.now().toString(), type, data: {} }
    handleFieldChange('content', [...currentContent, newBlock])
  }

  const updateBlock = (index: number, data: any) => {
    const newContent = [...currentContent]
    newContent[index] = { ...newContent[index], data }
    handleFieldChange('content', newContent)
  }

  const removeBlock = (index: number) => {
    const newContent = [...currentContent]
    newContent.splice(index, 1)
    handleFieldChange('content', newContent)
  }

  const moveBlock = (index: number, dir: 1 | -1) => {
    if (index + dir < 0 || index + dir >= currentContent.length) return
    const newContent = [...currentContent]
    const temp = newContent[index]
    newContent[index] = newContent[index + dir]
    newContent[index + dir] = temp
    handleFieldChange('content', newContent)
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mt-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLang('es')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${lang === 'es' ? 'bg-indigo-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'}`}
          >
            Español
          </button>
          <button 
            onClick={() => setLang('ca')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${lang === 'ca' ? 'bg-indigo-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'}`}
          >
            Català
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={page.is_published}
              onChange={(e) => setPage({ ...page, is_published: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-600"
            />
            Página Pública
          </label>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Título de la Página</label>
            <input 
              type="text"
              value={page.title[lang] || ''}
              onChange={e => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Ofertas Especiales"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">URL Slug</label>
            <input 
              type="text"
              value={page.slug[lang] || ''}
              onChange={e => handleFieldChange('slug', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ej: ofertas-especiales"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descripción Meta (SEO)</label>
            <textarea 
              value={page.meta_description[lang] || ''}
              onChange={e => handleFieldChange('meta_description', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              placeholder="Breve descripción para Google..."
            />
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">Constructor de Bloques</h2>
          
          <div className="space-y-4">
            {currentContent.map((block: any, index: number) => (
              <div key={block.id} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="font-medium text-sm text-indigo-600 dark:text-indigo-400 capitalize">
                    {block.type === 'image_text' ? 'Imagen con Texto' : block.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveBlock(index, -1)} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => moveBlock(index, 1)} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"><ArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => removeBlock(index)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors ml-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Block Fields based on Type */}
                {block.type === 'text' && (
                  <textarea 
                    value={block.data.text || ''} 
                    onChange={e => updateBlock(index, { ...block.data, text: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg min-h-[120px]"
                    placeholder="Escribe el texto aquí..."
                  />
                )}
                {block.type === 'image_text' && (
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="URL de la imagen" value={block.data.imageUrl || ''} onChange={e => updateBlock(index, { ...block.data, imageUrl: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg" />
                    <textarea placeholder="Texto descriptivo" value={block.data.text || ''} onChange={e => updateBlock(index, { ...block.data, text: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg" />
                  </div>
                )}
                {block.type === 'gallery' && (
                  <div className="text-sm text-zinc-500 italic">Galería: Puedes añadir URLs de imágenes separadas por coma.</div>
                )}
                {block.type === 'contact' && (
                  <div className="text-sm text-zinc-500 italic">Se mostrará el formulario de contacto por defecto. Puedes poner un título:
                    <input type="text" placeholder="Título del formulario" value={block.data.title || ''} onChange={e => updateBlock(index, { ...block.data, title: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg mt-2" />
                  </div>
                )}
                {block.type === 'pricing' && (
                  <textarea 
                    value={block.data.pricingData || ''} 
                    onChange={e => updateBlock(index, { ...block.data, pricingData: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg min-h-[80px]"
                    placeholder="Escribe los precios separados por lineas Ej: Básico - 50€..."
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => addBlock('text')} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Texto Plano</button>
            <button onClick={() => addBlock('image_text')} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Imagen con Texto</button>
            <button onClick={() => addBlock('gallery')} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Galería</button>
            <button onClick={() => addBlock('contact')} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Formulario</button>
            <button onClick={() => addBlock('pricing')} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Precios</button>
          </div>
        </div>
      </div>
    </div>
  )
}
