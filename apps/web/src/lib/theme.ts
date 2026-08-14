// Resuelve el theme visual (logo, colores, tipografía) de un tenant a partir de
// `tenant_settings`, con fallback a los valores genéricos de la plantilla si el
// CMS no responde o el campo aún no está configurado: un fallo de red o una fila
// vacía nunca debe romper el sitio.

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const DEFAULTS = {
  tenantName: 'Alicia Gómez Cuéllar',
  primaryHex: '#1A1A1A',
  accentHex: '#B8975A',
  fontFamily: 'cormorant-jost',
  logoUrl: '/logos/logo_alicia_gomez.svg',
}

// Los `value` deben coincidir exactamente con los `font_family` que ofrece
// el selector de tipografía en apps/admin/src/app/dashboard/settings.
export const FONT_MAP: Record<string, { cssStack: string; href: string; label: string }> = {
  exo2: {
    label: 'Exo 2',
    href: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap',
    cssStack: '"Exo 2", sans-serif',
  },
  inter: {
    label: 'Inter',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    cssStack: '"Inter", sans-serif',
  },
  poppins: {
    label: 'Poppins',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
    cssStack: '"Poppins", sans-serif',
  },
  montserrat: {
    label: 'Montserrat',
    href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap',
    cssStack: '"Montserrat", sans-serif',
  },
  merriweather: {
    label: 'Merriweather',
    href: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
    cssStack: '"Merriweather", serif',
  },
  // Pareja de marca de Alicia Gómez: Cormorant Garamond para titulares
  // (aplicado vía global.css a h1-h4, ver nota ahí) + Jost como fuente de
  // cuerpo — es lo que carga `--font-sans` en toda la web.
  'cormorant-jost': {
    label: 'Cormorant Garamond + Jost',
    href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap',
    cssStack: '"Jost", sans-serif',
  },
}

export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

export type ResolvedTheme = {
  accentHex: string
  accentRgb: string
  fontCssStack: string
  fontHref: string
  fontFamily: string
  logoUrl: string
  primaryHex: string
  primaryRgb: string
  tenantName: string
  faviconUrl: string
}

export function resolveTheme(tenantDoc: any): ResolvedTheme {
  const primaryHex = HEX_RE.test(tenantDoc?.primary_color) ? tenantDoc.primary_color : DEFAULTS.primaryHex
  const accentHex = HEX_RE.test(tenantDoc?.accent_color) ? tenantDoc.accent_color : DEFAULTS.accentHex
  const fontFamily = FONT_MAP[tenantDoc?.font_family] ? tenantDoc.font_family : DEFAULTS.fontFamily
  const font = FONT_MAP[fontFamily]

  return {
    tenantName: tenantDoc?.tenant_name || DEFAULTS.tenantName,
    primaryHex,
    accentHex,
    primaryRgb: hexToRgbTriplet(primaryHex),
    accentRgb: hexToRgbTriplet(accentHex),
    fontFamily,
    fontHref: font.href,
    fontCssStack: font.cssStack,
    logoUrl: tenantDoc?.logo_url || DEFAULTS.logoUrl,
    faviconUrl: tenantDoc?.favicon_url || '/favicon.svg'
  }
}
