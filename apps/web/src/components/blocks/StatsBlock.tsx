import type { FC } from 'react'
import { TablerIcon } from '../TablerIcon'

interface StatItem {
  value: string
  label: string
  icon?: string
}

interface StatsProps {
  title?: string
  subtitle?: string
  items: StatItem[]
}

const StatsBlock: FC<StatsProps> = ({ title, subtitle, items }) => {
  return (
    <section className="py-10 md:py-16 px-6 bg-primary text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-white/5 blur-[80px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 italic">{title}</h2>
            )}
            {subtitle && (
              <p className="text-blue-200 leading-relaxed max-w-xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        <div
          className={`grid grid-cols-2 gap-8 ${
            items?.length === 3
              ? 'md:grid-cols-3'
              : items?.length === 4
                ? 'md:grid-cols-4'
                : 'md:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {items?.map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 bg-white/10 backdrop-blur rounded-3xl border border-white/20 hover:bg-white/15 transition-colors"
            >
              {stat.icon && (
                <div className="flex justify-center mb-4 text-accent">
                  <TablerIcon name={stat.icon} size={32} stroke={1.5} />
                </div>
              )}
              <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
              <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBlock
