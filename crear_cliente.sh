#!/bin/bash
# Uso:
#   ./crear_cliente.sh <nombre_cliente> <url_repositorio_nuevo>
#
# El resto de la configuración (base de datos y usuario admin) se pasa por
# variables de entorno, NUNCA como argumentos posicionales ni dentro de un
# archivo del repo del cliente — para que un secreto no acabe commiteado por
# el `git add .` de este mismo script.
#
#   DATABASE_URL               Cadena de conexión Postgres del Supabase self-hosted
#                               del cliente (la misma que usarías con `psql`):
#                               postgresql://postgres:TU_PASSWORD@TU_HOST:5432/postgres
#
#   SUPABASE_URL                URL pública de esa misma instancia self-hosted
#                               (la que usarías como PUBLIC_SUPABASE_URL), p.ej.
#                               https://supabase-cliente.tudominio.com
#
#   SUPABASE_SERVICE_ROLE_KEY   Service role key de esa instancia. Se usa una
#                               sola vez, solo para crear el primer usuario del
#                               panel vía la Admin API de Auth — no se guarda en
#                               ningún fichero del proyecto (el admin panel solo
#                               usa la anon key + RLS, por diseño).
#
#   ADMIN_EMAIL                 Email del primer usuario del panel de control.
#   ADMIN_PASSWORD               Opcional. Si no se indica, se genera una
#                               aleatoria y se imprime una sola vez al final.
#
# Ejemplo completo:
#   DATABASE_URL="postgresql://postgres:pass@host:5432/postgres" \
#   SUPABASE_URL="https://supabase-cliente.tudominio.com" \
#   SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
#   ADMIN_EMAIL="cliente@axioma-creativa.es" \
#   ./crear_cliente.sh nombre-cliente git@github.com:axioma-creativa/nombre-cliente.git
#
# Cualquiera de los tres bloques (migraciones / usuario admin) se puede omitir
# sin más: el script avisa de lo que falta y qué hacer a mano.

set -e

CLIENTE=$1
REPO_URL=$2

if [ -z "$CLIENTE" ] || [ -z "$REPO_URL" ]; then
  echo "Uso: ./crear_cliente.sh <nombre_cliente> <url_repositorio_nuevo>"
  echo "(Base de datos y usuario admin se configuran por variables de entorno — ver cabecera del script)"
  exit 1
fi

echo "🚀 Clonando Axioma Starter para el cliente: $CLIENTE..."
git clone --depth 1 https://github.com/axioma-creativa/axioma-starter.git "$CLIENTE"
cd "$CLIENTE"

echo "🧹 Limpiando historial anterior..."
rm -rf .git

echo "📦 Inicializando nuevo repositorio..."
git init -q
git add .
git commit -q -m "Initial commit from Axioma Starter"
git branch -M main
git remote add origin "$REPO_URL"

# --- 1. Base de datos: aplicar todas las migraciones -------------------------
if [ -n "$DATABASE_URL" ]; then
  if ! command -v psql >/dev/null 2>&1; then
    echo "⚠️  psql no está instalado en esta máquina — no puedo aplicar las migraciones automáticamente."
    echo "    Instálalo (o ejecútalas a mano) contra el Supabase self-hosted de $CLIENTE."
  else
    echo "🗄️  Aplicando TODAS las migraciones de supabase/migrations/ contra la base de datos de $CLIENTE..."
    for migration in $(ls supabase/migrations/*.sql | sort); do
      echo "   -> $(basename "$migration")"
      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$migration"
    done
    echo "✅ Base de datos lista: esquema, RLS, contenido genérico, bucket 'web_images' y tabla de integraciones."
  fi
else
  echo "ℹ️  No se ha pasado DATABASE_URL: recuerda aplicar TODAS las migraciones de supabase/migrations/"
  echo "    (en el orden en que aparecen) contra el Supabase self-hosted de $CLIENTE antes de dar el proyecto por listo."
fi

# --- 2. Primer usuario del panel (Auth Admin API) -----------------------------
ADMIN_USER_CREATED=0
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && [ -n "$ADMIN_EMAIL" ]; then
  if ! command -v curl >/dev/null 2>&1; then
    echo "⚠️  curl no está instalado — no puedo crear el usuario admin automáticamente."
  else
    if [ -z "$ADMIN_PASSWORD" ]; then
      ADMIN_PASSWORD=$(openssl rand -base64 18 2>/dev/null || echo "Cambia-esta-clave-$RANDOM$RANDOM")
      ADMIN_PASSWORD_GENERATED=1
    fi

    echo "👤 Creando usuario admin ($ADMIN_EMAIL) en $SUPABASE_URL ..."
    # `|| HTTP_STATUS="000"` es a propósito: con `set -e`, un fallo de conexión (no solo
    # un HTTP de error) mataría el script entero aquí y nos dejaríamos el `git push` y el
    # resumen final sin ejecutar. Preferimos degradar a "avisa y sigue".
    HTTP_STATUS=$(curl -s -o /tmp/crear_cliente_admin_response.json -w "%{http_code}" \
      -X POST "$SUPABASE_URL/auth/v1/admin/users" \
      -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
      -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\",\"email_confirm\":true}") || HTTP_STATUS="000"

    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "201" ]; then
      echo "✅ Usuario admin creado."
      ADMIN_USER_CREATED=1
    else
      echo "⚠️  No se pudo crear el usuario admin (HTTP $HTTP_STATUS). Respuesta:"
      cat /tmp/crear_cliente_admin_response.json 2>/dev/null
      echo ""
      echo "    Créalo a mano desde Supabase Studio -> Authentication."
    fi
    rm -f /tmp/crear_cliente_admin_response.json
  fi
else
  echo "ℹ️  No se han pasado SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ADMIN_EMAIL:"
  echo "    crea el primer usuario a mano desde Supabase Studio -> Authentication."
fi

echo "☁️  Subiendo a GitHub para que Coolify lo intercepte..."
git push -u origin main

cat <<EOF

✅ Listo! Proyecto $CLIENTE subido a $REPO_URL.

👉 Lo que queda, y no se puede automatizar desde aquí:
   1. Coolify: crea los dos recursos (Dockerfile y Dockerfile.admin) apuntando a este repo.
   2. Variables de entorno: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY y PUBLIC_SUPABASE_URL/ANON_KEY
      del proyecto Supabase self-hosted de $CLIENTE (ver .env.example).
   3. Entra al panel -> Apariencia e Integraciones, y carga ahí logo, colores, teléfono, email
      y claves API reales del cliente. Nada de esto va en variables de entorno ni en código.
EOF

if [ "$ADMIN_USER_CREATED" = "1" ]; then
  echo "   4. Primer acceso al panel:"
  echo "         Email:    $ADMIN_EMAIL"
  if [ "$ADMIN_PASSWORD_GENERATED" = "1" ]; then
    echo "         Password: $ADMIN_PASSWORD   (generada ahora, no se guarda en ningún sitio — apúntala o cámbiala al entrar)"
  else
    echo "         Password: la que indicaste en ADMIN_PASSWORD"
  fi
else
  echo "   4. Supabase Studio -> Authentication: crea el primer usuario para poder entrar al panel."
fi
