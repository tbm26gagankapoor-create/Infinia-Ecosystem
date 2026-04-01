import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BrainCircuit,
  Zap,
  BarChart3,
  CreditCard,
  Settings,
  ExternalLink,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

const NAV_SECTIONS = [
  [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/models', icon: BrainCircuit, label: 'Models' },
    { to: '/playground', icon: Zap, label: 'Playground' },
  ],
  [
    { to: '/usage', icon: BarChart3, label: 'Usage' },
    { to: '/billing', icon: CreditCard, label: 'Billing' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ],
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5" tooltip="AI Gateway">
              <div className="flex items-center gap-2 cursor-default">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 11h-3.18C14.4 9.84 13.3 9 12 9s-2.4.84-2.82 2H6c-.33 0-2-.1-2-2V8c0-1.83 1.54-2 2-2h10.18C16.6 7.16 17.7 8 19 8a3 3 0 0 0 3-3 3 3 0 0 0-3-3c-1.3 0-2.4.84-2.82 2H6C4.39 4 2 5.06 2 8v1c0 2.94 2.39 4 4 4h3.18c.42 1.16 1.52 2 2.82 2s2.4-.84 2.82-2H18c.33 0 2 .1 2 2v1c0 1.83-1.54 2-2 2H7.82C7.4 16.84 6.3 16 5 16a3 3 0 0 0-3 3 3 3 0 0 0 3 3c1.3 0 2.4-.84 2.82-2H18c1.61 0 4-1.07 4-4v-1c0-2.93-2.39-4-4-4m1-7a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1M5 20a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
                  AI Gateway
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        {NAV_SECTIONS.map((section, i) => (
          <SidebarGroup key={i} className="py-0">
            {i > 0 && <Separator className="mx-2 my-1 w-auto" />}
            <SidebarMenu>
              {section.map(item => (
                <SidebarMenuItem key={item.to}>
                  <NavLink to={item.to}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive} tooltip={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        <SidebarGroup className="py-0 mt-auto">
          <Separator className="mx-2 my-1 w-auto" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Docs">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  <span>Docs</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Gagan Kapoor">
              <div className="h-7 w-7 rounded-full bg-zinc-600 dark:bg-zinc-500 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                GK
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate leading-none">Gagan Kapoor</div>
                <div className="text-xs text-sidebar-foreground/50 truncate mt-0.5">Infinia Technologies</div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
