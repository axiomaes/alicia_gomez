"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LayoutDashboard, FileText, Image as ImageIcon, Users, LogOut, Edit3, ChevronRight, ChevronLeft, ChevronDown, Palette, Plug } from 'lucide-react'
import { contentSchema } from '@/config/contentSchema'

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isContentExpanded, setIsContentExpanded] = useState(true)
  
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSection = searchParams?.get('section') || 'home'

  return (
    <aside 
      className={`border-r border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl hidden md:flex flex-col transition-all duration-300 ease-in-out relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="min-w-8 min-h-8 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <span className="font-bold text-lg">A</span>
          </div>
          <span className={`text-base font-bold tracking-tight text-zinc-900 dark:text-white transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Axioma Starter
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 hide-scrollbar">
        <SidebarLink 
          href="/dashboard" 
          icon={<LayoutDashboard className="w-5 h-5 shrink-0" />} 
          label="Resumen" 
          isActive={pathname === '/dashboard'} 
          isCollapsed={isCollapsed} 
        />
        
        {/* Accordion for Web Content */}
        <div className="flex flex-col">
          <button 
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false)
              setIsContentExpanded(!isContentExpanded)
            }}
            className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all group ${
              pathname === '/dashboard/content' 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${pathname === '/dashboard/content' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'} transition-colors`}>
                <Edit3 className="w-5 h-5 shrink-0" />
              </span>
              <span className={`transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Contenido Web</span>
            </div>
            {!isCollapsed && (
              <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isContentExpanded ? 'rotate-180' : ''}`} />
            )}
          </button>
          
          {/* Sub-menu */}
          <div 
            className={`flex flex-col space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out ${
              !isCollapsed && isContentExpanded ? 'max-h-96 opacity-100 mt-1 ml-9' : 'max-h-0 opacity-0'
            }`}
          >
            {contentSchema.map((section) => {
              const isActive = pathname === '/dashboard/content' && currentSection === section.id
              return (
                <Link
                  key={section.id}
                  href={`/dashboard/content?section=${section.id}`}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all truncate ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {section.title}
                </Link>
              )
            })}
          </div>
        </div>
        
        <SidebarLink 
          href="/dashboard/pages" 
          icon={<FileText className="w-5 h-5 shrink-0" />} 
          label="Constructor Páginas" 
          isActive={pathname.startsWith('/dashboard/pages')} 
          isCollapsed={isCollapsed} 
        />

        <SidebarLink 
          href="/dashboard/blogs" 
          icon={<FileText className="w-5 h-5 shrink-0" />} 
          label="Blog" 
          isActive={pathname.startsWith('/dashboard/blogs')} 
          isCollapsed={isCollapsed} 
        />
        <SidebarLink 
          href="/dashboard/settings" 
          icon={<Palette className="w-5 h-5 shrink-0" />} 
          label="Apariencia" 
          isActive={pathname.startsWith('/dashboard/settings')} 
          isCollapsed={isCollapsed} 
        />
        <SidebarLink 
          href="/dashboard/integrations" 
          icon={<Plug className="w-5 h-5 shrink-0" />} 
          label="Integraciones (APIs)" 
          isActive={pathname.startsWith('/dashboard/integrations')} 
          isCollapsed={isCollapsed} 
        />
        <SidebarLink 
          href="/dashboard/images" 
          icon={<ImageIcon className="w-5 h-5 shrink-0" />} 
          label="Imágenes" 
          isActive={pathname.startsWith('/dashboard/images')} 
          isCollapsed={isCollapsed} 
        />
        <SidebarLink 
          href="/dashboard/leads" 
          icon={<Users className="w-5 h-5 shrink-0" />} 
          label="Leads y Contactos" 
          isActive={pathname.startsWith('/dashboard/leads')} 
          isCollapsed={isCollapsed} 
        />
      </nav>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
        <form action="/auth/signout" method="post">
          <button 
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Cerrar Sesión" : ""}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-500 transition-colors" />
            <span className={`transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              Cerrar Sesión
            </span>
          </button>
        </form>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Expandir" : "Colapsar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <ChevronLeft className="w-5 h-5 shrink-0" />
          )}
          <span className={`transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
            Colapsar panel
          </span>
        </button>
      </div>
    </aside>
  )
}

function SidebarLink({ href, icon, label, isActive, isCollapsed }: { href: string; icon: React.ReactNode; label: string; isActive: boolean; isCollapsed: boolean }) {
  return (
    <Link 
      href={href}
      title={isCollapsed ? label : ""}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all group overflow-hidden ${
        isActive 
          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      <span className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'} transition-colors`}>
        {icon}
      </span>
      <span className={`transition-opacity duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
        {label}
      </span>
    </Link>
  )
}
