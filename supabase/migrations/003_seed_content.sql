-- Contenido real de Alicia Gómez Cuéllar, portado desde el sitio Astro
-- standalone anterior (repo alicia_gomez, commit ccf5ce2) a Axioma Starter.
--
-- El negocio es 100% online y de cobertura nacional (no específico de
-- Cataluña), así que 'es' y 'ca' llevan el mismo texto en español por ahora.
-- Si más adelante se traduce de verdad al catalán, basta con editar los
-- valores de lang='ca' desde el panel -> Contenido.
--
-- `content.value` es TEXT plano (no JSONB): sin comillas dobles embebidas.

INSERT INTO content (key, lang, value) VALUES

-- SEO
('seo_home_title', 'es', 'Alicia Gómez Cuéllar | Abogada Civil y Administrativa'),
('seo_home_desc', 'es', 'Asesoramiento legal honesto, valiente y comprometido. Especializada en Derecho Civil y Administrativo. Atención a particulares y empresas en toda España. Consultas 100% online.'),

-- Hero
('home.hero.badge', 'es', 'Presencial previa cita & consultas online'),
('home.hero.title', 'es', '&ldquo;Sin justicia, no hay libertad&rdquo;'),
('home.hero.subtitle', 'es', 'Asesoramiento legal honesto, valiente y comprometido. Especializada en Derecho Civil y Administrativo. Atención a particulares y empresas en todo el territorio nacional.'),
('home.hero.cta', 'es', 'Mensaje por WhatsApp'),
('home.hero.cta2', 'es', 'Nuestros servicios'),

-- Sobre mí
('home.about.text', 'es', '<h2>Alicia Gómez Cuéllar</h2><p><em>Abogada. Colegiada ICAM Nº 140626</em></p><p>Decidí dedicarme al Derecho por una razón clara: la búsqueda de la justicia. No rehúyo los asuntos complejos o poco convencionales; los enfrento con determinación, incluso cuando otros despachos los consideran inviables.</p><p>Trabajo exclusivamente en modalidad online, lo que me permite brindar un asesoramiento flexible, ágil y adaptado a las necesidades actuales de personas y empresas. El compromiso con cada cliente es total.</p>'),

-- Por qué elegirme (4 valores)
('home.feat1.title', 'es', 'Compromiso con la justicia'),
('home.feat1.desc', 'es', 'Me mueven principios firmes. Cada caso es una oportunidad para restaurar el equilibrio que el Derecho debe garantizar.'),
('home.feat1.icon', 'es', 'Clock'),
('home.feat2.title', 'es', 'Valentía ante lo difícil'),
('home.feat2.desc', 'es', 'Asumo asuntos que otros despachos rechazan por inviables. El estudio detallado me permite encontrar vías donde otros no las ven.'),
('home.feat2.icon', 'es', 'Bolt'),
('home.feat3.title', 'es', 'Atención cercana y realista'),
('home.feat3.desc', 'es', 'Formato 100% online, trato directo, flexible y adaptado a tu realidad. Sin desplazamientos ni demoras innecesarias.'),
('home.feat3.icon', 'es', 'Headset'),
('home.feat4.title', 'es', 'Experiencia y resultados'),
('home.feat4.desc', 'es', 'Desde particulares hasta empresas, resultados sólidos incluso en casos considerados perdidos o especialmente complejos.'),
('home.feat4.icon', 'es', 'ShieldCheck'),

