"use client"

import { useState } from 'react'
import { Sparkles, Loader2, Bot } from 'lucide-react'
import { generateLeadSummary, generateSuggestedReply } from '@/actions/ai'

interface LeadAIAssistantProps {
  contactName: string
  messages: string[]
}

export function LeadAIAssistant({ contactName, messages }: LeadAIAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsGenerating(true)
    
    // Generar resumen
    const summaryResult = await generateLeadSummary(messages)
    if (summaryResult.success) {
      setSummary(summaryResult.summary || null)
    } else {
      alert("Error al analizar: " + summaryResult.error)
      setIsGenerating(false)
      return
    }

    // Generar borrador de respuesta
    const replyResult = await generateSuggestedReply(messages, contactName)
    if (replyResult.success && replyResult.replyBody) {
      // Usar DOM manipulation para inyectar en el formulario que ya existe en la página
      const subjectInput = document.querySelector('input[name="subject"]') as HTMLInputElement
      const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement
      
      if (subjectInput && !subjectInput.value) {
        subjectInput.value = `Respuesta a tu consulta - Axioma`
      }
      if (messageTextarea) {
        messageTextarea.value = replyResult.replyBody
      }
    }

    setIsGenerating(false)
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-5 mb-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
            Copiloto de Ventas <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
            Analiza el historial de este cliente y genera un borrador de respuesta optimizado para cerrar la venta.
          </p>
          
          {summary ? (
            <div className="bg-white/60 dark:bg-zinc-950/40 rounded-lg p-3 text-sm text-zinc-800 dark:text-zinc-200 border border-indigo-100 dark:border-indigo-900/30">
              <strong>Análisis rápido:</strong> {summary}
            </div>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={isGenerating || messages.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isGenerating ? 'Analizando...' : 'Analizar Lead y Pre-redactar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
