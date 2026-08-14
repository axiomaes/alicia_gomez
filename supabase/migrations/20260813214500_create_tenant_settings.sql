CREATE TABLE IF NOT EXISTS public.tenant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_name TEXT NOT NULL DEFAULT 'Alicia Gómez Cuéllar',
    primary_color TEXT NOT NULL DEFAULT '#1A1A1A',
    accent_color TEXT NOT NULL DEFAULT '#B8975A',
    font_family TEXT NOT NULL DEFAULT 'cormorant-jost',
    logo_url TEXT,
    favicon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer la configuración pública (para el frontend)
CREATE POLICY "Enable read access for all users" ON public.tenant_settings FOR SELECT USING (true);

-- Solo administradores pueden modificar (esto dependerá de la autenticación de Supabase, 
-- por ahora si tienes roles, aquí lo restringes. Asumimos acceso admin general).
CREATE POLICY "Enable write access for authenticated users" ON public.tenant_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON public.tenant_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insertar valores por defecto para que exista al menos una fila
INSERT INTO public.tenant_settings (tenant_name, primary_color, accent_color, font_family, logo_url, favicon_url)
VALUES ('Alicia Gómez Cuéllar', '#1A1A1A', '#B8975A', 'cormorant-jost', '/logos/logo_alicia_gomez.svg', '/favicon.svg')
ON CONFLICT DO NOTHING;
