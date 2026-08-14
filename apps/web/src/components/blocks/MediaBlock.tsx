import type { FC } from 'react'

interface Media {
  url?: string
  alt?: string
  width?: number
  height?: number
  mimeType?: string
}

interface MediaBlockProps {
  media: Media
  caption?: string
  size?: 'full' | 'container' | 'small'
}

const sizeClass = {
  full: 'w-full',
  container: 'max-w-4xl mx-auto',
  small: 'max-w-lg mx-auto',
}

const MediaBlock: FC<MediaBlockProps> = ({ media, caption, size = 'full' }) => {
  if (!media?.url) return null

  const isVideo = media.mimeType?.startsWith('video/')

  return (
    <section className="py-8 px-6">
      <figure className={sizeClass[size] || sizeClass.full}>
        {isVideo ? (
          <video
            src={media.url}
            controls
            className="w-full rounded-3xl shadow-xl"
          />
        ) : (
          <img
            src={media.url}
            alt={media.alt || caption || ''}
            className="w-full rounded-3xl shadow-xl object-cover"
          />
        )}
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
            {caption}
          </figcaption>
        )}
      </figure>
    </section>
  )
}

export default MediaBlock
