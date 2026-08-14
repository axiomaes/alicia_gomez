"use client"

import { useState, useTransition } from "react"
import { contentSchema } from "@/config/contentSchema"
import { ImageUploader } from "../ui/ImageUploader"
import { RichTextEditor } from "../ui/RichTextEditor"
import { saveContentBatch } from "@/app/dashboard/content/actions"
import { CheckCircle2, Loader2, Save } from "lucide-react"

export function ContentForm({ 
  initialData, 
  lang,
  currentSection 
}: { 
  initialData: any[], 
  lang: string,
  currentSection: string
}) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    initialData.forEach(item => {
      map[item.key] = item.value
    })
    return map
  })
  
  const [isPending, startTransition] = useTransition()
  const [showToast, setShowToast] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const activeSection = contentSchema.find(s => s.id === currentSection) || contentSchema[0]

  // Prefijo de clave de contenido para la sección activa (home -> 'home', contacto -> 'contact',
  // servicio-1/2/3 -> srv1/srv2/srv3), usado solo para el mockup de "Ver Preview" de abajo.
  const previewPrefix =
    activeSection?.id === 'home' ? 'home' :
    activeSection?.id === 'contacto' ? 'contact' :
    activeSection?.id.replace('servicio-', 'srv') || ''

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const fieldTypeByKey = contentSchema
    .flatMap(section => section.fields)
    .reduce((acc, field) => { acc[field.key] = field.type; return acc }, {} as Record<string, string>)

  const handleSave = () => {
    startTransition(async () => {
      // Solo enviamos los datos de la sección actual (o todos si queremos, enviamos todos los modificados)
      const updates = Object.entries(formData).map(([key, value]) => ({ key, value, type: fieldTypeByKey[key] }))

      const res = await saveContentBatch(lang, updates)
      if (res.success) {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    })
  }

  return (
    <div className="flex flex-col relative w-full">
      {/* Main Content Area */}
      <div className="flex-1 w-full bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{activeSection?.title}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Modifica los contenidos de esta sección. Los cambios afectarán al idioma {lang.toUpperCase()}.</p>
        </div>
        
        <div className="p-6 flex-1 space-y-8">
          {activeSection?.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {field.label}
              </label>
              {field.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{field.description}</p>
              )}
              
              {field.type === 'text' && (
                <input
                  type="text"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              )}
              
              {field.type === 'textarea' && (
                <textarea
                  value={formData[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
                />
              )}
              
              {field.type === 'richtext' && (
                <RichTextEditor
                  value={formData[field.key] || ''}
                  onChange={(val) => handleFieldChange(field.key, val)}
                />
              )}
              
              {field.type === 'image' && (
                <ImageUploader 
                  value={formData[field.key] || ''} 
                  onChange={(url) => handleFieldChange(field.key, url)} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex justify-end items-center gap-4">
          
          {/* Iframe Preview Trigger (Simulated for now, could be a real iframe) */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mr-auto hidden md:block">
            Modificando: <span className="font-mono text-indigo-500">{activeSection?.id}</span>
          </div>

          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium text-sm transition-all shadow-sm"
          >
            Ver Preview
          </button>
          
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm shadow-indigo-600/20"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-3 transition-all duration-300 transform z-50 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium text-sm">Cambios guardados con éxito</span>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          <div className="relative bg-white dark:bg-zinc-950 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 transform transition-all">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-zinc-900 dark:text-white">Previsualización en vivo: {activeSection?.title}</h3>
              <button onClick={() => setShowPreview(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium text-sm px-3 py-1 bg-zinc-200/50 dark:bg-zinc-800 rounded-md">Cerrar</button>
            </div>
            
            <div className="flex-1 overflow-auto bg-zinc-100 dark:bg-black relative">
              {/* Mockup del Hero Block */}
              <div 
                className="relative w-full h-full min-h-[500px] flex flex-col justify-center items-center text-center p-8 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${formData[`${previewPrefix}.hero.image`] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80'})`
                }}
              >
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 max-w-3xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    {formData[`${previewPrefix}.hero.title`] || 'Título Principal'}
                  </h1>
                  <p className="text-xl text-zinc-200 mb-8">
                    {formData[`${previewPrefix}.hero.subtitle`] || 'Subtítulo del hero...'}
                  </p>
                  
                  {formData['home.hero.cta'] && activeSection?.id === 'home' && (
                    <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg">
                      {formData['home.hero.cta']}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
