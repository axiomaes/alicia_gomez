---
name: axioma-starter
description: "Plantilla 'Axioma Starter': Web Base genérica + Editor Visual + Mini CRM integrado (Astro + Next.js + Supabase) para lanzar productos completos en tiempo récord por la agencia Axio."
---

# Axioma Starter (Web + Editor + CRM)

Este skill documenta la arquitectura y los pasos exactos para clonar **Axioma Starter**. Se trata del producto estrella de la agencia **Axio**: una plantilla genérica que incluye la web base, un editor visual de contenido y un Mini CRM para gestionar clientes y leads.

## 🏗️ Arquitectura del Producto

El producto es un **Monorepo** gestionado con Turborepo, que contiene:

### 1. `apps/web` (Frontend Público - La Web)
- Construido con **Astro**, TailwindCSS y React.
- Diseñado para máxima velocidad y SEO (SSG / SSR).
- Motor de renderizado dinámico (`[...slug].astro`) que convierte datos de Supabase en componentes de React (`RichTextBlock`, `ImageTextBlock`).
- Contiene rutas base (`servicio-1`, `servicio-2`, `servicio-3`) listas para ser personalizadas.

### 2. `apps/admin` (Panel de Control - Editor + CRM)
- Construido con **Next.js (App Router)** y TailwindCSS. UI/UX premium.
- **Editor Visual (CMS):** Tipado fuertemente por `src/config/contentSchema.ts`. Soporta campos de texto, HTML enriquecido (Tiptap) y subida de imágenes. Incluye un **Botón Mágico de IA** (Sparkles) que corrige, mejora y optimiza SEO en tiempo real.
- **Mini-CRM (Gestión de Leads):** Tablero Kanban interactivo (`@hello-pangea/dnd`). Ficha 360º con timeline de notas y correos. Incluye un **Copiloto de Ventas** que lee el historial del prospecto y genera borradores de correo automatizados.
- **Panel de Integraciones (SaaS BYOK):** Sistema dinámico donde el cliente puede introducir sus propias API Keys de OpenAI, Gemini, Claude, Brevo o Mailchimp, activando funciones avanzadas solo si tiene un Plan Pro o Enterprise.

### 3. Backend (Supabase — self-hosted)
Cada cliente tiene su propia instancia de Supabase **self-hosted** (Docker), no un proyecto en Supabase Cloud. Eso significa acceso directo a Postgres por `psql`/cadena de conexión, lo cual es justo lo que aprovecha el script de aprovisionamiento (ver más abajo) para aplicar las migraciones sin pasar por el SQL Editor a mano.
- **Base de Datos PostgreSQL:** Almacena el contenido (`content`), contactos (`contacts`), mensajes (`form_submissions`), notas (`contact_notes`), emails (`contact_emails`), galería de imágenes (`images`).
- **SaaS Settings:** Tablas `tenant_settings` (Configuración visual y plan de suscripción) y `tenant_integrations` (API Keys del cliente).
- **Storage:** Bucket `web_images`, creado y con sus políticas RLS ya definidas por migración (`storage_bucket_web_images.sql`) — no hace falta crearlo a mano en el dashboard.
- **Auth:** Autenticación para el acceso al panel.

Todo lo que ve el visitante o el comercial (teléfono, email, dirección, nombre de empresa, colores, logo, claves de IA/email) vive en estas tablas y se edita desde el panel de administración. Nada de eso debe quedar hardcodeado en código ni en variables de entorno — si en algún sitio aparece un dato de negocio fijo en el código, es un bug, no una funcionalidad.

---

## 🛠️ Cómo Clonar para un Nuevo Cliente

La vía recomendada es el script `crear_cliente.sh` (ver sección de Automatización), que hace los pasos 1-3 en un solo comando, incluida la aplicación de **todas** las migraciones directamente contra el Postgres del Supabase self-hosted del cliente. Lo que sigue es el detalle de esos pasos por si necesitas hacer alguno a mano o algo falla.

### 1. Clonar el repositorio base
```bash
git clone --depth 1 https://github.com/axioma-creativa/axioma-starter.git nuevo-cliente
rm -rf nuevo-cliente/.git
cd nuevo-cliente
git init
```

### 2. Configuración en Supabase (self-hosted)
1. **Instancia:** Levanta la instancia self-hosted de Supabase del cliente (Docker/Coolify). **Asegúrate de tener un dominio HTTPS configurado.**
2. **Storage:** No hace falta crear el bucket a mano — la migración `storage_bucket_web_images.sql` crea el bucket `web_images` y sus políticas RLS. Solo asegúrate de ejecutarla junto al resto (paso 3).

### 3. Ejecutar las migraciones SQL
Aplica **todas** las migraciones de `supabase/migrations/`, en el orden en que aparecen (por fecha/número en el nombre del archivo), contra la base de datos Postgres del cliente. No te saltes ninguna: el Mini-CRM (Kanban, notas, historial de correos) necesita las columnas y tablas de `..._crm_history_and_contact_fields.sql`, no solo `001_initial_schema.sql`; y el Storage necesita `..._storage_bucket_web_images.sql`.

