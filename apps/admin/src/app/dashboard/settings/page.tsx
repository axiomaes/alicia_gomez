import { getSettings } from './actions'
import { SettingsEditor } from './SettingsEditor'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const initialSettings = await getSettings()

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración Visual</h1>
          <p className="text-zinc-500 mt-1">Personaliza el logo, colores y fuentes para adaptar el sistema a la marca de tu cliente.</p>
        </div>
      </div>

      <SettingsEditor initialSettings={initialSettings} />
    </div>
  )
}
