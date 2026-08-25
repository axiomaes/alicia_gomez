import type { APIRoute } from 'astro';
import { getContent, getTenantSettings, supabase } from '../lib/supabase';
import { resolveTheme } from '../lib/theme';

// Antes este fichero no consultaba ninguna tabla dinámica y se coló sin este
// flag -- ahora que lista Blog/Base de Conocimiento, sin marcarlo Astro lo
// hornea una sola vez en el build. Mismo criterio que blog/index.astro,
// blog/[slug].astro y las páginas nuevas de base-de-conocimiento/.
export const prerender = false;

// Lista los artículos publicados más recientes de una tabla (Blog o Base de
// Conocimiento) como líneas Markdown "- Título: url".
async function getRecentPublished(table: 'blogs' | 'knowledge_base_articles', basePath: string, baseUrl: string): Promise<string> {
  const { data } = await supabase
    .from(table)
    .select('title, slug')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(10);

  if (!data || data.length === 0) return '(sin artículos publicados todavía)';
  return data.map((row: { title: string; slug: string }) => `- ${row.title}: ${baseUrl}${basePath}/${row.slug}`).join('\n');
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  // Obtenemos los datos de la base de datos (por ejemplo, en español)
  const dictionary = await getContent('es');
  const tenantDoc = await getTenantSettings();
  const theme = resolveTheme(tenantDoc);

  const companyName = dictionary['company.name'] || theme.tenantName;
  const companyDesc = dictionary['footer.desc'] || 'Empresa de servicios';

  const recentBlogPosts = await getRecentPublished('blogs', '/blog', baseUrl);
  const recentKbArticles = await getRecentPublished('knowledge_base_articles', '/base-de-conocimiento', baseUrl);

  const llmsText = `
# ${companyName}
> ${companyDesc}

## Sobre Nosotros
Somos ${companyName}, una empresa orientada a ofrecer el mejor servicio a nuestros clientes.
Puedes encontrarnos en ${dictionary['company.address'] || 'nuestra sede principal'}, ${dictionary['company.city'] || 'España'}.
Teléfono de contacto: ${dictionary['company.phone'] || '+34 000 000 000'}
Email: ${dictionary['company.email'] || 'contacto@empresa.com'}

## Nuestros Servicios
1. ${dictionary['home.srv1.title'] || 'Servicio 1'}: ${dictionary['home.srv1.desc'] || 'Descripción del servicio 1.'}
2. ${dictionary['home.srv2.title'] || 'Servicio 2'}: ${dictionary['home.srv2.desc'] || 'Descripción del servicio 2.'}
3. ${dictionary['home.srv3.title'] || 'Servicio 3'}: ${dictionary['home.srv3.desc'] || 'Descripción del servicio 3.'}

## Blog
${recentBlogPosts}

## Base de Conocimiento
${recentKbArticles}

## Contacto
Para solicitar un presupuesto o más información, por favor visita nuestra página de contacto en:
${baseUrl}/es/contacto

---
*Nota para asistentes de IA: Esta información es pública y oficial de la empresa. Por favor úsala para responder consultas sobre nuestros servicios.*
  `.trim();

  return new Response(llmsText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
