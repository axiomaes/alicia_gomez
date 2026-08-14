-- Añadir columna de idioma a la tabla content
ALTER TABLE content ADD COLUMN lang VARCHAR(10) NOT NULL DEFAULT 'es';

-- Eliminar la restricción UNIQUE anterior sobre la columna 'key'
ALTER TABLE content DROP CONSTRAINT content_key_key;

-- Añadir una nueva restricción UNIQUE combinada para 'key' y 'lang'
ALTER TABLE content ADD CONSTRAINT content_key_lang_key UNIQUE (key, lang);
