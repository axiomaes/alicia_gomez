import type { FC } from 'react'
import { TablerIcon } from '../TablerIcon'

interface ContactInfoItem {
  icon?: string
  label: string
  value: string
}

interface ContactInfoProps {
  title?: string
  subtitle?: string
  items: ContactInfoItem[]
}

const ACCENT_BG = ['bg-primary/10 text-primary', 'bg-accent/10 text-accent', 'bg-slate-100 text-slate-600']

const ContactInfoBlock: FC<ContactInfoProps> = ({ title, subtitle, items }) => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">{title}</h1>}
            {subtitle && <p className="text-lg text-slate-600 leading-relaxed text-justify">{subtitle}</p>}
          </div>
        )}

        {items?.map((item, i) => {
          const colorClass = ACCENT_BG[i % ACCENT_BG.length]
          return (
            <div
              key={i}
              className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition"
            >
              {item.icon && (
                <div className={`size-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
                  <TablerIcon name={item.icon} size={24} />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-xl font-bold text-primary">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ContactInfoBlock
