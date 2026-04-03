import { motion, type Variants } from 'motion/react'

type IconName = 'home' | 'catalog' | 'dashboard' | 'analytics' | 'teams'

const ICON_CONFIG: Record<IconName, { color: string; paths: string[] }> = {
  home: {
    color: '#3b82f6',
    paths: ['M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'],
  },
  catalog: {
    color: '#a855f7',
    paths: [
      'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.82-1h12l.93 1H5.12z',
    ],
  },
  dashboard: {
    color: '#10b981',
    paths: [
      'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    ],
  },
  analytics: {
    color: '#06b6d4',
    paths: [
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
    ],
  },
  teams: {
    color: '#f59e0b',
    paths: [
      'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    ],
  },
}

// Each icon has a distinct hover animation sequence
const HOVER_VARIANTS: Record<IconName, Variants> = {
  home: {
    idle: { y: 0, scale: 1 },
    hover: {
      y: [0, -3, 0],
      scale: [1, 1.2, 1.05],
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
  catalog: {
    idle: { rotate: 0, scale: 1 },
    hover: {
      rotate: [0, -12, 12, -6, 6, 0],
      scale: [1, 1.1, 1.1, 1.1, 1.1, 1.05],
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  },
  dashboard: {
    idle: { x: 0, scale: 1 },
    hover: {
      x: [0, 2, -2, 1, 0],
      scale: [1, 1.15, 1.15, 1.1, 1.05],
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
  analytics: {
    idle: { scale: 1, y: 0 },
    hover: {
      scale: [1, 1.15, 1.05],
      y: [0, -2, 0],
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },
  teams: {
    idle: { rotateY: 0, scale: 1 },
    hover: {
      scale: [1, 1.2, 0.95, 1.08],
      y: [0, -2, 1, 0],
      transition: { duration: 0.5, ease: 'easeOut' },
    },
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
        <path
          key={i}
          d={d}
          fill={color}
          style={{ transition: 'fill 0.2s ease' }}
        />
      ))}
    </motion.svg>
  )
}
