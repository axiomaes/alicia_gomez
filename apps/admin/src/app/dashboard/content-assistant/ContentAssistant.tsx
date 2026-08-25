"use client"

import { useState } from 'react'
import { Sparkles, Loader2, Bot, Copy, Check, FileText, Share2, BookOpen, Save } from 'lucide-react'
import type { ContentDraftType, ContentDraftResult } from '@/actions/ai'

interface ContentAssistantProps {
  /** Extraído de apps/admin/src/actions/ai.ts (generateContentDraft). */
  generateDraft: (type: ContentDraftType, topic: string, keywords?: string) => Promise<ContentDraftResult>
  /** apps/admin/src/app/dashboard/content-assistant/actions.ts -- guarda el borrador y redirige a su edición. */
  createDraft: (type: 'blog' | 'kb', data: { title: string; excerpt: string; contentHtml: string }) => Promise<void>
}

const TYPES: { id: ContentDraftType; label: string; icon: typeof FileText; hint: string }[] = [
  { id: 'blog', label: 'Blog', icon: FileText, hint: 'Artículo completo para el blog de la web.' },
  { id: 'linkedin', label: 'LinkedIn', icon: Share2, hint: 'Post listo para copiar y publicar tú mismo.' },
  { id: 'kb', label: 'Base de Conocimiento', icon: BookOpen, hint: 'Artículo de ayuda público, pensado para SEO/GEO.' },
]

// Mismo lenguaje visual que el Copiloto de Ventas del panel de leads --
// tarjeta con degradado, icono Bot/Sparkles, un único botón de generar.
export function ContentAssistant({ generateDraft, createDraft }: ContentAssistantProps) {
  const [type, setType] = useState<ContentDraftType>('blog')
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [result, setResult] = useState<ContentDraftResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    setError(null)
    setResult(null)
    setCopied(false)

    const res = await generateDraft(type, topic.trim(), keywords.trim() || undefined)
    if (res.success) {
      setResult(res)
    } else {
      setError(res.error)
    }
    setIsGenerating(false)
  }

  const handleCopy = async () => {
    if (result?.success && result.type === 'linkedin') {
      await navigator.clipboard.writeText(result.postText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveDraft = async () => {
    if (!result?.success || result.type === 'linkedin') return
    setIsSaving(true)
    try {
      await createDraft(result.type, {
        title: result.title,
        excerpt: result.excerpt,
        contentHtml: result.contentHtml,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
              Generar borrador <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Usa la integración de IA configurada en Integraciones. Requiere Plan Pro o Enterprise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {TYPES.map((t) => {
            const Icon = t.icon
            const active = type === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  active
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white/60 dark:bg-zinc-950/40 border-indigo-100 dark:border-indigo-900/30 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                  <Icon className="w-4 h-4" /> {t.label}
                </div>
                <p className={`text-xs ${active ? 'text-indigo-100' : 'text-zinc-500 dark:text-zinc-400'}`}>{t.hint}</p>
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Tema o brief
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="Ej: qué documentos necesito llevar a la primera consulta de un divorcio de mutuo acuerdo"
              className="w-full px-4 py-3 rounded-lg bg-white/60 dark:bg-zinc-950/40 border border-indigo-100 dark:border-indigo-900/30 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Palabras clave (opcional)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Ej: divorcio mutuo acuerdo, documentación, plazos"
              className="w-full px-4 py-2.5 rounded-lg bg-white/60 dark:bg-zinc-950/40 border border-indigo-100 dark:border-indigo-900/30 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Generando...' : 'Generar borrador'}
          </button>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>

      {result?.success && result.type === 'linkedin' && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Post generado</h3>
          <textarea
            readOnly
            value={result.postText}
            rows={10}
            className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm resize-y"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg font-medium text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado' : 'Copiar al portapapeles'}
          </button>
          <p className="text-xs text-zinc-500">
            Pégalo directamente en LinkedIn. Axioma Starter no publica en tu nombre automáticamente.
          </p>
        </div>
      )}

      {result?.success && (result.type === 'blog' || result.type === 'kb') && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{result.title}</h3>
            {result.excerpt && <p className="text-sm text-zinc-500 mt-1">{result.excerpt}</p>}
          </div>
          <div
            className="prose prose-sm dark:prose-invert max-w-none border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-950/50"
            dangerouslySetInnerHTML={{ __html: result.contentHtml }}
          />
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Guardando...' : 'Guardar como borrador y editar'}
          </button>
          <p className="text-xs text-zinc-500">
            Se guarda sin publicar. Se abrirá la pantalla de edición normal para revisarlo y publicarlo cuando quieras.
          </p>
        </div>
      )}
    </div>
  )
}
