import type { FC } from 'react'

interface CTAProps {
  title: string
  subtitle?: string
  ctaLabel: string
  ctaLink: string
  ctaSecondaryLabel?: string
  ctaSecondaryLink?: string
  theme?: 'primary' | 'dark' | 'light'
}

const themes = {
  primary: {
    section: 'bg-primary text-white',
    subtitle: 'text-blue-100',
    btnPrimary: 'bg-white text-primary hover:bg-accent hover:text-white',
    btnSecondary: 'border-2 border-white/40 text-white hover:border-white hover:bg-white/10',
  },
  dark: {
    section: 'bg-gray-900 text-white',
    subtitle: 'text-slate-400',
    btnPrimary: 'bg-accent text-white hover:scale-105',
    btnSecondary: 'border-2 border-white/30 text-white hover:border-white hover:bg-white/10',
  },
  light: {
    section: 'bg-gray-50 text-gray-900',
    subtitle: 'text-slate-500',
    btnPrimary: 'bg-primary text-white hover:bg-accent',
    btnSecondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  },
}

const CTABlock: FC<CTAProps> = ({
  title,
  subtitle,
  ctaLabel,
  ctaLink,
  ctaSecondaryLabel,
  ctaSecondaryLink,
  theme = 'primary',
}) => {
  const t = themes[theme] || themes.primary

  return (
    <section className={`py-10 md:py-20 px-6 relative overflow-hidden ${t.section}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 bg-white blur-[120px]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 italic leading-tight">{title}</h2>

        {subtitle && (
          <p className={`text-lg mb-10 leading-relaxed ${t.subtitle}`}>{subtitle}</p>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={ctaLink}
            className={`px-10 py-4 rounded-2xl font-bold transition-all shadow-xl hover:scale-105 ${t.btnPrimary}`}
          >
            {ctaLabel}
          </a>
          {ctaSecondaryLabel && ctaSecondaryLink && (
            <a
              href={ctaSecondaryLink}
              className={`px-10 py-4 rounded-2xl font-bold transition-all ${t.btnSecondary}`}
            >
              {ctaSecondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default CTABlock
