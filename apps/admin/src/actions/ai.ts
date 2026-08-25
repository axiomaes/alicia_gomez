"use server"

import { createClient } from '@/utils/supabase/server'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGroq } from '@ai-sdk/groq'
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
  } else if (provider === 'groq') {
    // Groq: infraestructura propia (no revende OpenAI/Anthropic/Google), API
    // compatible con OpenAI. Capa gratuita generosa -- buena opción de
    // arranque para un cliente que todavía no tiene cuenta de pago en los
    // otros tres proveedores.
    const groq = createGroq({ apiKey })
    return groq('llama-3.3-70b-versatile')
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

export type ContentDraftType = 'blog' | 'linkedin' | 'kb'

export type ContentDraftResult =
  | { success: true; type: 'linkedin'; postText: string }
  | { success: true; type: 'blog' | 'kb'; title: string; excerpt: string; contentHtml: string }
  | { success: false; error: string }

// Asistente IA de creación de contenido (Blog / LinkedIn / Base de
// Conocimiento) -- mismo patrón que el resto de este fichero: gate de plan +
// proveedor BYOK vía checkAiIntegration()/getAiModel(), sin lógica nueva de
// gating. LinkedIn solo genera texto (sin publicación automática); Blog y
// Base de Conocimiento devuelven título + extracto + HTML saneado, listos
// para guardarse como borrador real.
export async function generateContentDraft(type: ContentDraftType, topic: string, keywords?: string): Promise<ContentDraftResult> {
  try {
    const integration = await checkAiIntegration()
    const model = getAiModel(integration)
    const userPrompt = `Tema: ${topic}${keywords ? `\nPalabras clave a incluir: ${keywords}` : ''}`

    if (type === 'linkedin') {
      const systemPrompt = "Eres un ghostwriter experto en LinkedIn B2B. Escribe un post original y listo para publicar: un gancho fuerte en la primera línea, cuerpo corto con saltos de línea (nada de bloques densos de texto), un cierre con llamada a la acción, y 3-5 hashtags relevantes al final. Tono profesional pero cercano, sin abusar de emojis. Devuelve solo el texto del post, nada de explicaciones ni comillas envolventes."

      const { text } = await generateText({ model, system: systemPrompt, prompt: userPrompt })
      return { success: true, type, postText: text.trim() }
    }

    const isKb = type === 'kb'
    const roleAndGoal = isKb
      ? "Eres un redactor técnico experto en bases de conocimiento y ayuda al cliente. Escribe un artículo claro y bien estructurado que resuelva una duda frecuente, optimizado para que tanto personas como asistentes de IA lo encuentren útil (GEO)."
      : "Eres un redactor experto en blogs corporativos y SEO. Escribe un artículo de blog persuasivo y bien estructurado sobre el tema dado."
    const systemPrompt = `${roleAndGoal} Responde EXACTAMENTE con este formato, sin nada antes ni después:\nTITULO: <título del artículo>\nEXTRACTO: <resumen de 1-2 frases>\n---\n<cuerpo del artículo en HTML limpio, solo etiquetas <p>, <h2>, <h3>, <ul>, <li>, <strong>, <em>>`

    const { text: raw } = await generateText({ model, system: systemPrompt, prompt: userPrompt })

    const [head, ...bodyParts] = raw.split(/\n---\n/)
    const bodyHtml = bodyParts.join('\n---\n').replace(/```html/g, '').replace(/```/g, '').trim()
    const titleMatch = head.match(/TITULO:\s*(.+)/i)
    const excerptMatch = head.match(/EXTRACTO:\s*(.+)/i)

    return {
      success: true,
      type,
      title: (titleMatch?.[1] || topic).trim(),
      excerpt: (excerptMatch?.[1] || '').trim(),
      contentHtml: sanitizeHtml(bodyHtml),
    }
  } catch (error: any) {
    console.error("AI Error:", error)
    return { success: false, error: error.message }
  }
}
