import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
	// Detrás del proxy de Coolify (Traefik), Astro ve la petición como
	// http://localhost:3000 y no como el dominio real -- por defecto ignora
	// las cabeceras X-Forwarded-* (para no fiarse de un host falsificado) a
	// menos que el dominio esté explícitamente permitido aquí. Sin esto,
	// sitemap.xml y llms.txt generaban URLs con localhost:3000.
	security: {
		allowedDomains: [
			{ hostname: 'gcuellarlegal.abogado', protocol: 'https' }
		]
	},
	adapter: node({
		mode: 'standalone'
	}),
	integrations: [
		tailwind(),
		react(),
	]
});
