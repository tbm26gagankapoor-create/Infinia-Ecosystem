import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from './ErrorBoundary'

export function Layout() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Topbar />
        <main className="px-6 pb-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
