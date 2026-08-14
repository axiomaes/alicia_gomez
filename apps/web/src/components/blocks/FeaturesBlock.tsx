import type { FC } from 'react'
import { motion } from 'framer-motion'
import { TablerIcon } from '../TablerIcon'

interface FeatureItem {
  icon?: string
  title: string
  description: string
}

interface FeaturesProps {
  features: FeatureItem[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
}

const FeaturesBlock: FC<FeaturesProps> = ({ features }) => {
  return (
    <section className="relative z-20 -mt-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features?.map((feature, i) => (
            <motion.div
              key={i}
              variants={item}
              className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon ? (
                  <TablerIcon name={feature.icon} size={32} stroke={1.5} />
                ) : (
                  <TablerIcon name="Check" size={32} stroke={1.5} />
                )}
              </div>
              <div 
                className="text-xl font-bold text-slate-800 mb-2 [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_h1]:text-inherit [&_h2]:text-inherit [&_strong]:text-primary"
                dangerouslySetInnerHTML={{ __html: feature.title }}
              />
              <div 
                className="text-slate-500 text-sm leading-relaxed [&_p]:m-0 [&_strong]:text-slate-700"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesBlock
