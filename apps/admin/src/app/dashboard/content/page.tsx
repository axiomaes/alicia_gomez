import { createClient } from '@/utils/supabase/server'
import { ContentForm } from '@/components/content/ContentForm'

export default async function ContentPage(props: { searchParams: Promise<{ section?: string }> }) {
  const searchParams = await props.searchParams
  // Un solo idioma (castellano) -- el catalán venía de otro cliente base y
  // generaba confusión (Alicia no lo necesita). Si en el futuro hace falta
  // otro idioma, se vuelve a añadir el selector aquí.
  const lang = 'es'
  const section = searchParams.section || 'home'

  const supabase = await createClient()
  const { data: contents } = await supabase.from('content').select('*').eq('lang', lang)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Contenido Web</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Gestiona los textos e imágenes de la página pública.</p>
      </div>

      <ContentForm initialData={contents || []} lang={lang} currentSection={section} />
    </div>
  )
}
