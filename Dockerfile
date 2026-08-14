FROM node:22-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo@2.10.9
COPY . .
# Aísla solo lo que necesita `web` (su package.json + los paquetes internos de
# los que depende), en vez de instalar el monorepo entero (Next.js, Tiptap,
# los SDKs de IA de `admin`...) solo para construir un sitio Astro. Antes de
# este cambio, `npm install --legacy-peer-deps` sobre el repo completo era
# la causa del OOM kill en el build (ver Dockerfile.admin, que ya usaba esta
# misma técnica correctamente para `admin`).
RUN turbo prune web --docker

FROM node:22-alpine AS builder
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci --legacy-peer-deps

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY

RUN npm install -g turbo@2.10.9
RUN turbo run build --filter=web

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/web ./apps/web

EXPOSE 4321
ENV HOST=0.0.0.0
ENV PORT=4321

CMD ["npm", "run", "start", "--workspace=web"]
