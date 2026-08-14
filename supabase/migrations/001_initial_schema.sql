-- Tabla para almacenar textos dinámicos de la web
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL, -- ejemplo: 'hero_title', 'about_description'
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para rastrear imágenes (con un conteo o límite a nivel de app)
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contactos o leads (clientes registrados manual o por form)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes de formulario
CREATE TABLE form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, replied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para el Blog
CREATE TABLE blogs (
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

-- Row Level Security (RLS) policies
-- NOTA: Por simplicidad, se recomienda habilitar RLS y que:
-- 1. `content`, `blogs` (is_published=true), `images` sean seleccionables (SELECT) por roles anónimos (public).
-- 2. `form_submissions` e insert_contact permita INSERT para roles anónimos.
-- 3. Todo tenga acceso total (ALL) para roles autenticados (admin panel).

-- Ejemplo rápido de policies (requiere alter table enable row level security):
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read content" ON content FOR SELECT USING (true);
CREATE POLICY "Public can read images" ON images FOR SELECT USING (true);
CREATE POLICY "Public can read published blogs" ON blogs FOR SELECT USING (is_published = true);

CREATE POLICY "Public can insert form submissions" ON form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert contacts" ON contacts FOR INSERT WITH CHECK (true);

-- Authenticated (Admins) can do everything
CREATE POLICY "Admins full access content" ON content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access images" ON images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access form_submissions" ON form_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