Con acceso directo a Postgres (self-hosted), esto se reduce a:
```bash
for f in supabase/migrations/*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"; done
```
— exactamente lo que hace `crear_cliente.sh` cuando le pasas la `DATABASE_URL`.

### 4. Adaptar el Starter al Nuevo Cliente
La plantilla trae 3 fichas de servicio genéricas (`servicio-1`, `servicio-2`, `servicio-3`, con claves de contenido `srv1.*`/`srv2.*`/`srv3.*`) y una portada que ya las consume — no hace falta tocar código de rutas para el caso normal:
1. **Contenido (`/dashboard/content` en el panel):** Renombra los títulos de "Servicio 1/2/3" a los servicios reales del cliente. Esto ya actualiza el menú de navegación (lee `home.srv1.title`, etc.) y el SEO de cada página.
2. **Editor (`apps/admin/src/config/contentSchema.ts`):** Si el cliente necesita más o menos secciones de las 3 que trae la plantilla, edítalo aquí — las etiquetas de los campos son solo para el panel, no cambian los slugs públicos.
3. **La Web (`apps/web/src/pages/[lang]/[...slug].astro`):** Solo si necesitas cambiar los slugs públicos (`/servicio-1` → `/asesoria-fiscal`), edita `validSlugsEs`/`validSlugsCa` y `SLUG_TO_SERVICE` en este archivo, y actualiza los enlaces en `Navigation.astro` a juego.

### 5. Personalización Visual (Theming)
La identidad del cliente (nombre, colores, fuente, logo, favicon) **se carga desde el panel** (`/dashboard/settings`, tabla `tenant_settings`), no editando código — es lo que hace que un mismo repo sirva para cualquier cliente sin tocar nada más que contenido. `apps/web/src/lib/theme.ts` solo define los valores de `DEFAULTS`, una red de seguridad genérica ("Cliente Base", azul/índigo neutro, logo placeholder) para cuando esa fila aún no existe o el CMS no responde — no lo edites por cliente, edítalo solo si quieres cambiar el propio fallback genérico de la plantilla.
1. Entra al panel del cliente → **Apariencia** y sube ahí su logo, favicon, colores y tipografía (los cuatro son campos de `tenant_settings`, con `BaseLayout.astro` leyéndolos en cada request).
2. **Logo del Panel de Control (`AdminSidebar.tsx`):** ese "Axioma CMS" es la marca de la propia herramienta de Axio, no la del cliente — normalmente no hace falta tocarlo al clonar.

### 6. Variables de Entorno (.env)
Las integraciones ahora son dinámicas por base de datos, así que en el `.env` solo necesitas las credenciales base de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL="https://tu-nueva-url.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-nueva-key"
PUBLIC_SUPABASE_URL="https://tu-nueva-url.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="tu-nueva-key"
```
*(Las claves de OpenAI, Brevo, etc. las meterá el cliente directamente en su Panel de Control -> Integraciones).*

### 7. Instalar y Lanzar
```bash
npm install
npm run dev
```

---

## 🤖 Automatización de Creación (Script para Coolify)

El script vive en [`crear_cliente.sh`](../../../crear_cliente.sh) en la raíz del repo — no lo dupliques aquí, edítalo ahí para que no haya dos versiones divergentes. El procedimiento completo, paso a paso y pensado para cualquier persona del equipo (no solo quien lo escribió), está en [`docs/installation_guide.md`](../../../docs/installation_guide.md) — es la referencia a seguir al dar de alta un cliente; esto de aquí es solo el resumen técnico.

```bash
DATABASE_URL="postgresql://..." \
SUPABASE_URL="https://supabase-cliente.tudominio.com" \
SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
ADMIN_EMAIL="cliente@axioma-creativa.es" \
./crear_cliente.sh <nombre_cliente> <url_repositorio_nuevo>
```

- Clona el starter sin historial, inicializa el repo del cliente y lo sube a `REPO_URL`.
- Con `DATABASE_URL` (cadena de conexión Postgres del Supabase self-hosted del cliente), aplica automáticamente **todas** las migraciones de `supabase/migrations/` con `psql`, en orden — esquema, RLS, contenido genérico, bucket `web_images` e integraciones, todo de una vez.
- Con `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + `ADMIN_EMAIL`, crea el primer usuario del panel vía la Admin API de Auth (contraseña autogenerada si no pasas `ADMIN_PASSWORD`, impresa una única vez al final). La service role key se usa solo en ese momento, en tu terminal — nunca se escribe en el repo del cliente ni en Coolify.
- Cualquiera de esas variables se puede omitir: el script hace lo que puede y avisa exactamente de qué queda pendiente a mano (alta del recurso en Coolify, variables de entorno de la app, y cargar logo/colores/teléfono/claves API desde el panel).
