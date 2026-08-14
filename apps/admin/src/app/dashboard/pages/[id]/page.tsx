import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { PageEditor } from './PageEditor'

export const dynamic = 'force-dynamic'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !page) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Página</h1>
          <p className="text-zinc-500 mt-1">Configura el SEO, la URL y construye los bloques de tu página.</p>
        </div>
      </div>

      <PageEditor initialData={page} />
    </div>
  )
}
