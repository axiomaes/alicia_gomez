"use client"
import React, { useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { updateLeadStatus } from './actions'
import { Mail, Phone, MapPin, Calendar, Search, Clock } from 'lucide-react'
import Link from 'next/link'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  created_at: string
  updated_at?: string
  estimated_value?: number | null
  address?: string
  city?: string
  postal_code?: string
}

interface KanbanBoardProps {
  initialContacts: Contact[]
}

const columns = [
  { id: 'new', title: 'Nuevos' },
  { id: 'contacted', title: 'Contactados' },
  { id: 'qualified', title: 'Presupuestados' },
  { id: 'customer', title: 'Clientes' },
  { id: 'lost', title: 'Perdidos' },
]

// Pasadas estas horas sin que nadie toque el lead (nota, correo o cambio de
// estado), lo marcamos como "frío" — es la señal que evita perder una venta
// por olvido. No aplica a leads ya cerrados (ganados o perdidos).
const COLD_HOURS = 48
const ACTIVE_STATUSES = new Set(['new', 'contacted', 'qualified'])

const currencyFmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

function isCold(contact: Contact): boolean {
  if (!ACTIVE_STATUSES.has(contact.status)) return false
  const last = new Date(contact.updated_at || contact.created_at).getTime()
  return Date.now() - last > COLD_HOURS * 60 * 60 * 1000
}

export default function KanbanBoard({ initialContacts }: KanbanBoardProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [search, setSearch] = useState('')

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    // If dropped outside a valid droppable or didn't move
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const contactToMove = contacts.find(c => c.id === draggableId)
    if (!contactToMove) return

    const newStatus = destination.droppableId

    // Optimistic UI update
    const newContacts = contacts.map(c =>
      c.id === draggableId ? { ...c, status: newStatus } : c
    )
    setContacts(newContacts)

    // Backend update
    const res = await updateLeadStatus(draggableId, newStatus)
    if (res?.error) {
      alert(res.error)
      // Revert if error
      setContacts(contacts)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return contacts
    return contacts.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    )
  }, [contacts, search])

  const getContactsByStatus = (status: string) => filtered.filter(c => c.status === status)

  const coldCount = useMemo(() => contacts.filter(isCold).length, [contacts])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {coldCount > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            {coldCount} {coldCount === 1 ? 'lead sin tocar' : 'leads sin tocar'} hace más de {COLD_HOURS}h
          </span>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x pt-4">
          {columns.map(col => {
            const colContacts = getContactsByStatus(col.id)
            const colTotal = colContacts.reduce((sum, c) => sum + (c.estimated_value || 0), 0)
            return (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-w-[320px] max-w-[320px] flex-shrink-0 snap-start bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl p-4 transition-colors border border-transparent ${
                      snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 px-1">
                      <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">{col.title}</h3>
                      <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {colContacts.length}
                      </span>
                    </div>
                    {colTotal > 0 && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 px-1 mb-3 font-medium">{currencyFmt.format(colTotal)}</p>
                    )}

                    <div className="space-y-3 min-h-[150px] mt-3">
                      {colContacts.map((contact, index) => {
                        const cold = isCold(contact)
                        return (
                          <Draggable key={contact.id} draggableId={contact.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white dark:bg-zinc-950 p-4 rounded-xl shadow-sm border ${
                                  snapshot.isDragging ? 'shadow-lg border-indigo-500 scale-[1.02] z-50' : cold ? 'border-amber-300 dark:border-amber-800/60' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                } transition-all group`}
                              >
                                <Link href={`/dashboard/leads/${contact.id}`} className="block">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                      {contact.name}
                                    </h4>
                                    {cold && (
                                      <span title={`Sin tocar hace más de ${COLD_HOURS}h`} className="shrink-0 mt-1 w-2 h-2 rounded-full bg-amber-500" />
                                    )}
                                  </div>
                                  {!!contact.estimated_value && (
                                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{currencyFmt.format(contact.estimated_value)}</p>
                                  )}
                                  <div className="space-y-1.5 mt-3">
                                    {contact.phone && (
                                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5" />
                                        {contact.phone}
                                      </p>
                                    )}
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                      <Mail className="w-3.5 h-3.5" />
                                      <span className="truncate">{contact.email}</span>
                                    </p>
                                    {contact.city && (
                                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {contact.city}
                                      </p>
                                    )}
                                  </div>
                                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(contact.created_at).toLocaleDateString()}</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline">Ver ficha</span>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
