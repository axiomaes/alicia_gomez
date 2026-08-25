export type FieldType = 'text' | 'textarea' | 'image' | 'richtext' | 'icon'

export interface FieldConfig {
  key: string
  label: string
  type: FieldType
  description?: string
}

export interface SectionConfig {
  id: string
  title: string
  fields: FieldConfig[]
}

// Contenido de la página de Alicia Gómez Cuéllar. Todo vive en una sola
// página (Home) con secciones por ancla — no hay fichas de servicio ni
// contacto separadas, así que este schema no las incluye.
export const contentSchema: SectionConfig[] = [
  {
    id: 'home',
    title: 'Portada',
    fields: [
      { key: 'home.hero.badge', label: 'Hero: Etiqueta superior', type: 'text' },
      { key: 'home.hero.title', label: 'Hero: Título', type: 'richtext' },
      { key: 'home.hero.subtitle', label: 'Hero: Subtítulo', type: 'richtext' },
      { key: 'home.hero.image', label: 'Hero: Imagen de fondo', type: 'image' },
      { key: 'home.hero.cta', label: 'Hero: Botón principal (WhatsApp)', type: 'text' },
      { key: 'home.hero.cta2', label: 'Hero: Botón secundario (ir a Servicios)', type: 'text' },

      { key: 'home.about.text', label: 'Sobre mí (incluye el título como <h2>)', type: 'richtext', description: 'Se renderiza tal cual como HTML: usa <h2>, <p>, <em>...' },

      { key: 'home.feat1.title', label: 'Por qué elegirme 1: Título', type: 'text' },
      { key: 'home.feat1.desc', label: 'Por qué elegirme 1: Descripción', type: 'textarea' },
      { key: 'home.feat1.icon', label: 'Por qué elegirme 1: Icono (Tabler)', type: 'icon' },
      { key: 'home.feat2.title', label: 'Por qué elegirme 2: Título', type: 'text' },
      { key: 'home.feat2.desc', label: 'Por qué elegirme 2: Descripción', type: 'textarea' },
      { key: 'home.feat2.icon', label: 'Por qué elegirme 2: Icono (Tabler)', type: 'icon' },
      { key: 'home.feat3.title', label: 'Por qué elegirme 3: Título', type: 'text' },
      { key: 'home.feat3.desc', label: 'Por qué elegirme 3: Descripción', type: 'textarea' },
      { key: 'home.feat3.icon', label: 'Por qué elegirme 3: Icono (Tabler)', type: 'icon' },
      { key: 'home.feat4.title', label: 'Por qué elegirme 4: Título', type: 'text' },
      { key: 'home.feat4.desc', label: 'Por qué elegirme 4: Descripción', type: 'textarea' },
      { key: 'home.feat4.icon', label: 'Por qué elegirme 4: Icono (Tabler)', type: 'icon' },

      { key: 'home.services.title', label: 'Servicios: Título de sección', type: 'text' },
      { key: 'home.services.subtitle', label: 'Servicios: Subtítulo de sección', type: 'textarea' },
      { key: 'home.srv1.title', label: 'Servicio 1: Título', type: 'text' },
      { key: 'home.srv1.desc', label: 'Servicio 1: Descripción', type: 'textarea' },
      { key: 'home.srv1.icon', label: 'Servicio 1: Icono (Tabler)', type: 'icon' },
      { key: 'home.srv2.title', label: 'Servicio 2: Título', type: 'text' },
      { key: 'home.srv2.desc', label: 'Servicio 2: Descripción', type: 'textarea' },
      { key: 'home.srv2.icon', label: 'Servicio 2: Icono (Tabler)', type: 'icon' },
      { key: 'home.srv3.title', label: 'Servicio 3: Título', type: 'text' },
      { key: 'home.srv3.desc', label: 'Servicio 3: Descripción', type: 'textarea' },
      { key: 'home.srv3.icon', label: 'Servicio 3: Icono (Tabler)', type: 'icon' },
      { key: 'home.srv4.title', label: 'Servicio 4: Título', type: 'text' },
      { key: 'home.srv4.desc', label: 'Servicio 4: Descripción', type: 'textarea' },
      { key: 'home.srv4.icon', label: 'Servicio 4: Icono (Tabler)', type: 'icon' },
      { key: 'home.srv5.title', label: 'Servicio 5: Título', type: 'text' },
      { key: 'home.srv5.desc', label: 'Servicio 5: Descripción', type: 'textarea' },
      { key: 'home.srv5.icon', label: 'Servicio 5: Icono (Tabler)', type: 'icon' },
      { key: 'home.srv6.title', label: 'Servicio 6: Título', type: 'text' },
      { key: 'home.srv6.desc', label: 'Servicio 6: Descripción', type: 'textarea' },
      { key: 'home.srv6.icon', label: 'Servicio 6: Icono (Tabler)', type: 'icon' },

      { key: 'home.testimonials.title', label: 'Testimonios: Título de sección', type: 'text' },
      { key: 'home.testimonials.subtitle', label: 'Testimonios: Subtítulo de sección', type: 'textarea' },
      { key: 'testi1.quote', label: 'Testimonio 1: Cita', type: 'textarea' },
      { key: 'testi1.author', label: 'Testimonio 1: Autor/a', type: 'text' },
      { key: 'testi2.quote', label: 'Testimonio 2: Cita', type: 'textarea' },
      { key: 'testi2.author', label: 'Testimonio 2: Autor/a', type: 'text' },
      { key: 'testi3.quote', label: 'Testimonio 3: Cita', type: 'textarea' },
      { key: 'testi3.author', label: 'Testimonio 3: Autor/a', type: 'text' },
      { key: 'testi4.quote', label: 'Testimonio 4: Cita', type: 'textarea' },
      { key: 'testi4.author', label: 'Testimonio 4: Autor/a', type: 'text' },

      { key: 'contact.hero.title', label: 'Contacto: Título', type: 'text' },
      { key: 'contact.hero.subtitle', label: 'Contacto: Subtítulo', type: 'textarea' },
      { key: 'contact.form.title', label: 'Contacto: Título del formulario', type: 'text' },
      { key: 'contact.form.subtitle', label: 'Contacto: Subtítulo del formulario', type: 'text' },
    ]
  },
  {
    id: 'empresa',
    title: 'Datos de Contacto y Footer',
    fields: [
      { key: 'company.name', label: 'Nombre', type: 'text' },
      { key: 'company.nif_label', label: 'Etiqueta del colegiado/NIF (ej: "Colegiada")', type: 'text' },
      { key: 'company.nif', label: 'Nº de colegiada / NIF', type: 'text' },
      { key: 'company.phone', label: 'Teléfono / WhatsApp', type: 'text', description: 'Formato internacional, ej: +34 609 404 689. Se usa para el botón de WhatsApp y el formulario de contacto.' },
      { key: 'company.email', label: 'Email', type: 'text' },
      { key: 'company.linkedin', label: 'URL de LinkedIn', type: 'text' },
      { key: 'company.address', label: 'Modalidad / Dirección', type: 'text' },
      { key: 'company.city', label: 'Cobertura / Ciudad', type: 'text' },
      { key: 'footer.brand', label: 'Footer: Etiqueta bajo el nombre', type: 'text' },
      { key: 'footer.desc', label: 'Footer: Descripción', type: 'textarea' },
      { key: 'footer.contact', label: 'Footer: Título columna contacto', type: 'text' },
      { key: 'footer.hours', label: 'Footer: Etiqueta de horario', type: 'text' },
      { key: 'footer.days', label: 'Footer: Horario', type: 'text' },
      { key: 'footer.sede', label: 'Footer: Título columna modalidad', type: 'text' },
      { key: 'footer.rights', label: 'Footer: Derechos reservados', type: 'text' },
      { key: 'footer.legal', label: 'Footer: Aviso legal', type: 'text' },
    ]
  },
  {
    id: 'seo',
    title: 'SEO (Metadatos)',
    fields: [
      { key: 'seo_home_title', label: 'Título SEO', type: 'text' },
      { key: 'seo_home_desc', label: 'Descripción SEO', type: 'textarea' },
    ]
  }
]
