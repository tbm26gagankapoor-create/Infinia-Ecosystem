import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Not Found')
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl font-mono font-bold text-muted-foreground/20 mb-4">404</div>
      <h1 className="text-lg font-semibold text-foreground mb-1">Page not found</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="text-xs h-8">
          <Link to="/">Home</Link>
        </Button>
        <Button asChild size="sm" className="text-xs h-8">
          <Link to="/products">Products</Link>
        </Button>
      </div>
    </div>
  )
}
