-- Alinea el esquema versionado con lo que el CMS/CRM ya da por hecho:
-- columnas de `contacts` usadas por el Kanban/ficha de lead, y las tablas
-- de historial `contact_notes` / `contact_emails` que hasta ahora solo
-- existían en la base de datos de producción (nunca se habían migrado).

-- 1. Campos de ficha del lead (Kanban, dirección, estado del funnel)
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT;

ALTER TABLE public.contacts
  DROP CONSTRAINT IF EXISTS contacts_status_check;

ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_status_check
  CHECK (status IN ('new', 'contacted', 'qualified', 'customer', 'lost'));

-- 2. Notas internas del comercial sobre un lead
CREATE TABLE IF NOT EXISTS public.contact_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access contact_notes"
ON public.contact_notes FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 3. Historial de correos enviados desde la ficha del lead
CREATE TABLE IF NOT EXISTS public.contact_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access contact_emails"
ON public.contact_emails FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Índices para las consultas por lead que hace la ficha 360º
CREATE INDEX IF NOT EXISTS idx_contact_notes_contact_id ON public.contact_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_emails_contact_id ON public.contact_emails(contact_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
