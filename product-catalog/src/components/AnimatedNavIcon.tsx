import { motion, type Variants } from 'motion/react'

type IconName = 'home' | 'catalog' | 'dashboard' | 'analytics'

const ICON_CONFIG: Record<IconName, { color: string; paths: string[] }> = {
  home: {
    color: '#2dd4bf',
    paths: ['M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'],
  },
  catalog: {
    color: '#2dd4bf',
    paths: [
      'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 3h2v-3h3v-2h-3v-3h-2v3h-3v2h3z',
    ],
  },
  dashboard: {
    color: '#a1a1aa',
    paths: [
      'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    ],
  },
  analytics: {
    color: '#a1a1aa',
    paths: [
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
    ],
  },
}

const HOVER_VARIANTS: Record<IconName, Variants> = {
  home: {
    idle: { y: 0, scale: 1 },
    hover: { y: [0, -3, 0], scale: [1, 1.2, 1.05], transition: { duration: 0.5, ease: 'easeOut' } },
  },
  catalog: {
    idle: { scale: 1, y: 0 },
    hover: { scale: [1, 1.1, 0.95, 1.05], y: [0, -2, 1, 0], transition: { duration: 0.45, ease: 'easeOut' } },
  },
  dashboard: {
    idle: { scale: 1, y: 0 },
    hover: { scale: [1, 1.15, 1.05], y: [0, -2, 0], transition: { duration: 0.4, ease: 'easeOut' } },
  },
  analytics: {
    idle: { scale: 1, y: 0 },
    hover: { scale: [1, 1.15, 1.05], y: [0, -2, 0], transition: { duration: 0.4, ease: 'easeOut' } },
  },
}

export function AnimatedNavIcon({
  name,
  isActive,
  hovered,
  size = 16,
}: {
  name: IconName
  isActive?: boolean
  hovered?: boolean
  size?: number
}) {
  const config = ICON_CONFIG[name]
  const showColor = isActive || hovered
  const color = showColor ? config.color : 'currentColor'

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      variants={HOVER_VARIANTS[name]}
      animate={hovered ? 'hover' : 'idle'}
      style={{ overflow: 'visible', flexShrink: 0 }}
    >
      {config.paths.map((d, i) => (
        <path key={i} d={d} fill={color} style={{ transition: 'fill 0.2s ease' }} />
      ))}
    </motion.svg>
  )
}
