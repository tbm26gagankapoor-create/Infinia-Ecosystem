import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './ThemeToggle'

export function CatalogTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/30 bg-background/95 backdrop-blur-sm px-6">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products, teams..."
          className="pl-9 h-9 text-sm bg-muted/40"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