-- Servicios (6)
('home.services.title', 'es', 'Servicios legales especializados'),
('home.services.subtitle', 'es', 'Asistencia enfocada tanto en procesos judiciales como en asesoramiento estratégico preventivo.'),
('home.srv1.title', 'es', 'Derecho Civil'),
('home.srv1.desc', 'es', 'Contratos, reclamaciones, arrendamientos y resolución de conflictos entre particulares con rapidez y eficacia.'),
('home.srv1.icon', 'es', 'Gavel'),
('home.srv2.title', 'es', 'Derecho Administrativo'),
('home.srv2.desc', 'es', 'Recursos ante la Administración, sanciones, licencias, procedimientos frente a organismos públicos.'),
('home.srv2.icon', 'es', 'BuildingBank'),
('home.srv3.title', 'es', 'Consultas legales online'),
('home.srv3.desc', 'es', 'Asesoramiento directo, fluido y desde cualquier lugar. Sin desplazamientos ni demoras innecesarias.'),
('home.srv3.icon', 'es', 'DeviceLaptop'),
('home.srv4.title', 'es', 'Asistencia a extranjeros'),
('home.srv4.desc', 'es', 'Apoyo completo a turistas, estudiantes y residentes temporales en inglés, facilitando su adaptación legal.'),
('home.srv4.icon', 'es', 'Language'),
('home.srv5.title', 'es', 'Asuntos complejos'),
('home.srv5.desc', 'es', 'Casos rechazados por otros despachos por considerarse inviables. Si existe una vía legal, se estudia y se defiende con valentía.'),
('home.srv5.icon', 'es', 'Brain'),
('home.srv6.title', 'es', 'Empresas y autónomos'),
('home.srv6.desc', 'es', 'Asistencia personalizada ante conflictos contractuales, administrativos o civiles. Protección íntegra para tu negocio.'),
('home.srv6.icon', 'es', 'Briefcase'),

-- Testimonios (4)
('home.testimonials.title', 'es', 'Testimonios reales'),
('home.testimonials.subtitle', 'es', 'La satisfacción de nuestros clientes es el reflejo de un trabajo honesto y de resultados.'),
('testi1.quote', 'es', 'Acudí a Alicia cuando otros abogados me dijeron que no valía la pena luchar. Conseguimos una resolución favorable.'),
('testi1.author', 'es', 'Cliente arrendadora (Madrid)'),
('testi2.quote', 'es', 'Pensé que no tenía opciones, pero Alicia analizó todo con claridad y me dio una solución que funcionó.'),
('testi2.author', 'es', 'Laura G.'),
('testi3.quote', 'es', 'La atención fue directa, sin rodeos ni tecnicismos. Me sentí acompañada en todo momento.'),
('testi3.author', 'es', 'Isabel M.'),
('testi4.quote', 'es', 'Otros abogados rechazaron mi caso. Alicia no solo lo aceptó, sino que lo ganó.'),
('testi4.author', 'es', 'Antonio R.'),

-- Contacto
('contact.hero.title', 'es', 'Iniciemos tu consulta'),
('contact.hero.subtitle', 'es', 'Estudio cada caso con minuciosidad. Describe tu situación de forma clara y me pondré en contacto contigo a la brevedad.'),
('contact.form.title', 'es', 'Envíanos un mensaje'),
('contact.form.subtitle', 'es', 'Te responderemos lo antes posible.'),

-- Footer y datos de empresa
('footer.brand', 'es', 'ABOGADA · ICAM 140626'),
('footer.desc', 'es', 'Asesoramiento legal riguroso y honesto. Especialistas en derecho Civil y Administrativo en todo el territorio nacional. 100% online.'),
('company.name', 'es', 'Alicia Gómez Cuéllar'),
('company.nif_label', 'es', 'Colegiada'),
('company.nif', 'es', 'ICAM Nº 140626'),
('footer.contact', 'es', 'Contacto'),
('company.phone', 'es', '+34 609 404 689'),
('company.email', 'es', 'aliciagomezabogada@outlook.com'),
('company.linkedin', 'es', 'https://www.linkedin.com/in/alicia-g%C3%B3mez-cu%C3%A9llar-515b65196/'),
('footer.hours', 'es', 'Horario de atención'),
('footer.days', 'es', 'Lunes a Viernes de 09:00 a 18:00'),
('footer.sede', 'es', 'Modalidad de atención'),
('company.address', 'es', 'Atención 100% online'),
('company.city', 'es', 'Cobertura en todo el territorio nacional'),
('footer.rights', 'es', 'Todos los derechos reservados.'),
('footer.legal', 'es', 'Aviso Legal y Privacidad'),

