import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { AnimatedNavIcon } from '@/components/AnimatedNavIcon'
import { motion } from 'motion/react'
import {
  LayoutDashboard,
  Building2,
  Users,
  KeyRound,
  Cpu,
  Plug,
  FlaskConical,
  Bell,
  DollarSign,
  BarChart3,
  FileBarChart2,
  CreditCard,
  ScrollText,
  Settings,
  ShieldCheck,
} from 'lucide-react'

// Nav items that have a matching AnimatedNavIcon name
type AnimatedName = 'home' | 'models' | 'playground' | 'analytics'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  animatedName?: AnimatedName
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Platform',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, animatedName: 'home' },
      { label: 'Organizations', href: '/organizations', icon: Building2 },
      { label: 'Users & Teams', href: '/users', icon: Users },
      { label: 'API Keys', href: '/api-keys', icon: KeyRound },
      { label: 'Models', href: '/models', icon: Cpu, animatedName: 'models' },
      { label: 'Providers', href: '/providers', icon: Plug },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Cost Intelligence', href: '/cost', icon: DollarSign },
      { label: 'Usage Analytics', href: '/analytics', icon: BarChart3, animatedName: 'analytics' },
      { label: 'Reports', href: '/reports', icon: FileBarChart2 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Playground', href: '/playground', icon: FlaskConical, animatedName: 'playground' },
      { label: 'Alerts & Incidents', href: '/alerts', icon: Bell },
    ],
  },
  {
    label: 'Billing',
    items: [
      { label: 'Billing Mgmt', href: '/billing', icon: CreditCard },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Audit Logs', href: '/audit', icon: ScrollText },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

function NavItemRow({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={item.href}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors relative focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none',
        isActive
          ? 'bg-accent/60 text-accent-foreground before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-[2px] before:rounded-full before:bg-primary'
          : 'text-muted-foreground hover:bg-accent/30 hover:text-foreground'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.animatedName ? (
        <AnimatedNavIcon
          name={item.animatedName}
          isActive={isActive}
          hovered={hovered}
          size={16}
        />
      ) : (
        <motion.span
          animate={hovered ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <item.icon className="h-4 w-4 shrink-0" />
        </motion.span>
      )}
      {item.label}
    </Link>
  )
}

export function AdminSidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-[260px] border-r border-border/30 bg-sidebar flex flex-col">
      {/* Brand */}
      <div className="px-5 py-4 border-b">
        <div className="flex items-center gap-2.5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black dark:bg-white">
            <ShieldCheck className="h-4 w-4 text-white dark:text-black" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground leading-tight">AI Gateway</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Admin Console</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="px-3 mb-1.5 text-[10px] font-medium text-muted-foreground/50 uppercase tracking-[0.15em]">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <NavItemRow key={item.href} item={item} isActive={isActive} />
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            GA
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">Gagan Kapoor</div>
            <div className="text-[11px] text-muted-foreground truncate">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
