-- Columnas nuevas en tenant_integrations, sin usar por los 4 proveedores
-- de siempre (OpenAI/Gemini/Claude/Groq, sus endpoints/modelos siguen
-- hardcodeados en getAiModel()) -- solo las necesita Prudencia.ai, la IA
-- juridica que ya usa Alicia, porque no tiene endpoint ni modelo fijo
-- conocido de antemano (no publica documentacion tecnica).
ALTER TABLE public.tenant_integrations
  ADD COLUMN IF NOT EXISTS base_url TEXT,
  ADD COLUMN IF NOT EXISTS model_override TEXT;