-- ==========================================
-- CATALÁN (ca) — mismo texto en español por ahora, ver nota de cabecera
-- ==========================================

('seo_home_title', 'ca', 'Alicia Gómez Cuéllar | Abogada Civil y Administrativa'),
('seo_home_desc', 'ca', 'Asesoramiento legal honesto, valiente y comprometido. Especializada en Derecho Civil y Administrativo. Atención a particulares y empresas en toda España. Consultas 100% online.'),
('home.hero.badge', 'ca', 'Presencial previa cita & consultas online'),
('home.hero.title', 'ca', '&ldquo;Sin justicia, no hay libertad&rdquo;'),
('home.hero.subtitle', 'ca', 'Asesoramiento legal honesto, valiente y comprometido. Especializada en Derecho Civil y Administrativo. Atención a particulares y empresas en todo el territorio nacional.'),
('home.hero.cta', 'ca', 'Mensaje por WhatsApp'),
('home.hero.cta2', 'ca', 'Nuestros servicios'),
('home.about.text', 'ca', '<h2>Alicia Gómez Cuéllar</h2><p><em>Abogada. Colegiada ICAM Nº 140626</em></p><p>Decidí dedicarme al Derecho por una razón clara: la búsqueda de la justicia. No rehúyo los asuntos complejos o poco convencionales; los enfrento con determinación, incluso cuando otros despachos los consideran inviables.</p><p>Trabajo exclusivamente en modalidad online, lo que me permite brindar un asesoramiento flexible, ágil y adaptado a las necesidades actuales de personas y empresas. El compromiso con cada cliente es total.</p>'),
('home.feat1.title', 'ca', 'Compromiso con la justicia'),
('home.feat1.desc', 'ca', 'Me mueven principios firmes. Cada caso es una oportunidad para restaurar el equilibrio que el Derecho debe garantizar.'),
('home.feat1.icon', 'ca', 'Clock'),
('home.feat2.title', 'ca', 'Valentía ante lo difícil'),
('home.feat2.desc', 'ca', 'Asumo asuntos que otros despachos rechazan por inviables. El estudio detallado me permite encontrar vías donde otros no las ven.'),
('home.feat2.icon', 'ca', 'Bolt'),
('home.feat3.title', 'ca', 'Atención cercana y realista'),
('home.feat3.desc', 'ca', 'Formato 100% online, trato directo, flexible y adaptado a tu realidad. Sin desplazamientos ni demoras innecesarias.'),
('home.feat3.icon', 'ca', 'Headset'),
('home.feat4.title', 'ca', 'Experiencia y resultados'),
('home.feat4.desc', 'ca', 'Desde particulares hasta empresas, resultados sólidos incluso en casos considerados perdidos o especialmente complejos.'),
('home.feat4.icon', 'ca', 'ShieldCheck'),
('home.services.title', 'ca', 'Servicios legales especializados'),
('home.services.subtitle', 'ca', 'Asistencia enfocada tanto en procesos judiciales como en asesoramiento estratégico preventivo.'),
('home.srv1.title', 'ca', 'Derecho Civil'),
('home.srv1.desc', 'ca', 'Contratos, reclamaciones, arrendamientos y resolución de conflictos entre particulares con rapidez y eficacia.'),
('home.srv1.icon', 'ca', 'Gavel'),
('home.srv2.title', 'ca', 'Derecho Administrativo'),
('home.srv2.desc', 'ca', 'Recursos ante la Administración, sanciones, licencias, procedimientos frente a organismos públicos.'),
('home.srv2.icon', 'ca', 'BuildingBank'),
('home.srv3.title', 'ca', 'Consultas legales online'),
('home.srv3.desc', 'ca', 'Asesoramiento directo, fluido y desde cualquier lugar. Sin desplazamientos ni demoras innecesarias.'),
('home.srv3.icon', 'ca', 'DeviceLaptop'),
('home.srv4.title', 'ca', 'Asistencia a extranjeros'),
('home.srv4.desc', 'ca', 'Apoyo completo a turistas, estudiantes y residentes temporales en inglés, facilitando su adaptación legal.'),
('home.srv4.icon', 'ca', 'Language'),
('home.srv5.title', 'ca', 'Asuntos complejos'),
('home.srv5.desc', 'ca', 'Casos rechazados por otros despachos por considerarse inviables. Si existe una vía legal, se estudia y se defiende con valentía.'),
('home.srv5.icon', 'ca', 'Brain'),
('home.srv6.title', 'ca', 'Empresas y autónomos'),
('home.srv6.desc', 'ca', 'Asistencia personalizada ante conflictos contractuales, administrativos o civiles. Protección íntegra para tu negocio.'),
('home.srv6.icon', 'ca', 'Briefcase'),
('home.testimonials.title', 'ca', 'Testimonios reales'),
('home.testimonials.subtitle', 'ca', 'La satisfacción de nuestros clientes es el reflejo de un trabajo honesto y de resultados.'),
('testi1.quote', 'ca', 'Acudí a Alicia cuando otros abogados me dijeron que no valía la pena luchar. Conseguimos una resolución favorable.'),
('testi1.author', 'ca', 'Cliente arrendadora (Madrid)'),
('testi2.quote', 'ca', 'Pensé que no tenía opciones, pero Alicia analizó todo con claridad y me dio una solución que funcionó.'),
('testi2.author', 'ca', 'Laura G.'),
('testi3.quote', 'ca', 'La atención fue directa, sin rodeos ni tecnicismos. Me sentí acompañada en todo momento.'),
('testi3.author', 'ca', 'Isabel M.'),
('testi4.quote', 'ca', 'Otros abogados rechazaron mi caso. Alicia no solo lo aceptó, sino que lo ganó.'),
('testi4.author', 'ca', 'Antonio R.'),
('contact.hero.title', 'ca', 'Iniciemos tu consulta'),
('contact.hero.subtitle', 'ca', 'Estudio cada caso con minuciosidad. Describe tu situación de forma clara y me pondré en contacto contigo a la brevedad.'),
('contact.form.title', 'ca', 'Envíanos un mensaje'),
('contact.form.subtitle', 'ca', 'Te responderemos lo antes posible.'),
('footer.brand', 'ca', 'ABOGADA · ICAM 140626'),
('footer.desc', 'ca', 'Asesoramiento legal riguroso y honesto. Especialistas en derecho Civil y Administrativo en todo el territorio nacional. 100% online.'),
('company.name', 'ca', 'Alicia Gómez Cuéllar'),
('company.nif_label', 'ca', 'Colegiada'),
('company.nif', 'ca', 'ICAM Nº 140626'),
('footer.contact', 'ca', 'Contacto'),
('company.phone', 'ca', '+34 609 404 689'),
('company.email', 'ca', 'aliciagomezabogada@outlook.com'),
('company.linkedin', 'ca', 'https://www.linkedin.com/in/alicia-g%C3%B3mez-cu%C3%A9llar-515b65196/'),
('footer.hours', 'ca', 'Horario de atención'),
('footer.days', 'ca', 'Lunes a Viernes de 09:00 a 18:00'),
('footer.sede', 'ca', 'Modalidad de atención'),
('company.address', 'ca', 'Atención 100% online'),
('company.city', 'ca', 'Cobertura en todo el territorio nacional'),
('footer.rights', 'ca', 'Todos los derechos reservados.'),
('footer.legal', 'ca', 'Aviso Legal y Privacidad')

ON CONFLICT (key, lang) DO UPDATE SET value = EXCLUDED.value;
