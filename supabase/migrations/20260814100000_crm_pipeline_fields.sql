-- Campos mínimos para que el Mini-CRM del plan Starter responda a las dos
-- preguntas que más hace un dueño de pyme: "¿cuánto tengo presupuestado?" y
-- "¿a quién se me está enfriando un lead?".

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS estimated_value NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now());

-- `updated_at` se toca a mano desde las server actions (cambio de estado, nota
-- añadida, correo enviado) en vez de con un trigger genérico: así representa
-- "última vez que un humano tocó este lead", no cualquier UPDATE de la fila.

CREATE INDEX IF NOT EXISTS idx_contacts_updated_at ON public.contacts(updated_at);
