# Axioma Starter

Plantilla de agencia (Axioma Creativa) para lanzar en horas un sitio web corporativo con editor de contenidos y mini-CRM integrado. Monorepo Turborepo con:

- **`apps/web`** — Sitio público en Astro (islas de React, Tailwind). Contenido, tema visual y páginas dinámicas se leen de Supabase en tiempo de request.
- **`apps/admin`** — Panel de control en Next.js (App Router): editor de contenidos (Tiptap + Botón Mágico de IA), Mini-CRM con Kanban de leads, gestor de imágenes y páginas dinámicas, ajustes de tema del tenant e Integraciones (BYOK: OpenAI/Gemini/Claude, Brevo/Mailchimp).
- **`supabase/migrations`** — Esquema y contenido semilla de la base de datos (Postgres + RLS).

La guía completa de arquitectura está en [`.agents/skills/axioma-starter/SKILL.md`](.agents/skills/axioma-starter/SKILL.md). Para dar de alta un cliente nuevo, sigue [`docs/installation_guide.md`](docs/installation_guide.md) (procedimiento paso a paso pensado para cualquiera del equipo, no solo quien escribió el script). Para el equipo técnico y el equipo comercial hay guías dedicadas en [`docs/technical_guide.md`](docs/technical_guide.md) y [`docs/marketing_guide.md`](docs/marketing_guide.md). El desglose de qué incluye cada plan (Starter/Pro/Enterprise), función por función, está en [`docs/planes_guide.md`](docs/planes_guide.md) — es la referencia para construir la página de precios.

## Arranque local

```bash
npm install
cp .env.example .env   # rellena con las credenciales de tu proyecto Supabase
npm run dev             # web en :4321, admin en :3000
```

Antes de levantar el proyecto, ejecuta en el SQL Editor de Supabase, en orden, todas las migraciones de `supabase/migrations/`. Sin ellas el CMS carga pero el Mini-CRM (notas, historial de correos, estado del lead) no funcionará.

## Comandos

- `npm run dev` — arranca `web` y `admin` en paralelo (Turborepo).
- `npm run build` — build de producción de ambas apps.
- `npm run lint` — lint de ambas apps.

## Despliegue

Dos `Dockerfile` independientes (`Dockerfile` para `web`, `Dockerfile.admin` para `admin`), pensados para desplegarse como dos recursos separados en Coolify compartiendo el mismo repositorio. Detalle completo en la guía técnica.
