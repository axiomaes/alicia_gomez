import * as TablerIcons from '@tabler/icons-react'
import type { FC } from 'react'

type IconProps = { size?: number; className?: string; stroke?: number }

function toTablerKey(name: string): string {
  return 'Icon' + name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

interface Props {
  name: string
  size?: number
  className?: string
  stroke?: number
}

export function TablerIcon({ name, size = 24, className, stroke = 1.5 }: Props) {
  if (!name) return null
  const key = toTablerKey(name)
  const Icon = (TablerIcons as Record<string, unknown>)[key] as FC<IconProps> | undefined
  if (!Icon) return null
  return <Icon size={size} className={className} stroke={stroke} />
}
