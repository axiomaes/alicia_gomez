-- Antes esto era un paso manual del SKILL.md ("crea un bucket público en el
-- dashboard de Supabase y configura sus políticas RLS a mano"), que es exactamente
-- el tipo de paso no versionado que causó la deriva de esquema documentada en la
-- auditoría. Se versiona aquí para que aplicar todas las migraciones de la carpeta
-- sea suficiente para dejar el Storage listo, sin clicks manuales en el dashboard.
--
-- Compatible con Supabase self-hosted y cloud: ambos exponen el storage sobre las
-- mismas tablas de Postgres (storage.buckets / storage.objects).

INSERT INTO storage.buckets (id, name, public)
VALUES ('web_images', 'web_images', true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "web_images public read" ON storage.objects;
CREATE POLICY "web_images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'web_images');

DROP POLICY IF EXISTS "web_images authenticated insert" ON storage.objects;
CREATE POLICY "web_images authenticated insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'web_images');

DROP POLICY IF EXISTS "web_images authenticated update" ON storage.objects;
CREATE POLICY "web_images authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'web_images');

DROP POLICY IF EXISTS "web_images authenticated delete" ON storage.objects;
CREATE POLICY "web_images authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'web_images');
