"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Trash2, Edit3, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"
import { updatePageOrder, deletePage } from "./actions"

type Page = {
  id: string
  title: { es: string; ca: string }
  slug: { es: string; ca: string }
  is_published: boolean
  menu_order: number
}

export function PageList({ initialPages }: { initialPages: Page[] }) {
  const [pages, setPages] = useState(initialPages)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(pages)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update local state for immediate feedback
    const updatedItems = items.map((item, index) => ({ ...item, menu_order: index }))
    setPages(updatedItems)

    // Save to DB
    setIsUpdating(true)
    try {
      await updatePageOrder(updatedItems.map(p => ({ id: p.id, menu_order: p.menu_order })))
    } catch (e) {
      console.error(e)
      setPages(initialPages) // Revert on error
    }
    setIsUpdating(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta página?")) {
      await deletePage(id)
      setPages(pages.filter(p => p.id !== id))
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pages">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {pages.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">No hay páginas creadas todavía.</div>
              ) : (
                pages.map((page, index) => (
                  <Draggable key={page.id} draggableId={page.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-4 p-4 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 group transition-colors bg-white dark:bg-zinc-900"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing p-1"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-2">
                            {page.title.es || "Sin título"}
                            <span className="text-xs font-normal text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                              /{page.slug.es}
                            </span>
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                            <span className={`inline-flex items-center gap-1 ${page.is_published ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${page.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              {page.is_published ? "Publicada" : "Borrador"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/dashboard/pages/${page.id}`}
                            className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            title="Editar página"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Eliminar página"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
