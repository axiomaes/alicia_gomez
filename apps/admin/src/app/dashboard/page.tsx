import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

const currencyFmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const ACTIVE_STATUSES = new Set(['new', 'contacted', 'qualified'])
const COLD_HOURS = 48

export default async function DashboardOverview() {
  const supabase = await createClient()

  const [
    { data: contacts },
    { count: submissionsCount },
    { count: imagesCount },
    { count: blogsCount },
  ] = await Promise.all([
    supabase.from('contacts').select('status, estimated_value, created_at, updated_at'),
    supabase.from('form_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('images').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
  ])

  const allContacts = contacts || []
  const totalLeads = allContacts.length
  const customers = allContacts.filter(c => c.status === 'customer').length

  const pipelineValue = allContacts
    .filter(c => ACTIVE_STATUSES.has(c.status))
    .reduce((sum, c) => sum + (c.estimated_value || 0), 0)

  const coldLeads = allContacts.filter(c => {
    if (!ACTIVE_STATUSES.has(c.status)) return false
    const last = new Date(c.updated_at || c.created_at).getTime()
    return Date.now() - last > COLD_HOURS * 60 * 60 * 1000
  }).length

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const newThisWeek = allContacts.filter(c => new Date(c.created_at).getTime() >= sevenDaysAgo).length

  const conversionRate = totalLeads > 0 ? Math.round((customers / totalLeads) * 100) : 0

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Resumen</h1>
        <p className="text-zinc-400 mt-2">Bienvenido a tu panel de Axioma CMS.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">CRM y Leads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Pipeline Activo" value={currencyFmt.format(pipelineValue)} raw />
          <StatCard
            title="Leads sin Tocar"
            value={coldLeads}
            suffix=" (+48h)"
            warn={coldLeads > 0}
          />
          <StatCard title="Nuevos esta Semana" value={newThisWeek} />
          <StatCard title="Tasa de Conversión" value={`${conversionRate}%`} raw hint={`${customers} de ${totalLeads} leads`} />
        </div>
        {coldLeads > 0 && (
          <Link href="/dashboard/leads" className="inline-block mt-4 text-sm text-amber-400 hover:text-amber-300 font-medium">
            → Revisar los leads sin tocar
          </Link>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Contenido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Mensajes Recibidos" value={submissionsCount ?? 0} />
          <StatCard title="Leads / Contactos" value={totalLeads} />
          <StatCard title="Artículos del Blog" value={blogsCount ?? 0} />
          <StatCard title="Imágenes Subidas" value={imagesCount ?? 0} suffix=" / 20" />
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-4">
          <a href="/dashboard/leads" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Ver Leads
          </a>
          <a href="/dashboard/blogs" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-lg font-medium transition-colors">
            Escribir Artículo
          </a>
          <a href="/dashboard/images" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-lg font-medium transition-colors">
            Subir Imagen
          </a>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  suffix = "",
  hint,
  warn = false,
  raw = false,
}: {
  title: string
  value: number | string
  suffix?: string
  hint?: string
  warn?: boolean
  raw?: boolean
}) {
  return (
    <div className={`bg-zinc-900/50 backdrop-blur-md border p-6 rounded-2xl shadow-sm ${warn ? 'border-amber-800/60' : 'border-zinc-800'}`}>
      <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`font-bold tracking-tight ${raw ? 'text-3xl' : 'text-4xl'} ${warn ? 'text-amber-400' : 'text-white'}`}>{value}</span>
        {suffix && <span className="text-zinc-500 font-medium">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-zinc-500 mt-1">{hint}</p>}
    </div>
  )
}
