import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Mail, Phone, MapPin, ArrowLeft, Clock, MessageSquare, Plus, FileText } from 'lucide-react'
import Link from 'next/link'
import { addNote, sendEmail, updateLeadStatus, updateLeadValue } from '../actions'
import { LeadAIAssistant } from './LeadAIAssistant'

export default async function LeadDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Obtener detalles del contacto
  const { data: contact } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!contact) {
    notFound()
  }

  // Obtener notas
  const { data: notes } = await supabase
    .from('contact_notes')
    .select('*')
    .eq('contact_id', params.id)
    .order('created_at', { ascending: false })

  // Obtener emails
  const { data: emails } = await supabase
    .from('contact_emails')
    .select('*')
    .eq('contact_id', params.id)
    .order('sent_at', { ascending: false })

  // Obtener envíos de formularios desde la web
  const { data: formSubmissions } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('contact_id', params.id)
    .eq('contact_id', params.id)
    .order('created_at', { ascending: false })

  const activityMessages = [
    ...(notes || []).map(n => n.note),
    ...(emails || []).map(e => e.body),
    ...(formSubmissions || []).map(s => s.message)
  ].filter(Boolean)

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <Link href="/dashboard/leads" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Volver al tablero
      </Link>

      {/* Header Profile */}
      <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">{contact.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {contact.email}</span>
            {contact.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {contact.phone}</span>}
            {(contact.address || contact.city) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> 
                {[contact.address, contact.city, contact.postal_code].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          {/* Valor Estimado */}
          <div className="flex flex-col items-end gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Valor Estimado</label>
            <form action={async (formData) => {
              "use server"
              await updateLeadValue(contact.id, formData)
            }}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">€</span>
                <input
                  type="number"
                  name="estimated_value"
                  min="0"
                  step="0.01"
                  defaultValue={contact.estimated_value ?? ''}
                  onBlur={(e) => e.target.form?.requestSubmit()}
                  placeholder="0"
                  className="w-32 pl-7 pr-3 py-2 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </form>
          </div>

          {/* Cambiar Estado */}
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Estado Actual</label>
            <form action={async (formData) => {
              "use server"
              await updateLeadStatus(contact.id, formData.get('status') as string)
            }}>
              <select
                name="status"
                defaultValue={contact.status || 'new'}
                onChange={(e) => e.target.form?.requestSubmit()}
                className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="new">Nuevo</option>
                <option value="contacted">Contactado</option>
                <option value="qualified">Presupuestado</option>
                <option value="customer">Cliente</option>
                <option value="lost">Perdido</option>
              </select>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Notas y Emails Historial */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Formulario Nueva Nota */}
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> 
              Añadir Nota Interna
            </h3>
            <form action={async (formData) => {
              "use server"
              await addNote(formData)
            }}>
              <input type="hidden" name="contactId" value={contact.id} />
              <textarea
                name="note"
                rows={3}
                placeholder="Escribe detalles de una llamada, presupuesto o recordatorio..."
                required
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all resize-y mb-3"
              ></textarea>
              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-lg font-medium text-sm transition-colors">
                  <Plus className="w-4 h-4" /> Guardar Nota
                </button>
              </div>
            </form>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Actividad Reciente</h3>
            
            <div className="space-y-6">
              {/* Combinar y ordenar cronológicamente */}
              {[
                ...(notes || []).map(n => ({ ...n, type: 'note', date: new Date(n.created_at) })),
                ...(emails || []).map(e => ({ ...e, type: 'email', date: new Date(e.sent_at) })),
                ...(formSubmissions || []).map(s => ({ ...s, type: 'submission', date: new Date(s.created_at) }))
              ].sort((a, b) => b.date.getTime() - a.date.getTime()).map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      item.type === 'note' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                      item.type === 'email' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {item.type === 'note' && <FileText className="w-4 h-4" />}
                      {item.type === 'email' && <Mail className="w-4 h-4" />}
                      {item.type === 'submission' && <MessageSquare className="w-4 h-4" />}
                    </div>
                    {i !== 0 && <div className="w-px h-full bg-zinc-200 dark:bg-zinc-800 mt-2"></div>}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                        {item.type === 'note' && 'Nota interna'}
                        {item.type === 'email' && 'Correo enviado'}
                        {item.type === 'submission' && 'Mensaje recibido desde la web'}
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.date.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 mt-2">
                      {item.type === 'email' && <p className="text-sm font-semibold mb-2">Asunto: {item.subject}</p>}
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                        {item.note || item.body || item.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {(!notes?.length && !emails?.length && !formSubmissions?.length) && (
                <p className="text-center text-sm text-zinc-500 py-4">No hay actividad registrada para este lead.</p>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Enviar Correo */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <LeadAIAssistant contactName={contact.name} messages={activityMessages} />
            
            <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-500" />
              Redactar Correo
            </h3>
            <form action={async (formData) => {
              "use server"
              await sendEmail(formData)
            }}>
              <input type="hidden" name="contactId" value={contact.id} />
              <input type="hidden" name="toEmail" value={contact.email} />
              <input type="hidden" name="toName" value={contact.name} />
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Para</label>
                  <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                    {contact.email}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Asunto</label>
                  <input 
                    type="text" 
                    name="subject" 
                    placeholder="Escribe el asunto..." 
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Mensaje</label>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Escribe el cuerpo del correo..."
                    required
                    className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all resize-y"
                  ></textarea>
                </div>
                <button type="submit" className="w-full flex justify-center items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                  <Mail className="w-4 h-4" /> Enviar Correo
                </button>
                <p className="text-xs text-zinc-500 text-center mt-2">
                  El correo se enviará usando Brevo y quedará registrado en el historial.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
