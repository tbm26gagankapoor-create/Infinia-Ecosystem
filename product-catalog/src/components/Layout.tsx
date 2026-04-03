import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from './ErrorBoundary'

export function Layout() {
  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <Topbar />
        <main className="flex-1 overflow-auto px-6 pb-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
