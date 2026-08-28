'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Actualizar estado de un Lead
export async function updateLeadStatus(contactId: string, newStatus: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('contacts')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', contactId)

  if (error) {
    console.error('Error updating status:', error)
    return { error: 'No se pudo actualizar el estado' }
  }
  revalidatePath('/dashboard/leads')
  return { success: true }
}

// Actualizar el valor estimado (€) de un lead — es lo que permite calcular
// el pipeline presupuestado en el Kanban y en el Resumen.
export async function updateLeadValue(contactId: string, formData: FormData) {
  const raw = (formData.get('estimated_value') as string) ?? ''
  const estimated_value = raw.trim() === '' ? null : Number(raw.replace(',', '.'))

  if (estimated_value !== null && (Number.isNaN(estimated_value) || estimated_value < 0)) {
    return { error: 'El valor estimado debe ser un número positivo' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('contacts')
    .update({ estimated_value, updated_at: new Date().toISOString() })
    .eq('id', contactId)

  if (error) {
    console.error('Error updating estimated value:', error)
    return { error: 'No se pudo actualizar el valor estimado' }
  }
  revalidatePath('/dashboard/leads')
  revalidatePath(`/dashboard/leads/${contactId}`)
  return { success: true }
}

// Crear un nuevo Lead manualmente
export async function createLead(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const postal_code = formData.get('postal_code') as string
  const rawValue = (formData.get('estimated_value') as string) ?? ''
  const estimated_value = rawValue.trim() === '' ? null : Number(rawValue.replace(',', '.'))

  if (!name || !email) {
    return { error: 'Nombre y correo son obligatorios' }
  }
  if (estimated_value !== null && Number.isNaN(estimated_value)) {
    return { error: 'El valor estimado debe ser un número' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('contacts')
    .insert([{
      name,
      email,
      phone,
      address,
      city,
      postal_code,
      estimated_value,
      status: 'new'
    }])

  if (error) {
    console.error('Error creating lead:', error)
    return { error: 'No se pudo crear el lead' }
  }
  revalidatePath('/dashboard/leads')
  return { success: true }
}

// Añadir una nota interna
export async function addNote(formData: FormData) {
  const contactId = formData.get('contactId') as string
  const note = formData.get('note') as string

  if (!contactId || !note) {
    return { error: 'Faltan campos' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_notes')
    .insert([{ contact_id: contactId, note }])

  if (error) {
    console.error('Error adding note:', error)
    return { error: 'No se pudo añadir la nota' }
  }

  // Una nota cuenta como "tocar" el lead, igual que cambiar el estado o enviar un correo.
  await supabase.from('contacts').update({ updated_at: new Date().toISOString() }).eq('id', contactId)

  revalidatePath(`/dashboard/leads/${contactId}`)
  return { success: true }
}

// Resuelve el proveedor de email activo del tenant (BYOK) y el remitente a usar.
// Mismo patrón que checkAiIntegrations()/getAiModel() en actions/ai.ts: la clave
// vive en tenant_integrations, nunca en variables de entorno fijas.
async function resolveEmailSender(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: integration } = await supabase
    .from('tenant_integrations')
    .select('*')
    .eq('provider_type', 'email')
    .single()

  if (!integration || !integration.is_active || !integration.api_key) {
    throw new Error('El envío de correo no está configurado. Ve a Integraciones y activa un proveedor de email con su clave API.')
  }

  const [{ data: tenant }, { data: contentRow }] = await Promise.all([
    supabase.from('tenant_settings').select('tenant_name').limit(1).single(),
    supabase.from('content').select('value').eq('key', 'company.email').limit(1).maybeSingle(),
  ])

  const senderName = tenant?.tenant_name || 'Equipo Comercial'
  let senderEmail = 'no-reply@example.com'
  if (contentRow?.value) {
    try {
      const parsed = JSON.parse(contentRow.value)
      if (typeof parsed === 'string' && parsed.includes('@')) senderEmail = parsed
    } catch {
      if (typeof contentRow.value === 'string' && contentRow.value.includes('@')) senderEmail = contentRow.value
    }
  }

  return { integration, senderName, senderEmail }
}

async function sendViaBrevo(apiKey: string, sender: { name: string; email: string }, to: { email: string; name: string }, subject: string, html: string) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ sender, to: [to], subject, htmlContent: html })
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Error enviando correo con Brevo:', errorData)
    throw new Error('No se pudo enviar el correo con Brevo')
  }
}

async function sendViaMailchimp(apiKey: string, sender: { name: string; email: string }, to: { email: string; name: string }, subject: string, html: string) {
  // Mailchimp Transactional (Mandrill) API
  const response = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: apiKey,
      message: {
        from_email: sender.email,
        from_name: sender.name,
        to: [{ email: to.email, name: to.name, type: 'to' }],
        subject,
        html
      }
    })
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Error enviando correo con Mailchimp:', errorData)
    throw new Error('No se pudo enviar el correo con Mailchimp')
  }
}

// Enviar email y registrarlo en el historial
export async function sendEmail(formData: FormData) {
  const contactId = formData.get('contactId') as string
  const toEmail = formData.get('toEmail') as string
  const toName = formData.get('toName') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  if (!contactId || !toEmail || !subject || !message) {
    return { error: 'Faltan campos requeridos' }
  }

  const supabase = await createClient()

  try {
    const { integration, senderName, senderEmail } = await resolveEmailSender(supabase)
    const htmlContent = `<p>${message.replace(/\n/g, '<br/>')}</p>`
    const sender = { name: senderName, email: senderEmail }
    const to = { email: toEmail, name: toName }

    if (integration.provider_name === 'mailchimp') {
      await sendViaMailchimp(integration.api_key, sender, to, subject, htmlContent)
    } else {
      await sendViaBrevo(integration.api_key, sender, to, subject, htmlContent)
    }

    // Registrar email en contact_emails
    await supabase
      .from('contact_emails')
      .insert([{
        contact_id: contactId,
        subject,
        body: message
      }])

    // Enviar un correo siempre cuenta como "tocar" el lead; además, si seguía
    // en "Nuevo" lo pasamos a "Contactado".
    await supabase.from('contacts').update({ updated_at: new Date().toISOString() }).eq('id', contactId)
    await supabase
      .from('contacts')
      .update({ status: 'contacted' })
      .eq('id', contactId)
      .eq('status', 'new') // Solo si es nuevo

    revalidatePath('/dashboard/leads')
    revalidatePath(`/dashboard/leads/${contactId}`)
    return { success: true }

  } catch (error: any) {
    console.error('Excepción al enviar correo:', error)
    return { error: error.message || 'Error del servidor' }
  }
}
