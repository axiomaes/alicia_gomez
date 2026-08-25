import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

// Antes esta lista era 100% fija. Se consulta Supabase por request
// (prerender=false) para no hornear una lista de artículos que quedaría
// desactualizada en cuanto se publique algo nuevo desde el panel -- no se
// toca nada más de este fichero (ampliarlo para páginas dinámicas del
// Constructor de Páginas es un gap aparte).
export const prerender = false;

const pages = [
  '',
  '/es',
  '/es/servicio-1',
  '/es/servicio-2',
  '/es/servicio-3',
  '/es/contacto',
  '/ca',
  '/ca/servicio-1',
  '/ca/servicio-2',
  '/ca/servicio-3',
  '/ca/contacte',
  '/blog',
  '/base-de-conocimiento'
];

async function getPublishedSlugs(table: 'blogs' | 'knowledge_base_articles', basePath: string): Promise<string[]> {
  const { data } = await supabase
    .from(table)
    .select('slug')
    .eq('is_published', true);

  return (data || []).map((row: { slug: string }) => `${basePath}/${row.slug}`);
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  // Remove trailing slash if present
  const baseUrl = url.origin.replace(/\/$/, '');

  const allPages = [
    ...pages,
    ...(await getPublishedSlugs('blogs', '/blog')),
    ...(await getPublishedSlugs('knowledge_base_articles', '/base-de-conocimiento')),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' || page === '/es' || page === '/ca' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
