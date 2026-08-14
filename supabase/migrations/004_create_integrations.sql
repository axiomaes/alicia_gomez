-- Migración para crear la tabla de integraciones y actualizar tenant_settings

-- 1. Añadir el plan de suscripción a tenant_settings
ALTER TABLE public.tenant_settings
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'starter';

-- 2. Crear tabla de integraciones
CREATE TABLE IF NOT EXISTS public.tenant_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type TEXT NOT NULL, -- 'ai_llm' o 'email'
    provider_name TEXT NOT NULL, -- 'openai', 'gemini', 'claude', 'brevo', 'mailchimp'
    api_key TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE (provider_type) -- Solo un proveedor activo por tipo
);

-- Habilitar RLS
ALTER TABLE public.tenant_integrations ENABLE ROW LEVEL SECURITY;

-- Políticas (Solo usuarios autenticados pueden ver y modificar)
CREATE POLICY "Enable all access for authenticated users" 
ON public.tenant_integrations FOR ALL 
USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

-- Insertar integraciones por defecto inactivas (para que la UI las lea si se prefiere)
INSERT INTO public.tenant_integrations (provider_type, provider_name, is_active)
VALUES 
('ai_llm', 'openai', false),
('email', 'brevo', false)
ON CONFLICT (provider_type) DO NOTHING;
