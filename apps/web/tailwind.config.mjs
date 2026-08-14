/** @type {import('tailwindcss').Config} */
export default {
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
