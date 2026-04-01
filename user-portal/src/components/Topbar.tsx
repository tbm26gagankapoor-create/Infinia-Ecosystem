import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'
import { ChevronDown, Menu, X, Wallet, Plus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { AnimatedNavIcon } from './AnimatedNavIcon'

const NAV_LINKS = [
  { label: 'Models', href: '/models', iconName: 'models' as const },
  { label: 'Playground', href: '/playground', iconName: 'playground' as const },
  { label: 'Projects', href: '/projects', iconName: 'projects' as const },
  { label: 'Analytics', href: '/analytics', iconName: 'analytics' as const },
]

function NavIconLink({ to, iconName, label, isActive }: {
  to: string
  iconName: 'home' | 'models' | 'playground' | 'projects' | 'analytics'
  label: string
  isActive: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-1.5 h-8 rounded-full px-3 text-[13px] transition-colors',
        isActive
          ? 'font-medium bg-neutral-100 dark:bg-neutral-800'
          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatedNavIcon name={iconName} isActive={isActive} hovered={hovered} size={15} />
      {label}
    </Link>
  )
}

const ACCOUNT_LINKS = [
  { label: 'Usage', href: '/usage' },
  { label: 'Billing', href: '/billing' },
  { label: 'Settings', href: '/settings' },
]

export function Topbar() {
  const { pathname } = useLocation()
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleAccountEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setAccountOpen(true)
  }
  const handleAccountLeave = () => {
    closeTimeout.current = setTimeout(() => setAccountOpen(false), 120)
  }

  const isAccountActive = ACCOUNT_LINKS.some((l) => pathname === l.href)

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
      <header className="sticky top-0 z-40 grid grid-cols-[1fr_auto_1fr] h-14 shrink-0 items-center border-b px-4 bg-background/95 backdrop-blur-sm">
        {/* Logo — left */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-black dark:bg-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 11h-3.18C14.4 9.84 13.3 9 12 9s-2.4.84-2.82 2H6c-.33 0-2-.1-2-2V8c0-1.83 1.54-2 2-2h10.18C16.6 7.16 17.7 8 19 8a3 3 0 0 0 3-3 3 3 0 0 0-3-3c-1.3 0-2.4.84-2.82 2H6C4.39 4 2 5.06 2 8v1c0 2.94 2.39 4 4 4h3.18c.42 1.16 1.52 2 2.82 2s2.4-.84 2.82-2H18c.33 0 2 .1 2 2v1c0 1.83-1.54 2-2 2H7.82C7.4 16.84 6.3 16 5 16a3 3 0 0 0-3 3 3 3 0 0 0 3 3c1.3 0 2.4-.84 2.82-2H18c1.61 0 4-1.07 4-4v-1c0-2.93-2.39-4-4-4m1-7a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1M5 20a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1" className="fill-white dark:fill-black" />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">AI Gateway</span>
          </Link>
        </div>

        {/* Desktop Nav — center */}
        <nav className="hidden md:flex items-center gap-0.5">
          {/* Home */}
          <NavIconLink to="/dashboard" iconName="home" label="Home" isActive={pathname === '/dashboard'} />

          {/* Main links */}
          {NAV_LINKS.map(({ label, href, iconName }) => (
            <NavIconLink key={href} to={href} iconName={iconName} label={label} isActive={pathname === href} />
          ))}

          {/* Account dropdown */}
          <div
            ref={accountRef}
            className="relative"
            onMouseEnter={handleAccountEnter}
            onMouseLeave={handleAccountLeave}
          >
            <button
              className={cn(
                'flex items-center gap-1 h-8 rounded-full px-3 text-[13px] transition-colors',
                accountOpen || isAccountActive
                  ? 'font-medium bg-neutral-100 dark:bg-neutral-800'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              Account
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', accountOpen && 'rotate-180')} />
            </button>
            {accountOpen && (
              <div className="absolute top-full left-0 mt-1 py-1.5 min-w-[140px] rounded-lg border bg-popover shadow-md">
                {ACCOUNT_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    to={href}
                    className={cn(
                      'block px-3 py-1.5 text-[13px] transition-colors',
                      pathname === href
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </nav>

        {/* Right side */}
        <div className="flex items-center justify-end gap-2">
          <div className="hidden sm:flex items-center h-8 rounded-full border border-border bg-muted/40 dark:bg-muted/20 pl-2.5 pr-1 gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[13px] font-mono font-medium text-foreground tabular-nums">$47.32</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 rounded-full px-2 text-[11px] font-semibold gap-1 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/15 dark:hover:bg-primary/25"
            >
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-30 bg-background p-6 flex flex-col gap-4 overflow-y-auto">
          <Link to="/dashboard" className="text-lg font-medium">Overview</Link>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} to={href} className="text-lg font-medium">{label}</Link>
          ))}
          <div className="border-t pt-4 flex flex-col gap-3">
            <span className="text-muted-foreground text-sm">Account</span>
            {ACCOUNT_LINKS.map(({ label, href }) => (
              <Link key={href} to={href} className="text-lg font-medium pl-3">{label}</Link>
            ))}
          </div>
          <div className="border-t pt-4 flex items-center gap-3 sm:hidden">
            <span className="text-sm font-mono text-muted-foreground">$47.32</span>
            <Button variant="outline" size="sm" className="h-7 text-xs">Add Credits</Button>
          </div>
        </div>
      )}
    </>
  )
}
