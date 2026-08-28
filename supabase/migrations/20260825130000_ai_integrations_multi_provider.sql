-- Permite tener varios proveedores de IA activos a la vez (antes: UNIQUE por
-- provider_type, como mucho una fila 'ai_llm' guardada en total -- si el
-- proveedor activo se quedaba sin tokens, no había forma de tener otro ya
-- configurado como respaldo). El email sigue siendo un único proveedor: la
-- capa de guardado (saveEmailIntegration) se encarga de que nunca haya dos
-- filas 'email' a la vez, así que ampliar la constraint no cambia ese
-- comportamiento.
--
-- Nombre de la constraint confirmado contra la base de datos real de este
-- repo (docker exec supabase-db-... psql -c "select conname from
-- pg_constraint where conrelid = 'tenant_integrations'::regclass") el
-- 25/08/2026: tenant_integrations_provider_type_key.

ALTER TABLE public.tenant_integrations
  DROP CONSTRAINT IF EXISTS tenant_integrations_provider_type_key;

ALTER TABLE public.tenant_integrations
  ADD CONSTRAINT tenant_integrations_provider_type_provider_name_key
  UNIQUE (provider_type, provider_name);
