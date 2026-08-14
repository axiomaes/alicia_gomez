import type { FC } from 'react'
import { parseDesign, parseItemDesign, type DesignData, type ItemDesignData } from '../../lib/styleMapper'
import { TablerIcon } from '../TablerIcon'

interface TestimonialItem extends ItemDesignData {
  id?: string
  quote: string
  author: string
  position?: string
  avatar?: { url?: string; alt?: string }
  rating?: number
}

interface TestimonialsProps extends DesignData {
  title?: string
  subtitle?: string
  layout?: 'grid' | 'carousel'
  testimonials?: TestimonialItem[]
}

const TestimonialsBlock: FC<TestimonialsProps> = (props) => {
  const { title, subtitle, layout = 'grid', testimonials = [] } = props
  const design = parseDesign(props)

  const containerClass = layout === 'carousel' 
    ? 'flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 scrollbar-hide'
    : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'

  const itemClass = layout === 'carousel'
    ? 'w-[320px] md:w-[400px] shrink-0 snap-center'
    : 'w-full'

  return (
    <section className={`py-24 px-6 ${design.classes}`} style={design.styles}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            {title && <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>}
            {subtitle && <p className="text-lg opacity-80 leading-relaxed">{subtitle}</p>}
          </div>
        )}

        <div className={containerClass}>
          {testimonials.map((testi, i) => {
            const itemDesign = parseItemDesign(testi)
            const rating = testi.rating || 5
            
            return (
              <div 
                key={testi.id || i} 
                className={`p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${itemClass} ${itemDesign.classes}`}
                style={itemDesign.styles}
              >
                <div className="flex gap-1 mb-6 text-amber-400">
                  {Array.from({ length: 5 }).map((_, r) => (
                    <TablerIcon key={r} name={r < rating ? 'IconStarFilled' : 'IconStar'} size={18} />
                  ))}
                </div>
                
                <p className="opacity-90 italic leading-relaxed mb-8 flex-grow text-lg">
                  "{testi.quote}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  {testi.avatar?.url ? (
                    <img 
                      src={testi.avatar.url} 
                      alt={testi.avatar.alt || testi.author} 
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                      {testi.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">{testi.author}</h4>
                    {testi.position && <p className="text-sm opacity-70">{testi.position}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsBlock
