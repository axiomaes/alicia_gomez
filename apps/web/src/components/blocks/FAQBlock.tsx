import type { FC } from 'react'
import { parseDesign, parseItemDesign, type DesignData, type ItemDesignData } from '../../lib/styleMapper'
import { TablerIcon } from '../TablerIcon'

interface FAQItem extends ItemDesignData {
  id?: string
  question: string
  answer: string
}

interface FAQProps extends DesignData {
  title?: string
  subtitle?: string
  faqs?: FAQItem[]
}

const FAQBlock: FC<FAQProps> = (props) => {
  const { title, subtitle, faqs = [] } = props
  const design = parseDesign(props)

  return (
    <section className={`py-24 px-6 ${design.classes}`} style={design.styles}>
      <div className="max-w-4xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>}
            {subtitle && <p className="text-lg opacity-80 leading-relaxed">{subtitle}</p>}
          </div>
        )}

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const itemDesign = parseItemDesign(faq)
            return (
              <details 
                key={faq.id || i} 
                className={`group rounded-2xl border border-slate-200 overflow-hidden ${itemDesign.classes}`}
                style={itemDesign.styles}
              >
                <summary className="flex items-center justify-between gap-4 p-6 font-bold text-lg cursor-pointer list-none select-none">
                  {faq.question}
                  <span className="transition group-open:rotate-180">
                    <TablerIcon name="IconChevronDown" size={24} />
                  </span>
                </summary>
                <div className="p-6 pt-0 opacity-80 leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQBlock
