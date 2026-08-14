import { createClient } from '@/utils/supabase/server'
import KanbanBoard from './KanbanBoard'
import { Download } from 'lucide-react'
import CreateLeadModal from './CreateLeadModal'

const currencyFmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const ACTIVE_STATUSES = new Set(['new', 'contacted', 'qualified'])

export default async function LeadsPage() {
  const supabase = await createClient()

  // Obtener contactos para el Kanban
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  const pipelineValue = (contacts || [])
    .filter(c => ACTIVE_STATUSES.has(c.status))
    .reduce((sum, c) => sum + (c.estimated_value || 0), 0)

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">CRM y Leads</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Gestiona el progreso de tus prospectos de cliente arrastrando las tarjetas.</p>
          {pipelineValue > 0 && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">
              Pipeline activo (nuevos + contactados + presupuestados): <strong className="text-indigo-600 dark:text-indigo-400">{currencyFmt.format(pipelineValue)}</strong>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/leads/export"
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </a>
          <CreateLeadModal />
        </div>
      </div>

      <div className="w-full relative">
        {/* Kanban Board Component */}
        {contacts ? (
          <KanbanBoard initialContacts={contacts} />
        ) : (
          <div className="p-12 text-center text-zinc-500">
            Error cargando los leads.
          </div>
        )}
      </div>
    </div>
  )
}
