# Guía Técnica: Axioma Starter

Esta guía está destinada al equipo de desarrollo e ingeniería de **Axioma Creativa**. Describe la arquitectura subyacente, el flujo de datos y las directrices de despliegue de nuestra plantilla base "Axioma Starter".

## 1. Arquitectura del Monorepo

El proyecto utiliza **Turborepo** para orquestar múltiples aplicaciones y paquetes. 

- **`apps/web` (Frontend):** Construido sobre **Astro**. Es el motor de renderizado público. Las páginas estáticas se benefician de la hidratación parcial (Island Architecture) de Astro, mientras que el enrutamiento dinámico (`[...slug].astro`) es capaz de generar páginas al vuelo o en build-time utilizando los datos provenientes de Supabase.
- **`apps/admin` (Panel de Control):** Una SPA construida con **Next.js (App Router)**. Sirve como CMS Headless y CRM. Utiliza TailwindCSS v4 y componentes enriquecidos como editores Tiptap y tableros Kanban (`@hello-pangea/dnd`).

## 2. Base de Datos (Supabase / PostgreSQL)

Todo el sistema está gobernado por Supabase como fuente única de verdad. Hemos eliminado los `.env` estáticos para dar paso a una configuración dinámica por base de datos:

- **`tenant_settings`:** Almacena la configuración visual (colores, fuentes, logos) y el **`subscription_plan`** (`starter`, `pro`, `enterprise`) del cliente.
- **`tenant_integrations`:** Almacena las claves API (BYOK) de servicios de terceros (OpenAI, Gemini, Claude, Brevo, Mailchimp), permitiendo que cada cliente use sus propios recursos de IA o email si su plan lo permite.
- **`content`:** Diccionario de clave-valor (`lang`, `key`, `value`) que nutre al frontend.
- **`contacts` & `form_submissions`:** El núcleo del CRM. Aquí se guardan los leads y su historial de mensajes.
- **`contact_notes` & `contact_emails`:** Historial de interacciones de los comerciales (Kanban).
3. **Almacenamiento (Storage):**
   - Bucket público para alojamiento de imágenes subidas mediante el Drag & Drop del panel de Next.js.

## 3. Flujo de Theming (Personalización de Cliente)

Para que el frontend sea reutilizable sin tocar código complejo, Astro resuelve un archivo `apps/web/src/lib/theme.ts`. Este archivo define los colores primarios, secundarios, la tipografía global y los logotipos.
**Flujo recomendado para un nuevo cliente:**
1. Alterar `theme.ts` con los valores de marca del cliente.
2. Modificar el `contentSchema.ts` si el cliente tiene servicios específicos (reemplazar `servicio-1` por `asesoria-fiscal`).
3. Renombrar los archivos físicos en `apps/web/src/pages/ca/` (o el idioma correspondiente) para que hagan match.

## 4. Inteligencia Artificial (Copiloto y GEO)

Axioma Starter implementa un módulo nativo de IA generativa (Módulo Experto IA) impulsado por los SDKs de Vercel AI:
- **GEO (Generative Engine Optimization):** El frontend Astro expone dinámicamente un endpoint `/llms.txt` y genera esquemas `JSON-LD` para posicionamiento en motores como Perplexity y SearchGPT.
- **Panel Integraciones:** Los clientes configuran dinámicamente su proveedor de LLM (OpenAI, Gemini, Claude) en `/dashboard/integrations`.
- **Asistente CMS (RichText):** Un "Botón Mágico" (Sparkles) inyectado en el editor Tiptap que usa `Server Actions` para reformatear, corregir y optimizar textos para SEO en tiempo real.
- **Copiloto CRM:** Un asistente de ventas (`LeadAIAssistant`) que lee el historial completo del lead y pre-redacta borradores de correo optimizados para conversión.

## 5. Estrategia de Despliegue (Coolify / Docker)

Axioma Starter incluye dos archivos Docker optimizados para minimizar el consumo de RAM (evitando errores OOM):

- **`Dockerfile` (Astro Web):** Filtra y construye únicamente el workspace `web` (`turbo run build --filter=web`).
- **`Dockerfile.admin` (Next.js CMS):** Utiliza `turbo prune` para aislar las dependencias del panel de control.

En **Coolify**:
1. Crear un recurso para el frontend apuntando al `Dockerfile` base.
2. Crear un recurso paralelo para el admin apuntando al `Dockerfile.admin`.
3. Ambos compartirán el mismo repositorio de GitHub, inyectando las credenciales de Supabase mediante variables de entorno.

Para el procedimiento completo de alta de un cliente nuevo (instancia Supabase self-hosted, migraciones, primer usuario, y esta configuración de Coolify en contexto), ver [`docs/installation_guide.md`](installation_guide.md).
