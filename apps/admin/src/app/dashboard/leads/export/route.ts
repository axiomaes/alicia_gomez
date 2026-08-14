import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Vive bajo /dashboard/leads/export a propósito: el middleware protege todo lo
// que empieza por /dashboard, así que esta ruta hereda la misma comprobación de
// sesión sin tener que duplicar lógica de auth aquí.

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const supabase = await createClient()
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('name, email, phone, status, estimated_value, address, city, postal_code, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'No se pudieron obtener los leads' }, { status: 500 })
  }

  const statusLabels: Record<string, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    qualified: 'Presupuestado',
    customer: 'Cliente',
    lost: 'Perdido',
  }

  const headers = ['Nombre', 'Email', 'Teléfono', 'Estado', 'Valor estimado (€)', 'Dirección', 'Ciudad', 'Código Postal', 'Creado', 'Última actividad']
  const rows = (contacts || []).map(c => [
    c.name,
    c.email,
    c.phone,
    statusLabels[c.status] || c.status,
    c.estimated_value ?? '',
    c.address,
    c.city,
    c.postal_code,
    c.created_at ? new Date(c.created_at).toLocaleString('es-ES') : '',
    c.updated_at ? new Date(c.updated_at).toLocaleString('es-ES') : '',
  ])

  const csv = [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\n')
  // BOM para que Excel abra los acentos correctamente
  const csvWithBom = '﻿' + csv

  return new NextResponse(csvWithBom, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
