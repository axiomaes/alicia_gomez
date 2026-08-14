import { Lock } from 'lucide-react'

// CTA de upsell reutilizable para los límites por plan (páginas, imágenes...).
// No hay billing self-service en este panel: el "upgrade" es un contacto directo
// con la agencia, que es quien cambia `tenant_settings.subscription_plan` a mano.
export function PlanLimitNotice({ resource, limit, plan }: { resource: string; limit: number; plan?: string | null }) {
  const planLabel = plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Starter'

  return (
    <div className="flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
        <Lock className="w-5 h-5" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          Has alcanzado el límite de {limit} {resource} de tu plan {planLabel}.
        </p>
        <p className="text-sm text-amber-800/80 dark:text-amber-300/80">
          Para ampliar este límite o pasar a un plan superior, contacta con tu agencia.
        </p>
        <a
          href="mailto:axio@axioma-creativa.es?subject=Ampliar%20límite%20de%20plan"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-900 dark:text-amber-200 underline underline-offset-2 hover:no-underline"
        >
          Solicitar ampliación de plan
        </a>
      </div>
    </div>
  )
}
