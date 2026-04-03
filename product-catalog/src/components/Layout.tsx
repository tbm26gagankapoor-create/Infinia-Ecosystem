import { Outlet } from 'react-router-dom'
import { CatalogTopbarNav } from './CatalogTopbarNav'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Layout() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <CatalogTopbarNav />
        <main className="mx-auto max-w-[1100px] p-6">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
