import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from './ThemeToggle'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const PAGE_LABELS: Record<string, string> = {
  '/models': 'Models',
  '/playground': 'Playground',
  '/api-keys': 'API Keys',
  '/usage': 'Usage',
  '/billing': 'Billing',
  '/dashboard': 'Overview',
  '/settings': 'Settings',
}

export function Topbar() {
  const { pathname } = useLocation()
  const pageLabel = PAGE_LABELS[pathname] ?? 'AI Gateway'

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12" style={{ '--topbar-h': '4rem' } as React.CSSProperties}>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <span className="text-sm text-muted-foreground">AI Gateway</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium">
                {pageLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-3 px-4">
        <span className="text-sm font-mono text-muted-foreground">$47.32</span>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
          Add Credits
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
