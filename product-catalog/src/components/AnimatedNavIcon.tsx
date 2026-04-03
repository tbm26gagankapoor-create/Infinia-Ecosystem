import { motion, type Variants } from 'motion/react'

type IconName = 'home' | 'catalog' | 'dashboard' | 'analytics' | 'teams' | 'settings'

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
  teams: {
    color: '#a1a1aa',
    paths: [
      'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    ],
  },
  settings: {
    color: '#a1a1aa',
    paths: [
      'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
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
  teams: {
    idle: { scale: 1, y: 0 },
    hover: { scale: [1, 1.15, 1.05], y: [0, -2, 0], transition: { duration: 0.4, ease: 'easeOut' } },
  },
  settings: {
    idle: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 45, transition: { duration: 0.4, ease: 'easeOut' } },
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
