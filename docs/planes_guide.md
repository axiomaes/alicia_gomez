# Guía de Planes: Axioma Starter

Documento de referencia para el equipo de marketing al construir la página de precios. Es la fuente técnica de verdad — qué existe hoy, en qué plan, y qué es todavía intención de producto — no copy de ventas terminado. Adapta el tono libremente; no prometas nada que aquí figure como "Roadmap".

**Leyenda:**
- ✅ Construido y en producción hoy.
- 🔜 Roadmap — vendible como "próximamente" o como módulo a medida, no como algo que el cliente puede usar el día 1.
- 💰 Add-on de pago único, no incluido en la cuota mensual.

---

## 1. Precios

| Plan | Precio | Alternativa anual |
|---|---|---|
| **Starter** | €29 / mes | €290 / año (2 meses gratis) |
| **Pro** | €49 / mes | €490 / año (2 meses gratis) |
| **Enterprise** | €89–149 / mes (según módulos) | — |

**Oferta Fundadora (primeros 5 clientes):** €0 de setup + €29/mes con compromiso de 1 año, a cambio de testimonio en vídeo + reseña de 5 estrellas en Google.

---

## 2. Matriz general (Web + CMS)

| Funcionalidad | Starter | Pro | Enterprise |
|---|:---:|:---:|:---:|
| Web pública en Astro, SSL + Hosting | ✅ | ✅ | ✅ |
| Editor de contenidos (CMS) — textos, imágenes, SEO | ✅ | ✅ | ✅ |
| Botón Mágico de IA (mejora/corrige/SEO en el editor) | — | ✅ | ✅ |
| Constructor de Páginas dinámicas | ✅ (hasta 5) | ✅ (hasta 5)* | ✅ (hasta 5)* |
| Galería de imágenes | ✅ (hasta 20) | ✅ (hasta 20)* | ✅ (hasta 20)* |
| Blog | ✅ | ✅ | ✅ |
| GEO (`llms.txt`, JSON-LD, sitemap dinámico) | ✅ | ✅ | ✅ |
| Panel de Integraciones (BYOK: OpenAI/Gemini/Claude) | — | ✅ | ✅ |
| Soberanía de datos / Certificado RGPD Premium | — | ✅ | ✅ |
| Notificaciones instantáneas (Telegram/WhatsApp) | — | 🔜 | 🔜 |
| Multi-idioma (ES/CA ya vienen de fábrica; más idiomas) | ES/CA incluidos | ES/CA incluidos | 💰 +€200 único |
| Módulo de Citas y Reservas | — | — | 💰 +€150 único |
| Soporte técnico | Email | Email + 1h/mes cambios | Email + 1h/mes cambios |
| SEO / Campañas Ads recurrentes | — | — | 💰 +€30/mes |

\* *El límite de 5 páginas / 20 imágenes es hoy el mismo en los tres planes (es un tope técnico del starter, no un contador ligado a `subscription_plan` todavía). Si Pro/Enterprise van a vender un límite mayor, hay que construirlo antes de anunciarlo — ver nota en §5.*

---

## 3. Matriz del Mini-CRM (el detalle que motiva este documento)

El Mini-CRM del plan Starter no es una versión recortada simbólica: cubre todo el ciclo básico de "no perder un lead" sin depender de IA ni de módulos de pago. Esto es lo que diferencia cada plan, funcionalidad por funcionalidad:

