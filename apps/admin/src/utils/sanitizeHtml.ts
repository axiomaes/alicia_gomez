// Sanitizador ligero y sin dependencias para el HTML que sale del editor Tiptap
// y del Botón Mágico de IA antes de guardarlo en `content`/`pages`. RichTextBlock
// en apps/web lo renderiza con dangerouslySetInnerHTML, así que esto es la única
// barrera real contra HTML/JS inesperado publicado en el sitio público.
//
// Es una lista blanca deliberadamente estricta (los bloques de contenido del CMS
// solo necesitan formato de texto enriquecido, no scripts ni estilos inline).
// Si en el futuro hace falta cubrir más casos, sustituir por `sanitize-html` o
// `isomorphic-dompurify` — esta función cubre el riesgo principal (scripts,
// manejadores de eventos, iframes, urls javascript:) sin añadir una dependencia.

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'h1', 'h2', 'h3', 'h4',
  'ul', 'ol', 'li',
  'a', 'blockquote', 'span',
])

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  span: new Set(['class']),
}

export function sanitizeHtml(input: string): string {
  if (!input) return ''

  // 1. Fuera cualquier etiqueta peligrosa junto con su contenido.
  let html = input.replace(/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, '')

  // 2. Reescribe etiqueta por etiqueta, descartando las que no están en la lista blanca
  //    y limpiando atributos (fuera on*=, javascript:, y cualquier atributo no permitido).
  html = html.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, rawTag, rawAttrs) => {
    const tag = rawTag.toLowerCase()
    const isClosing = match.startsWith('</')

    if (!ALLOWED_TAGS.has(tag)) return ''
    if (isClosing) return `</${tag}>`

    const allowed = ALLOWED_ATTRS[tag]
    if (!allowed) return `<${tag}>`

    const attrs: string[] = []
    const attrRe = /([a-zA-Z0-9-]+)\s*=\s*"([^"]*)"|([a-zA-Z0-9-]+)\s*=\s*'([^']*)'/g
    let attrMatch: RegExpExecArray | null
    while ((attrMatch = attrRe.exec(rawAttrs))) {
      const name = (attrMatch[1] || attrMatch[3]).toLowerCase()
      const value = attrMatch[2] ?? attrMatch[4] ?? ''
      if (!allowed.has(name)) continue
      if (/^\s*javascript:/i.test(value)) continue
      attrs.push(`${name}="${value.replace(/"/g, '&quot;')}"`)
    }

    if (tag === 'a') attrs.push('rel="noopener noreferrer"')

    return attrs.length ? `<${tag} ${attrs.join(' ')}>` : `<${tag}>`
  })

  // 3. Por si algo se coló sin pasar por el regex de arriba (event handlers sueltos).
  html = html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, '')

  return html.trim()
}
