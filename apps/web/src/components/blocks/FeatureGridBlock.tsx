import type { FC } from 'react'
import { parseDesign, parseItemDesign, type DesignData, type ItemDesignData } from '../../lib/styleMapper'
import { TablerIcon } from '../TablerIcon'

interface Feature extends ItemDesignData {
  id?: string
  icon?: string
  title: string
  description?: string
}

interface FeatureGridProps extends DesignData {
  title?: string
  subtitle?: string
  layout?: '1x3' | '2x2' | '1x4'
  features?: Feature[]
}

const FeatureGridBlock: FC<FeatureGridProps> = (props) => {
  const { title, subtitle, layout = '1x3', features = [] } = props
  const design = parseDesign(props)

  const gridClass = 
    layout === '1x4' ? 'md:grid-cols-4' :
    layout === '2x2' ? 'md:grid-cols-2' :
    'md:grid-cols-3'

  return (
    <section className={`py-24 px-6 ${design.classes}`} style={design.styles}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            {title && <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>}
            {subtitle && <p className="text-lg opacity-80 leading-relaxed">{subtitle}</p>}
          </div>
        )}

        <div className={`grid gap-8 ${gridClass}`}>
          {features.map((feature, i) => {
            const itemDesign = parseItemDesign(feature)
            return (
              <div 
                key={feature.id || i} 
                className={`p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${itemDesign.classes}`}
                style={itemDesign.styles}
              >
                {feature.icon && (
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 text-primary">
                    <TablerIcon name={feature.icon} size={28} />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                {feature.description && (
                  <p className="opacity-80 leading-relaxed flex-grow">{feature.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeatureGridBlock
