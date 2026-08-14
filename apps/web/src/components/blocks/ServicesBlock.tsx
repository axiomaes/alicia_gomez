import type { FC } from 'react'
import { motion } from 'framer-motion'
import { TablerIcon } from '../TablerIcon'

interface ServiceItem {
  icon?: string
  title: string
  description: string
  link?: string
  color?: 'blue' | 'green' | 'red' | 'orange' | 'slate'
}

interface ServicesProps {
  title?: string
  subtitle?: string
  items: ServiceItem[]
}

const colorMap: Record<string, { iconBg: string; iconText: string; accent: string }> = {
  blue:   { iconBg: 'bg-blue-50',   iconText: 'text-blue-600',   accent: 'group-hover:border-blue-200' },
  green:  { iconBg: 'bg-green-50',  iconText: 'text-green-600',  accent: 'group-hover:border-green-200' },
  red:    { iconBg: 'bg-red-50',    iconText: 'text-accent', accent: 'group-hover:border-red-200' },
  orange: { iconBg: 'bg-orange-50', iconText: 'text-orange-600', accent: 'group-hover:border-orange-200' },
  slate:  { iconBg: 'bg-slate-100', iconText: 'text-slate-600',  accent: 'group-hover:border-slate-300' },
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariant = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } }
}

const ServicesBlock: FC<ServicesProps> = ({ title, subtitle, items }) => {
  return (
    <section className="py-12 md:py-24 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            {title && (
              <div 
                className="text-3xl md:text-5xl font-bold text-primary mb-6 [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_h1]:text-inherit [&_h2]:text-inherit [&_strong]:text-accent"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {subtitle && (
              <div 
                className="text-slate-500 text-lg leading-relaxed [&_p]:m-0 [&_strong]:text-accent"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </motion.div>
        )}

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items?.map((service, i) => {
            const color = colorMap[service.color || 'blue'] || colorMap.blue

            return (
              <motion.div
                key={i}
                variants={itemVariant}
                className={`group relative p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${color.accent}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />

                {service.icon && (
                  <div className={`w-14 h-14 rounded-2xl ${color.iconBg} flex items-center justify-center mb-8 ${color.iconText} group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
                    <TablerIcon name={service.icon} size={28} stroke={1.5} />
                  </div>
                )}

                <div 
                  className="text-2xl font-bold text-primary mb-4 [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_h1]:text-inherit [&_h2]:text-inherit [&_strong]:text-accent"
                  dangerouslySetInnerHTML={{ __html: service.title }}
                />
                <div 
                  className="text-slate-500 mb-8 leading-relaxed [&_p]:m-0 [&_strong]:text-slate-700"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />

                {service.link && (
                  <div className="flex items-center gap-2 font-bold text-sm text-primary group-hover:text-accent transition-colors">
                    Ver detalles
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesBlock
