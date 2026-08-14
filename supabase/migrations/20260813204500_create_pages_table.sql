-- Tabla para almacenar las páginas dinámicas
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug JSONB NOT NULL, -- ej: {"es": "ofertas", "ca": "ofertes"}
    title JSONB NOT NULL, -- ej: {"es": "Ofertas", "ca": "Ofertes"}
    meta_description JSONB,
    content JSONB, -- Almacena el array de bloques por idioma
    is_published BOOLEAN DEFAULT false,
    menu_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Trigger para asegurar que no se creen más de 5 páginas en total
CREATE OR REPLACE FUNCTION public.check_page_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM public.pages) >= 5 THEN
    RAISE EXCEPTION 'Límite máximo de 5 páginas alcanzado para este cliente.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_page_limit ON public.pages;

CREATE TRIGGER enforce_page_limit
BEFORE INSERT ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.check_page_limit();

-- Habilitar RLS (Row Level Security) y crear políticas para que sean accesibles
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (cualquiera puede leer las páginas publicadas)
CREATE POLICY "Las páginas publicadas son visibles para todos."
ON public.pages FOR SELECT
USING (is_published = true);

-- Políticas para usuarios autenticados (Panel Admin)
CREATE POLICY "Los usuarios autenticados pueden leer todas las páginas."
ON public.pages FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Los usuarios autenticados pueden insertar páginas."
ON public.pages FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Los usuarios autenticados pueden actualizar páginas."
ON public.pages FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Los usuarios autenticados pueden eliminar páginas."
ON public.pages FOR DELETE
TO authenticated
USING (true);
