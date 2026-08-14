import type { FC } from 'react'
import { parseDesign, type DesignData } from '../../lib/styleMapper'

interface Media {
  url?: string
  alt?: string
}

interface HeroProps extends DesignData {
  badge?: string
  title: string
  titleHighlight?: string
  subtitle?: string
  ctaLabel?: string
  ctaLink?: string
  ctaSecondaryLabel?: string
  ctaSecondaryLink?: string
  backgroundImage?: Media
  theme?: 'dark' | 'light' | 'image'
  layout?: 'centered' | 'left' | 'right'
  animation?: string
}

const HeroBlock: FC<HeroProps> = (props) => {
  const {
    badge,
    title,
    subtitle,
    ctaLabel,
    ctaLink,
    ctaSecondaryLabel,
    ctaSecondaryLink,
    backgroundImage,
    theme = 'dark',
    layout = 'centered',
  } = props

  const design = parseDesign(props)
  const isDark = theme === 'dark' || theme === 'image'

  const sectionStyle = {
    ...design.styles,
    ...(theme === 'image' && backgroundImage?.url
      ? {
          backgroundImage: `url(${backgroundImage.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {}),
  }

  const bgClass = theme === 'image' ? 'text-white' : ''
  
  const layoutClass = layout === 'left' ? 'text-left items-start' : layout === 'right' ? 'text-right items-end' : 'text-center items-center'

  return (
    <section
      className={`relative min-h-[70vh] flex flex-col justify-center py-24 px-6 overflow-hidden ${bgClass} ${design.classes}`}
      style={sectionStyle}
    >
      {theme === 'image' && <div className="absolute inset-0 bg-black/60" />}

      {isDark && theme !== 'image' && !design.styles.backgroundColor && (
         <div className="absolute inset-0 bg-gray-900 -z-20" />
      )}

      {isDark && (
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      )}

      <div className={`relative z-10 max-w-7xl mx-auto w-full flex flex-col ${layoutClass}`}>
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{badge}</span>
          </div>
        )}

        <div 
          className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_h1]:text-inherit [&_h2]:text-inherit [&_strong]:text-accent"
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {subtitle && (
          <div
            className={`text-lg md:text-xl mb-10 max-w-2xl leading-relaxed [&_p]:m-0 [&_strong]:text-accent ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}

        {(ctaLabel || ctaSecondaryLabel) && (
          <div className="flex flex-wrap gap-4 justify-center">
            {ctaLabel && ctaLink && (
              <a
                href={ctaLink}
                className="bg-accent text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
              >
                {ctaLabel}
              </a>
            )}
            {ctaSecondaryLabel && ctaSecondaryLink && (
              <a
                href={ctaSecondaryLink}
                className={`px-8 py-4 rounded-2xl font-bold border-2 transition-all hover:scale-105 ${
                  isDark
                    ? 'border-white/30 text-white hover:border-white hover:bg-white/10'
                    : 'border-primary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {ctaSecondaryLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroBlock
