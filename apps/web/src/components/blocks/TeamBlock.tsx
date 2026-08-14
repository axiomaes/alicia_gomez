import type { FC } from 'react'
import { parseDesign, parseItemDesign, type DesignData, type ItemDesignData } from '../../lib/styleMapper'
import { TablerIcon } from '../TablerIcon'

interface SocialLink {
  id?: string
  platform: 'linkedin' | 'twitter' | 'instagram' | 'github' | 'website'
  url: string
}

interface TeamMember extends ItemDesignData {
  id?: string
  image?: { url?: string; alt?: string }
  name: string
  role: string
  bio?: string
  social?: SocialLink[]
}

interface TeamProps extends DesignData {
  title?: string
  subtitle?: string
  layout?: 'grid' | 'carousel'
  members?: TeamMember[]
}

const TeamBlock: FC<TeamProps> = (props) => {
  const { title, subtitle, layout = 'grid', members = [] } = props
  const design = parseDesign(props)

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'IconBrandLinkedin'
      case 'twitter': return 'IconBrandTwitter'
      case 'instagram': return 'IconBrandInstagram'
      case 'github': return 'IconBrandGithub'
      case 'website': return 'IconWorld'
      default: return 'IconLink'
    }
  }

  // Si es carousel, requeriría lógica extra (ej. swiper), por simplicidad para este bloque
  // lo renderizamos como flex con scroll si el layout es carousel, o grid si es grid.
  const containerClass = layout === 'carousel' 
    ? 'flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 -mx-6 px-6 scrollbar-hide'
    : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'

  const itemClass = layout === 'carousel'
    ? 'w-[300px] shrink-0 snap-start'
    : 'w-full'

  return (
    <section className={`py-12 md:py-24 px-6 ${design.classes}`} style={design.styles}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            {title && <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>}
            {subtitle && <p className="text-lg opacity-80 leading-relaxed">{subtitle}</p>}
          </div>
        )}

        <div className={containerClass}>
          {members.map((member, i) => {
            const itemDesign = parseItemDesign(member)
            return (
              <div 
                key={member.id || i} 
                className={`group rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 ${itemClass} ${itemDesign.classes}`}
                style={itemDesign.styles}
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  {member.image?.url ? (
                    <img 
                      src={member.image.url} 
                      alt={member.image.alt || member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2 grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <TablerIcon name="IconUser" size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-8 relative z-10 bg-white -mt-4 rounded-t-3xl">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                  
                  {member.bio && (
                    <p className="opacity-70 text-sm leading-relaxed mb-6">{member.bio}</p>
                  )}
                  
                  {member.social && member.social.length > 0 && (
                    <div className="flex gap-3">
                      {member.social.map((s, j) => (
                        <a 
                          key={s.id || j} 
                          href={s.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <TablerIcon name={getPlatformIcon(s.platform)} size={16} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TeamBlock
