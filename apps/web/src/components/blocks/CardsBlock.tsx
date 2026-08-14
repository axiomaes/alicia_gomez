import type { FC } from 'react'
import { TablerIcon } from '../TablerIcon'

interface CardItem {
  icon?: string
  title: string
  description?: string
  link?: string
  linkLabel?: string
}

interface CardsProps {
  title?: string
  subtitle?: string
  columns?: '2' | '3' | '4'
  items: CardItem[]
}

const colsClass: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
  '4': 'md:grid-cols-2 lg:grid-cols-4',
}

const CardsBlock: FC<CardsProps> = ({ title, subtitle, columns = '3', items }) => {
  return (
    <section className="py-10 md:py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className="text-slate-500 leading-relaxed">{subtitle}</p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 ${colsClass[columns] || colsClass['3']} gap-6`}>
          {items?.map((card, i) => (
            <div
              key={i}
              className="group relative bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />

              {card.icon && (
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <TablerIcon name={card.icon} size={24} />
                </div>
              )}

              <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>

              {card.description && (
                <p className="text-slate-500 leading-relaxed mb-4">{card.description}</p>
              )}

              {card.link && (
                <a
                  href={card.link}
                  className="inline-flex items-center gap-2 font-bold text-sm text-primary group-hover:text-accent transition-colors"
                >
                  {card.linkLabel || 'Saber más'}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CardsBlock
