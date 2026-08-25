-- Módulo de Base de Conocimiento (pública, indexable, mismo patrón que `blogs`).

CREATE TABLE knowledge_base_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published kb articles" ON knowledge_base_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admins full access kb articles" ON knowledge_base_articles FOR ALL USING (auth.role() = 'authenticated');

-- GRANT base de Postgres -- idempotente (GRANT/ALTER DEFAULT PRIVILEGES no
-- fallan al repetirse), cubre tanto las tablas existentes como la nueva de
-- una vez. Las políticas de arriba siguen siendo la barrera real fila a
-- fila; esto solo asegura que anon/authenticated puedan siquiera intentar
-- la consulta a nivel de tabla (ver el bug del formulario de contacto).
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;
