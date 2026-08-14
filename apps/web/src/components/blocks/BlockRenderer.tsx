import HeroBlock from './HeroBlock'
import RichTextBlock from './RichTextBlock'
import ImageTextBlock from './ImageTextBlock'
import CardsBlock from './CardsBlock'
import CTABlock from './CTABlock'
import ServicesBlock from './ServicesBlock'
import StatsBlock from './StatsBlock'
import MediaBlock from './MediaBlock'
import ContactInfoBlock from './ContactInfoBlock'
import ContactFormBlock from './ContactFormBlock'
import FeatureGridBlock from './FeatureGridBlock'
import SplitShowcaseBlock from './SplitShowcaseBlock'
import PricingBlock from './PricingBlock'
import FAQBlock from './FAQBlock'
import GalleryBlock from './GalleryBlock'
import TeamBlock from './TeamBlock'
import TestimonialsBlock from './TestimonialsBlock'

interface Props {
  blocks: any[]
}

export default function BlockRenderer({ blocks }: Props) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block: any, i: number) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={i} {...block} />
          case 'richText':
            return <RichTextBlock key={i} {...block} />
          case 'imageText':
            return <ImageTextBlock key={i} {...block} />
          case 'cards':
            return <CardsBlock key={i} {...block} />
          case 'cta':
            return <CTABlock key={i} {...block} />
          case 'services':
            return <ServicesBlock key={i} {...block} />
          case 'stats':
            return <StatsBlock key={i} {...block} />
          case 'mediaBlock':
            return <MediaBlock key={i} {...block} />
          case 'contactInfo':
            return <ContactInfoBlock key={i} {...block} />
          case 'contactForm':
            return <ContactFormBlock key={i} {...block} />
          case 'feature-grid':
            return <FeatureGridBlock key={i} {...block} />
          case 'split-showcase':
            return <SplitShowcaseBlock key={i} {...block} />
          case 'pricing':
            return <PricingBlock key={i} {...block} />
          case 'faq':
            return <FAQBlock key={i} {...block} />
          case 'gallery':
            return <GalleryBlock key={i} {...block} />
          case 'team':
            return <TeamBlock key={i} {...block} />
          case 'testimonials':
            return <TestimonialsBlock key={i} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
