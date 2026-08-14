/** @type {import('tailwindcss').Config} */
export default {
	// Por defecto Tailwind activa las clases `dark:` según las preferencias del
	// sistema operativo del visitante (estrategia 'media'). La identidad de marca
	// aquí es un único diseño claro deliberado — no hay ningún toggle de modo
	// oscuro en la web pública — así que un visitante con el SO en modo oscuro
	// veía secciones invertidas al azar (p. ej. "Sobre mí" en negro puro) según
	// qué bloque tuviera variantes `dark:` y cuál no. Con 'class', esas clases
	// solo se activan si algo añade class="dark" al <html> — y nada lo hace.
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// El valor real (RGB space-separated) lo inyecta BaseLayout.astro como
				// custom property por request, a partir del theme del tenant en el CMS.
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				accent: 'rgb(var(--color-accent) / <alpha-value>)',
			},
			fontFamily: {
				sans: ['var(--font-sans)', 'sans-serif'],
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
}
