import type { FC } from 'react'
interface Media {
  url?: string
  alt?: string
  width?: number
  height?: number
}

interface ImageTextProps {
  image: Media
  imagePosition?: 'left' | 'right'
  badge?: string
  title: string
  body?: any
  ctaLabel?: string
  ctaLink?: string
}

const ImageTextBlock: FC<ImageTextProps> = ({
  image,
  imagePosition = 'left',
  badge,
  title,
  body,
  ctaLabel,
  ctaLink,
}) => {
  const isLeft = imagePosition === 'left'

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${isLeft ? '' : 'md:[&>*:first-child]:order-2'}`}>
          {/* Image */}
          {image?.url && (
            <div className="relative">
              <img
                src={image.url}
                alt={image.alt || title}
                className="w-full rounded-3xl shadow-xl object-cover"
                style={{ maxHeight: '500px' }}
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
            </div>
          )}

          {/* Text */}
          <div className="space-y-6">
            {badge && (
              <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                {badge}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
              {title}
            </h2>
            {body && (
              <div 
                className="text-slate-600 leading-relaxed prose prose-slate dark:prose-invert max-w-none [&_p]:m-0 [&_p]:mb-2 [&_strong]:text-accent"
                dangerouslySetInnerHTML={{ __html: body }} 
              />
            )}
            {ctaLabel && ctaLink && (
              <a
                href={ctaLink}
                className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors group"
              >
                {ctaLabel}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImageTextBlock
