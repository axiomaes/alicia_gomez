import type { FC } from 'react'
import { parseDesign, parseItemDesign, type DesignData, type ItemDesignData } from '../../lib/styleMapper'
import { TablerIcon } from '../TablerIcon'

interface PricingPlan extends ItemDesignData {
  id?: string
  name: string
  price: string
  description?: string
  is_popular?: boolean
  cta_label?: string
  cta_link?: string
  features?: { id?: string; feature: string }[]
}

interface PricingProps extends DesignData {
  title?: string
  subtitle?: string
  plans?: PricingPlan[]
}

const PricingBlock: FC<PricingProps> = (props) => {
  const { title, subtitle, plans = [] } = props
  const design = parseDesign(props)

  return (
    <section className={`py-24 px-6 ${design.classes}`} style={design.styles}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            {title && <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>}
            {subtitle && <p className="text-lg opacity-80 leading-relaxed">{subtitle}</p>}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => {
            const itemDesign = parseItemDesign(plan)
            const isPopular = plan.is_popular
            return (
              <div 
                key={plan.id || i} 
                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col h-full ${
                  isPopular ? 'border-primary shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-sm'
                } ${itemDesign.classes}`}
                style={itemDesign.styles}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                    Más Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                {plan.description && <p className="opacity-70 mb-6 min-h-[3rem]">{plan.description}</p>}
                
                <div className="text-4xl font-black mb-8">{plan.price}</div>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features?.map((f, j) => (
                    <li key={f.id || j} className="flex items-start gap-3">
                      <TablerIcon name="IconCheck" className="text-green-500 shrink-0 mt-1" size={20} />
                      <span className="opacity-90">{f.feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.cta_label && plan.cta_link && (
                  <a 
                    href={plan.cta_link} 
                    className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${
                      isPopular 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {plan.cta_label}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PricingBlock
