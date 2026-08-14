import React from 'react'
import type { FC } from 'react'

interface RichTextProps {
  content: string
  alignment?: 'left' | 'center' | 'right'
}

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const RichTextBlock: FC<RichTextProps> = ({ content, alignment = 'left' }) => {
  if (!content) return null
  
  return (
    <section className="py-12 px-6 bg-white dark:bg-zinc-950">
      <div className={`max-w-4xl mx-auto prose prose-slate dark:prose-invert md:prose-lg ${alignClass[alignment] || 'text-left'}`}>
        <div 
          className="text-slate-600 dark:text-zinc-300 leading-relaxed [&_p]:mb-4 [&_strong]:text-accent"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </section>
  )
}

export default RichTextBlock
