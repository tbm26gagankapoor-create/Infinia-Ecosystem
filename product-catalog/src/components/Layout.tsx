import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Topbar } from './Topbar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from './ErrorBoundary'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.getElementById('main-scroll')?.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <Topbar />
        <ScrollToTop />
        <main className="flex-1 overflow-auto px-4 sm:px-6 py-4 sm:py-6" id="main-scroll">
          <div className="mx-auto max-w-7xl">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
