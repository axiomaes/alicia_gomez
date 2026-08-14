import type { FC } from 'react'
import { parseDesign, parseItemDesign, type DesignData, type ItemDesignData } from '../../lib/styleMapper'

interface GalleryImage extends ItemDesignData {
  id?: string
  image?: { url?: string; alt?: string }
  caption?: string
}

interface GalleryProps extends DesignData {
  title?: string
  subtitle?: string
  layout?: 'grid' | 'masonry'
  images?: GalleryImage[]
}

const GalleryBlock: FC<GalleryProps> = (props) => {
  const { title, subtitle, layout = 'grid', images = [] } = props
  const design = parseDesign(props)

  const gridClass = layout === 'masonry' 
    ? 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6'
    : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'

  return (
    <section className={`py-12 md:py-24 px-6 ${design.classes}`} style={design.styles}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            {title && <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>}
            {subtitle && <p className="text-lg opacity-80 leading-relaxed">{subtitle}</p>}
          </div>
        )}

        <div className={gridClass}>
          {images.map((img, i) => {
            const itemDesign = parseItemDesign(img)
            const isMasonryItem = layout === 'masonry'
            
            return (
              <div 
                key={img.id || i} 
                className={`relative group overflow-hidden rounded-2xl ${isMasonryItem ? 'break-inside-avoid' : ''} ${itemDesign.classes}`}
                style={itemDesign.styles}
              >
                {img.image?.url ? (
                  <img 
                    src={img.image.url} 
                    alt={img.image.alt || img.caption || 'Gallery Image'} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full aspect-square bg-slate-200" />
                )}
                
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-medium text-sm">{img.caption}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default GalleryBlock
