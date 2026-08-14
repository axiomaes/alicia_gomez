import type { APIRoute } from 'astro';

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
  '/ca/contacte'
];

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  // Remove trailing slash if present
  const baseUrl = url.origin.replace(/\/$/, '');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
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
