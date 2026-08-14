"use server"

import { createClient } from '@/utils/supabase/server'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

export async function checkAiIntegration() {
  const supabase = await createClient()

  // Verify Plan
  const { data: tenant } = await supabase
    .from('tenant_settings')
    .select('subscription_plan')
    .single()

  const isPro = tenant?.subscription_plan === 'pro' || tenant?.subscription_plan === 'enterprise'
  if (!isPro) {
    throw new Error("El módulo Experto IA requiere un Plan Pro o Enterprise.")
  }

  // Get AI Provider
  const { data: integration } = await supabase
    .from('tenant_integrations')
    .select('*')
    .eq('provider_type', 'ai_llm')
    .single()

  if (!integration || !integration.is_active || !integration.api_key) {
    throw new Error("La integración de IA no está configurada o está desactivada. Revisa la pestaña Integraciones.")
  }

  return integration
}

function getAiModel(integration: any) {
  const provider = integration.provider_name
  const apiKey = integration.api_key

  if (provider === 'openai') {
    const openai = createOpenAI({ apiKey })
    return openai('gpt-4o-mini')
  } else if (provider === 'gemini') {
    const google = createGoogleGenerativeAI({ apiKey })
    return google('gemini-1.5-flash')
  } else if (provider === 'claude') {
    const anthropic = createAnthropic({ apiKey })
    return anthropic('claude-3-haiku-20240307')
  }

  throw new Error("Proveedor IA no soportado.")
}

export async function improveTextWithAi(text: string, instruction: string) {
  try {
    const integration = await checkAiIntegration()
    const model = getAiModel(integration)

    const systemPrompt = "Eres un asistente experto en redacción persuasiva y SEO para páginas web corporativas. Debes devolver estrictamente HTML limpio válido (etiquetas <p>, <strong>, <em>, <h1>, <h2>, <ul>, <li>). NO devuelvas bloques de markdown ```html. Devuelve directamente el código HTML. Mantén el tono profesional."

    let userPrompt = ""
    if (instruction === 'improve') {
      userPrompt = `Mejora la redacción y persuasión del siguiente texto HTML, manteniéndolo aproximadamente del mismo largo:\n\n${text}`
    } else if (instruction === 'fix') {
      userPrompt = `Corrige la ortografía y gramática del siguiente texto HTML sin cambiar su significado ni estructura:\n\n${text}`
    } else if (instruction === 'seo') {
      userPrompt = `Reescribe el siguiente texto HTML para optimizarlo para SEO (añadiendo palabras clave relevantes) y hazlo más atractivo comercialmente:\n\n${text}`
    } else {
      userPrompt = `Aplica esta instrucción: "${instruction}" al siguiente texto HTML:\n\n${text}`
    }

    const { text: generatedHtml } = await generateText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
    })

    const cleanHtml = generatedHtml.replace(/```html/g, '').replace(/```/g, '').trim()
    return { success: true, html: sanitizeHtml(cleanHtml) }
  } catch (error: any) {
    console.error("AI Error:", error)
    return { success: false, error: error.message }
  }
}

export async function generateLeadSummary(messages: string[]) {
  try {
    const integration = await checkAiIntegration()
    const model = getAiModel(integration)

    const systemPrompt = "Eres un analista de ventas. Analiza el siguiente historial de mensajes de un prospecto/lead (notas, correos, formularios) y genera un resumen ejecutivo MUY BREVE (máximo 2-3 líneas) indicando el nivel de interés, si es un ticket alto, y cuál debería ser el próximo paso. Responde en español directo, sin formalismos."

    const { text: summary } = await generateText({
      model,
      system: systemPrompt,
      prompt: "Historial:\n" + messages.join("\n\n"),
    })

    return { success: true, summary }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function generateSuggestedReply(messages: string[], contactName: string) {
  try {
    const integration = await checkAiIntegration()
    const model = getAiModel(integration)

    const systemPrompt = "Eres un comercial experto. Escribe un borrador de correo de respuesta (solo el cuerpo del mensaje) para este lead. Sé profesional, persuasivo y orienta la respuesta a cerrar una llamada o reunión. No incluyas Asunto, solo el texto del correo."

    const { text: replyBody } = await generateText({
      model,
      system: systemPrompt,
      prompt: `Lead Nombre: ${contactName}\n\nHistorial del Lead:\n${messages.join("\n\n")}`,
    })

    return { success: true, replyBody }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
