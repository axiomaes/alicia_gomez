FROM node:22-alpine AS base
WORKDIR /app
# Instalar turbo globalmente (opcional, pero útil)
RUN npm install -g turbo@2.10.9

FROM base AS builder
# Copiar todo el código
COPY . .
# Instalar dependencias de todo el monorepo
RUN npm install --legacy-peer-deps

# Configurar variables de entorno requeridas para el build de Astro
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY

# Construir solo la aplicación web (Astro)
RUN turbo run build --filter=web

FROM base AS runner
# Copiar solo lo necesario para que funcione Astro, evitando copiar apps/admin y basura que causa error de memoria (OOM) o falta de disco
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/web ./apps/web

# Exponer el puerto de Astro
EXPOSE 4321
ENV HOST=0.0.0.0
ENV PORT=4321

# Iniciar la aplicación web
CMD ["npm", "run", "start", "--workspace=web"]
