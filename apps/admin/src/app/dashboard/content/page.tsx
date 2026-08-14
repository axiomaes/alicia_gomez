import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ContentForm } from '@/components/content/ContentForm'

export default async function ContentPage(props: { searchParams: Promise<{ lang?: string, section?: string }> }) {
  const searchParams = await props.searchParams
  const lang = searchParams.lang || 'es'
  const section = searchParams.section || 'home'

  const supabase = await createClient()
  const { data: contents } = await supabase.from('content').select('*').eq('lang', lang)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Contenido Web</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Gestiona los textos e imágenes de la página pública.</p>
        </div>
        <div className="flex space-x-2 bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <Link href={`/dashboard/content?lang=es&section=${section}`} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${lang === 'es' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>Español</Link>
          <Link href={`/dashboard/content?lang=ca&section=${section}`} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${lang === 'ca' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>Català</Link>
        </div>
      </div>

      <ContentForm initialData={contents || []} lang={lang} currentSection={section} />
    </div>
  )
}
