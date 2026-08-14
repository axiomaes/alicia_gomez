import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import { PageList } from './PageList'
import { createPage } from './actions'
import { PlanLimitNotice } from '@/components/ui/PlanLimitNotice'

export const dynamic = 'force-dynamic'

const MAX_PAGES = 5

export default async function PagesDashboard() {
  const supabase = await createClient()

  const [{ data: pages, error }, { data: tenant }] = await Promise.all([
    supabase.from('pages').select('id, title, slug, is_published, menu_order').order('menu_order', { ascending: true }),
    supabase.from('tenant_settings').select('subscription_plan').limit(1).single(),
  ])

  if (error) {
    console.error(error)
  }

  const count = pages?.length || 0
  const isLimitReached = count >= MAX_PAGES

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Constructor de Páginas</h1>
          <p className="text-zinc-500 mt-1">Crea y gestiona páginas dinámicas (máximo {MAX_PAGES}). Arrastra para reordenarlas en el menú.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {count} / {MAX_PAGES} páginas
          </div>
          <form action={createPage}>
            <button
              type="submit"
              disabled={isLimitReached}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isLimitReached
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              <Plus className="w-4 h-4" />
              Nueva Página
            </button>
          </form>
        </div>
      </div>

      {isLimitReached && (
        <PlanLimitNotice resource="páginas" limit={MAX_PAGES} plan={tenant?.subscription_plan} />
      )}

      <PageList initialPages={pages || []} />
    </div>
  )
}
