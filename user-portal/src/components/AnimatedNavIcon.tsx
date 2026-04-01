import { motion, type Variants } from 'motion/react'

type IconName = 'home' | 'models' | 'playground' | 'projects' | 'analytics'

const ICON_CONFIG: Record<IconName, { color: string; paths: string[] }> = {
  home: {
    color: '#3b82f6',
    paths: ['M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'],
  },
  models: {
    color: '#a855f7',
    paths: [
      'M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z',
    ],
  },
  playground: {
    color: '#10b981',
    paths: [
      'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z',
    ],
  },
  projects: {
    color: '#f59e0b',
    paths: [
      'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
    ],
  },
  analytics: {
    color: '#06b6d4',
    paths: [
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
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
  models: {
    idle: { rotate: 0, scale: 1 },
    hover: {
      rotate: [0, -12, 12, -6, 6, 0],
      scale: [1, 1.1, 1.1, 1.1, 1.1, 1.05],
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  },
  playground: {
    idle: { x: 0, scale: 1 },
    hover: {
      x: [0, 2, -2, 1, 0],
      scale: [1, 1.15, 1.15, 1.1, 1.05],
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
  projects: {
    idle: { rotateY: 0, scale: 1 },
    hover: {
      scale: [1, 1.2, 0.95, 1.08],
      y: [0, -2, 1, 0],
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
