import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'

function SunIcon() {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sun body */}
      <motion.circle
        cx="12"
        cy="12"
        r="5"
        fill="#FBBF24"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="5"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 12 + Math.cos(rad) * 7.5
        const y1 = 12 + Math.sin(rad) * 7.5
        const x2 = 12 + Math.cos(rad) * 10
        const y2 = 12 + Math.sin(rad) * 10
        return (
          <motion.line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FBBF24"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.03, ease: 'easeOut' }}
          />
        )
      })}
    </motion.svg>
  )
}

function MoonIcon() {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Moon crescent */}
      <motion.path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="#7DD3FC"
        stroke="#38BDF8"
        strokeWidth="0.5"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ transformOrigin: '12px 12px' }}
      />
      {/* Stars */}
      {[
        { cx: 18, cy: 5, r: 1 },
        { cx: 20, cy: 9, r: 0.7 },
        { cx: 16, cy: 3, r: 0.5 },
      ].map((star, i) => (
        <motion.circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#E0F2FE"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.7, 1], scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.25 + i * 0.1,
            ease: 'easeOut',
            opacity: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' },
          }}
        />
      ))}
    </motion.svg>
  )
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="relative h-8 w-8 overflow-hidden"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            <MoonIcon />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            <SunIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
