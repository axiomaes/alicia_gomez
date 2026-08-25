import { generateContentDraft } from '@/actions/ai'
import { createDraftFromAi } from './actions'
import { ContentAssistant } from './ContentAssistant'

export default function ContentAssistantPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Asistente IA de Contenido</h1>
        <p className="text-zinc-400 mt-2">
          Genera un primer borrador para el Blog, un post de LinkedIn o un artículo de la Base de Conocimiento a partir de un tema.
        </p>
      </div>

      <ContentAssistant generateDraft={generateContentDraft} createDraft={createDraftFromAi} />
    </div>
  )
}
