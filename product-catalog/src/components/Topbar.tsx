import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { InfiniaLogo } from './InfiniaLogo'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AnimatedNavIcon } from './AnimatedNavIcon'

const NAV_LINKS = [
  { label: 'Home', sublabel: 'Overview', href: '/', iconName: 'home' as const },
  { label: 'Products', sublabel: 'All 23 products', href: '/products', iconName: 'catalog' as const },
  { label: 'Dashboard', sublabel: 'Metrics & trends', href: '/dashboard', iconName: 'dashboard' as const },
  { label: 'Leaderboard', sublabel: 'Rankings', href: '/leaderboard', iconName: 'leaderboard' as const },
  { label: 'Teams', sublabel: '7 product managers', href: '/teams', iconName: 'teams' as const },
]

function NavIconLink({ to, iconName, label, isActive }: {
  to: string
  iconName: 'home' | 'catalog' | 'dashboard' | 'analytics' | 'teams' | 'settings' | 'leaderboard'
  label: string
  isActive: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-1.5 h-8 rounded-full px-3 text-sm transition-colors',
        isActive
          ? 'font-medium bg-muted'
          : 'hover:bg-muted'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatedNavIcon name={iconName} isActive={isActive} hovered={hovered} size={15} />
      {label}
    </Link>
  )
}

export function Topbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-40 grid grid-cols-[1fr_auto_1fr] h-14 shrink-0 items-center border-b border-border/60 px-4 bg-background/95 backdrop-blur-sm">
        {/* Logo — left */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <InfiniaLogo size={28} />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-foreground leading-tight tracking-wide uppercase">Infinia</div>
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Technologies</div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav — center */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, href, iconName }) => {
            const isActive = href === '/'
              ? pathname === '/'
              : pathname === href || pathname.startsWith(href + '/')
            return (
              <NavIconLink key={href} to={href} iconName={iconName} label={label} isActive={isActive} />
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden fixed inset-0 top-14 z-30 bg-background p-6 flex flex-col gap-4 overflow-y-auto"
          >
            {NAV_LINKS.map(({ label, sublabel, href }) => (
              <Link key={href} to={href} className="flex flex-col py-3 px-2 rounded-md hover:bg-muted/50 transition-colors">
                <span className="text-lg font-medium">{label}</span>
                <span className="text-sm text-muted-foreground">{sublabel}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
