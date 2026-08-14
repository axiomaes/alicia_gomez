import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData()
    const name = data.get('name')?.toString().trim()
    const email = data.get('email')?.toString().trim()
    const phone = data.get('phone')?.toString().trim()
    const message = data.get('message')?.toString().trim()
    const service = data.get('service')?.toString()

    // Honeypot: campo invisible para humanos. Si viene relleno, es un bot.
    const honeypot = data.get('company_website')?.toString()
    if (honeypot) {
      // Respondemos éxito sin escribir nada, para no darle pistas al bot.
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 })
    }

    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: 'El email no tiene un formato válido' }), { status: 400 })
    }

    // 1. Insert or update contact
    let contactId = null
    const { data: existingContacts } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existingContacts && existingContacts.length > 0) {
      contactId = existingContacts[0].id
    } else {
      // Create new contact
      const { data: newContact, error: contactError } = await supabase
        .from('contacts')
        .insert([{ name, email, phone }])
        .select()
        .single()
      
      if (!contactError && newContact) {
        contactId = newContact.id
      }
    }

    // 2. Insert form submission
    const fullMessage = service ? `Servicio: ${service}\n\n${message}` : message

    const { error: submitError } = await supabase
      .from('form_submissions')
      .insert([{
        contact_id: contactId,
        name,
        email,
        message: fullMessage
      }])

    if (submitError) {
      console.error('Submit error:', submitError)
      return new Response(JSON.stringify({ error: 'Error al guardar el mensaje' }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 })
  }
}
