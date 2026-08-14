import { useState, type FC } from 'react'

interface ServiceOption {
  label: string
}

interface ContactFormProps {
  title: string
  subtitle?: string
  formId?: string
  serviceOptions?: ServiceOption[]
  submitLabel?: string
  privacyText?: string
}

const ContactFormBlock: FC<ContactFormProps> = ({ title, subtitle, formId, serviceOptions, submitLabel, privacyText }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar el formulario')
      }

      setStatus('success')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Error al conectar con el servidor')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="py-12 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 text-center">
           <h2 className="text-2xl font-bold text-primary mb-4">¡Mensaje Enviado!</h2>
           <p className="text-slate-600">Nos pondremos en contacto contigo lo antes posible.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-6">
      <div className="max-w-xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-12 translate-x-12" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">{title}</h2>
          {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
        </div>

        <form id={formId} className="space-y-6" onSubmit={handleSubmit}>
          {/* Honeypot antispam: invisible para personas, los bots lo rellenan igualmente */}
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] w-px h-px overflow-hidden"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-2">Nombre Completo</label>
              <input
                type="text"
                name="name"
                placeholder="Ej: Juan Pérez"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-2">Teléfono</label>
              <input
                type="tel"
                name="phone"
                placeholder="+34"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase px-2">Email de Contacto</label>
            <input
              type="email"
              name="email"
              placeholder="juan@ejemplo.com"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              required
            />
          </div>

          {serviceOptions && serviceOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-2">Tipo de Servicio</label>
              <select name="service" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition appearance-none cursor-pointer">
                <option value="">Seleccione una opción...</option>
                {serviceOptions.map((opt, i) => (
                  <option key={i} value={opt.label}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase px-2">Mensaje o Detalles</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Describa brevemente su necesidad..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
              required
            />
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent transition-all shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {status === 'loading' ? 'Enviando...' : (submitLabel || 'Enviar Solicitud')}
            </button>
            {privacyText && (
              <p className="text-[10px] text-slate-400 text-center mt-4 px-6 text-balance">{privacyText}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactFormBlock
