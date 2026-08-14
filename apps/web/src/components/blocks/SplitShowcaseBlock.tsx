import type { FC } from 'react'
import { parseDesign, type DesignData } from '../../lib/styleMapper'

interface SplitShowcaseProps extends DesignData {
  title?: string
  image?: { url?: string; alt?: string }
  content?: any
  image_position?: 'left' | 'right'
  is_sticky?: boolean
}

// Simple fallback for rich text rendering if RichText component is not directly imported
const renderRichText = (content: any) => {
  if (!content) return null;
  // This is a simplified renderer. Ideally we'd use the full RichText component.
  // Assuming content is a string of HTML or a structure we can stringify for now.
  if (typeof content === 'string') return <div dangerouslySetInnerHTML={{ __html: content }} />
  // If it's Slate JSON (Payload's default), we'd need a proper serializer.
  // For the sake of this block, we will just JSON.stringify if it's an object to avoid crashes, 
  // but in reality we should use the same RichText renderer used elsewhere.
  return <div className="prose max-w-none">{JSON.stringify(content)}</div>
}

const SplitShowcaseBlock: FC<SplitShowcaseProps> = (props) => {
  const { title, image, content, image_position = 'left', is_sticky = false } = props
  const design = parseDesign(props)

  const isRight = image_position === 'right'

  return (
    <section className={`py-12 md:py-24 px-6 overflow-hidden ${design.classes}`} style={design.styles}>
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col lg:flex-row gap-16 ${isRight ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Image Column */}
          <div className="flex-1 w-full">
            <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${is_sticky ? 'lg:sticky lg:top-32' : ''}`}>
              {image?.url ? (
                <img 
                  src={image.url} 
                  alt={image.alt || title || 'Showcase'} 
                  className="w-full h-auto object-cover aspect-square md:aspect-auto"
                />
              ) : (
                <div className="w-full aspect-square bg-slate-200 flex items-center justify-center text-slate-400">
                  Sin imagen
                </div>
              )}
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 w-full flex flex-col justify-center">
            {title && <h2 className="text-3xl md:text-5xl font-bold mb-8">{title}</h2>}
            
            <div className="prose prose-lg max-w-none">
               {/* We should ideally import and use RichTextBlock here if it accepts raw JSON content, 
                   or just map the blocks. */}
               {renderRichText(content)}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default SplitShowcaseBlock
