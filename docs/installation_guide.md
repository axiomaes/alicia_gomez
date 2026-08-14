# Manual de Instalación: Alta de un Cliente Nuevo

Guía operativa para cualquier miembro de **Axioma Creativa** que necesite montar Axioma Starter para un cliente nuevo. No requiere tocar código: es un procedimiento repetible de infraestructura + configuración por panel.

Si es la primera vez que lo haces, léelo entero una vez antes de empezar. Las siguientes veces, el [Checklist rápido](#checklist-rápido) al final basta.

---

## 0. Antes de empezar

**Herramientas en tu máquina:**
- `git`
- `psql` (cliente de Postgres — en Mac: `brew install libpq`; en Windows: incluido con `psql` de PostgreSQL o Git Bash + WSL)
- `curl`
- `openssl` (para generar la contraseña del primer usuario si no quieres elegirla tú)

**Accesos que necesitas tener ya:**
- Permiso para crear repositorios en la organización de GitHub de Axioma Creativa.
- Acceso al Coolify donde se despliegan los clientes.
- Acceso para levantar (o pedir que levanten) una instancia **Supabase self-hosted** nueva para este cliente. Cada cliente tiene la suya — nunca se comparte una instancia entre clientes.

**Qué vas a producir al final de esta guía:**
- Un repositorio nuevo en GitHub con el código del cliente.
- Una base de datos lista (esquema, contenido genérico, Storage, RLS).
- Un primer usuario para entrar al panel.
- Dos recursos desplegados en Coolify (web pública + panel).

---

## 1. Levantar la instancia de Supabase del cliente

Sigue el procedimiento interno de la agencia para levantar una instancia Supabase self-hosted (Docker/Coolify) dedicada a este cliente. Al terminar, necesitas anotar tres datos de **Supabase Studio → Project Settings → API**:

| Dato | Dónde se usa |
|---|---|
| **Project URL** (`https://supabase-cliente.tudominio.com`) | Variables de entorno de la app + creación del primer usuario |
| **anon / public key** | Variables de entorno de la app (es la única clave que usa la app en tiempo de ejecución) |
| **service_role key** | Solo para el paso 2 de este manual (crear el primer usuario). **No se guarda en ningún fichero del proyecto.** |

Y de **Project Settings → Database**, la cadena de conexión directa a Postgres (`DATABASE_URL`), para aplicar las migraciones.

> ⚠️ La `service_role key` se salta todas las políticas de RLS. Se usa una única vez en la terminal para este script y no debe llegar nunca a un `.env`, un commit, ni a Coolify. La app (`apps/web` y `apps/admin`) solo usa la `anon key` — es la garantía de que todo pase por RLS.

---

## 2. Ejecutar `crear_cliente.sh`

Este script hace en un solo paso lo que antes eran seis pasos manuales y propensos a saltarse algo: clonar el starter sin historial, subirlo a un repo nuevo, aplicar **todas** las migraciones de `supabase/migrations/` contra la base de datos del cliente, y crear el primer usuario del panel.

Desde tu clon local de `axioma-starter`:

```bash
DATABASE_URL="postgresql://postgres:TU_PASSWORD@TU_HOST:5432/postgres" \
SUPABASE_URL="https://supabase-cliente.tudominio.com" \
SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
ADMIN_EMAIL="cliente@axioma-creativa.es" \
./crear_cliente.sh nombre-cliente git@github.com:axioma-creativa/nombre-cliente.git
```

Notas:
- Si omites `ADMIN_PASSWORD`, el script genera una aleatoria y la imprime **una sola vez** al final — apúntala en el gestor de contraseñas de la agencia antes de cerrar la terminal.
- Si omites cualquiera de las cuatro variables, el script no falla: hace lo que puede (por ejemplo, solo el repo, o repo + BD pero sin usuario) y te dice exactamente qué te queda por hacer a mano.
- El repositorio de GitHub (`nombre-cliente`) tiene que existir ya y estar vacío antes de correr el script — créalo desde GitHub primero.

Al terminar, el script imprime un resumen con lo que hizo y lo que queda pendiente. Guárdalo o haz captura: ahí están las credenciales del primer usuario.

---

## 3. Configurar Coolify

Esto no está automatizado (Coolify no expone una API estable para esto vía script desde aquí) — dos recursos, mismo repo:

1. **Recurso 1 (web pública):** apunta al `Dockerfile` de la raíz del repo del cliente.
2. **Recurso 2 (panel):** apunta a `Dockerfile.admin`.
3. En ambos, variables de entorno de build (`ARG`/`ENV` en los Dockerfile):
   - `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` (recurso 1, web)
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (recurso 2, panel)
   - Los cuatro valores son el **Project URL** y la **anon key** de la instancia Supabase del cliente (paso 1). Nunca la `service_role key`.
4. Configura el dominio HTTPS de cada recurso.

---

## 4. Primer acceso al panel

1. Entra a `https://panel-del-cliente.tudominio.com/login` con el email/contraseña que imprimió el script (o los que creaste a mano en Supabase Studio → Authentication).
2. Cambia la contraseña generada por una definitiva si no lo has hecho ya.

---

## 5. Configurar el cliente desde el panel (nada de esto va en código)

Todo lo que sigue se hace **dentro del panel**, con el usuario recién creado — es la parte que de verdad diferencia a un cliente de otro, y por diseño no toca ni una línea de código ni una variable de entorno:

| Sección del panel | Qué se configura |
|---|---|
| **Apariencia** (`/dashboard/settings`) | Nombre del proyecto, color primario, color de acento, tipografía, logo, favicon |
| **Contenido** (`/dashboard/content`) | Textos de Inicio, las 3 fichas de Servicio (renómbralas a los servicios reales del cliente), Contacto, y metadatos SEO — en ES y CA |
| **Integraciones** (`/dashboard/integrations`, solo Plan Pro/Enterprise) | Claves API de OpenAI/Gemini/Claude para el asistente de IA, y de Brevo/Mailchimp para el envío de correos del CRM |
| **Imágenes** (`/dashboard/images`) | Sube el material gráfico real del cliente (límite 20 en el plan base) |
| **Constructor de Páginas** (`/dashboard/pages`) | Páginas adicionales más allá de las 3 fichas de servicio (límite 5) |

Si el cliente tiene más o menos de 3 servicios, o necesita secciones distintas, ahí sí hace falta tocar código: edita `apps/admin/src/config/contentSchema.ts` (qué campos se editan) y, si cambian los slugs públicos, `apps/web/src/pages/[lang]/[...slug].astro` + `Navigation.astro` (ver `SKILL.md`, sección 4).

---

## Checklist rápido

Para cuando ya te sabes el procedimiento:

- [ ] Instancia Supabase self-hosted levantada para el cliente
- [ ] `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` anotados (temporalmente, solo en tu terminal)
- [ ] Repo vacío creado en GitHub
- [ ] `crear_cliente.sh` ejecutado con las 4 variables + contraseña del admin guardada
- [ ] 2 recursos en Coolify (web + panel) con sus variables `PUBLIC_`/`NEXT_PUBLIC_` (anon key, nunca service role)
- [ ] Dominios HTTPS configurados
- [ ] Login al panel probado y contraseña cambiada
- [ ] Apariencia, Contenido, Integraciones e Imágenes cargados con los datos reales del cliente

---

## Solución de problemas

**`psql: command not found`** — Instala el cliente de PostgreSQL en tu máquina; el script sigue con el resto y avisa de que aplicaste las migraciones a mano.

**Una migración falla a mitad (`ON_ERROR_STOP=1`)** — El script se detiene ahí mismo (no sigue aplicando migraciones posteriores sobre un esquema a medias). Revisa el mensaje de Postgres, corrige, y vuelve a correr *solo* las migraciones que falten con `psql "$DATABASE_URL" -f supabase/migrations/<archivo>.sql`. Todas las migraciones de este repo usan `IF NOT EXISTS` / `ON CONFLICT DO NOTHING`, así que re-ejecutar una que ya se aplicó no rompe nada.

**El script de creación de usuario responde con un HTTP distinto de 200/201** — Normalmente significa `SUPABASE_SERVICE_ROLE_KEY` incorrecta o `SUPABASE_URL` mal escrita (sin `https://`, con `/` final, etc.). El script imprime la respuesta cruda de la API para diagnosticarlo. Como alternativa, crea el usuario a mano desde Supabase Studio → Authentication → Add User.

**El panel carga pero el Kanban de Leads o la ficha de contacto dan error** — Casi seguro que faltó aplicar alguna migración. Revisa que `supabase/migrations/*_crm_history_and_contact_fields.sql` se haya ejecutado contra esa base de datos.

**Subir una imagen falla** — El bucket `web_images` no existe en esa instancia. Revisa que `supabase/migrations/*_storage_bucket_web_images.sql` se haya aplicado.