| Funcionalidad del CRM | Starter | Pro | Enterprise |
|---|:---:|:---:|:---:|
| Formulario web → entra directo al CRM (con protección antispam) | ✅ | ✅ | ✅ |
| Tablero Kanban (Nuevo / Contactado / Presupuestado / Cliente / Perdido) | ✅ | ✅ | ✅ |
| Alta manual de leads (llamada, visita, walk-in) | ✅ | ✅ | ✅ |
| Ficha 360º: notas internas + historial de correos + mensajes web, en una sola línea de tiempo | ✅ | ✅ | ✅ |
| Buscador de leads (nombre / email / teléfono) | ✅ | ✅ | ✅ |
| Valor estimado (€) por lead + pipeline presupuestado en tiempo real | ✅ | ✅ | ✅ |
| Aviso de leads fríos (sin tocar en 48h) | ✅ | ✅ | ✅ |
| Exportar leads a CSV | ✅ | ✅ | ✅ |
| Dashboard con métricas (pipeline activo, tasa de conversión, nuevos de la semana) | ✅ | ✅ | ✅ |
| Envío de correo al lead desde la ficha (Brevo/Mailchimp, BYOK) | ⚠️ ver nota | ✅ | ✅ |
| Copiloto de Ventas IA (resumen del lead + borrador de respuesta) | — | ✅ | ✅ |
| Asignación de leads a comercial / vista "mis leads" | — | — | 🔜 |
| Origen del lead (UTM / campaña) | — | — | 🔜 |
| Recordatorios y tareas por lead | — | — | 🔜 (junto al Módulo de Citas) |
| Informes exportables / analítica de tendencia | — | — | 🔜 |

> ⚠️ **Nota para producto, no para la web todavía:** hoy el envío de correo desde el CRM (Brevo/Mailchimp) está disponible sin restricción de plan en el código — solo el asistente de IA está bloqueado para Starter. El resto de esta guía asume que el envío de correo sigue el mismo criterio que ya promete la guía de marketing original ("el Panel de Integraciones se habilita en Pro"), pero eso todavía no está aplicado en el panel. Antes de publicar la tabla de arriba tal cual, alguien tiene que decidir: ¿el envío de correo va con Starter (y el CRM de entrada se vende como "más completo de lo que parece") o se bloquea junto con la IA en Pro (y la tabla ya es 100% cierta)? Es un cambio de una tarde en el panel de Integraciones, pero es una decisión de producto, no técnica — lo dejo señalado para no decidirlo por mi cuenta.

### Por qué la línea de corte está donde está

- **Todo lo que ya está en el Starter** (buscador, valor estimado, aviso de leads fríos, CSV, dashboard) es barato de mantener y no depende de terceros — es lo mínimo para que un "Mini CRM" se gane el nombre, no una limitación artificial para forzar el upsell.
- **Lo que se reserva para Pro/Enterprise** (asignación por comercial, origen de campaña, recordatorios, informes) sí requiere trabajo real (roles de usuario, tracking de UTM, un sistema de tareas) y encaja con lo que ya se vende en esos planes — especialmente el origen del lead, que es literalmente lo que demuestra el ROI del add-on de SEO/Ads (+€30/mes).

---

## 4. Perfil de cliente por plan (heredado de la guía comercial)

- **Starter:** autónomos y pymes que solo necesitan estar en internet con buena imagen y no perder leads. Reformas, instaladores, limpieza, mudanzas.
- **Pro:** negocios que ya reciben tráfico y quieren aprovecharlo mejor — RGPD como argumento de confianza, soporte con margen para cambios rápidos.
- **Enterprise:** pymes asentadas con procesos propios (reservas, multi-idioma, campañas activas) que necesitan el starter como base pero con módulos a medida.

---

## 5. Pendientes antes de publicar (para no prometer de más)

1. Decidir el plan del envío de correo del CRM (nota de §3).
2. Los límites de 5 páginas / 20 imágenes son iguales en los tres planes hoy — si la web va a decir "más páginas en Enterprise", hay que ligar esos límites a `subscription_plan` primero (ya existe el hook de UI para el aviso de límite, falta la lógica diferenciada).
3. "Notificaciones instantáneas Telegram/WhatsApp" (Pro) y todos los módulos marcados 🔜 no tienen código todavía — son roadmap vendible como "disponible a medida", no como funcionalidad ya activa.
