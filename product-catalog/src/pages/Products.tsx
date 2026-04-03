import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { LayoutGrid, List, ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { FilterPill } from '@/components/FilterPill'
import { ProductCard } from '@/components/ProductCard'
import { PhaseBadge } from '@/components/PhaseBadge'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { ProductIcon } from '@/components/ProductIcon'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { PRODUCTS, type Phase, type ProductLayer } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { LAYER_DEFS, stagger } from '@/lib/constants'
import { cn } from '@/lib/utils'

type SortKey = 'name' | 'mrr' | 'mau' | 'phase'
type ViewMode = 'grid' | 'table'

const PHASE_FILTERS: Array<{ label: string; value: Phase | 'all' }> = [
  { label: 'All Phases', value: 'all' },
  { label: 'R&D', value: 'rd' },
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Production Ready', value: 'ga' },
  { label: 'Sunset', value: 'sunset' },
]

const LAYER_FILTERS: Array<{ label: string; value: ProductLayer | 'all' }> = [
  { label: 'All Layers', value: 'all' },
  ...LAYER_DEFS.map(l => ({ label: `${l.number} — ${l.label}`, value: l.id })),
]

const PHASE_ORDER: Record<Phase, number> = { rd: 0, alpha: 1, beta: 2, ga: 3, sunset: 4 }

export default function Products() {
  const [query, setQuery] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<Phase | 'all'>('all')
  const [layerFilter, setLayerFilter] = useState<ProductLayer | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('name')
  const [view, setView] = useState<ViewMode>('grid')

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      if (phaseFilter !== 'all' && p.phase !== phaseFilter) return false
      if (layerFilter !== 'all' && p.layer !== layerFilter) return false
      if (query) {
        const q = query.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
        )
      }
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'mrr': return b.revenue.mrr - a.revenue.mrr
        case 'mau': return b.usage.mau - a.usage.mau
        case 'phase': return PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase]
        default: return a.name.localeCompare(b.name)
      }
    })

    return list
  }, [query, phaseFilter, layerFilter, sort])

  return (
    <div className="space-y-5">
      <motion.div {...stagger(0)}>
        <PageHeader
          title="Product Catalog"
          subtitle={`${PRODUCTS.length} products across 5 sovereign layers`}
        />
      </motion.div>

      {/* Controls */}
      <motion.div {...stagger(1)} className="flex flex-col gap-3">
        {/* Search + view + sort */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search products, tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="h-8 text-xs max-w-[260px] bg-card border-border/50"
          />
          <div className="flex items-center gap-1 ml-auto">
            <Select value={sort} onValueChange={v => setSort(v as SortKey)}>
              <SelectTrigger className="h-8 text-xs w-[140px] bg-card border-border/50">
                <ArrowUpDown className="h-3 w-3 mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="mrr">MRR</SelectItem>
                <SelectItem value="mau">MAU</SelectItem>
                <SelectItem value="phase">Phase</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', view === 'grid' && 'bg-muted')}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', view === 'table' && 'bg-muted')}
              onClick={() => setView('table')}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Phase pills */}
        <div className="flex flex-wrap gap-1.5">
          {PHASE_FILTERS.map(f => (
            <FilterPill
              key={f.value}
              label={f.label}
              active={phaseFilter === f.value}
              onClick={() => setPhaseFilter(f.value)}
            />
          ))}
          <span className="text-border/60 text-xs self-center px-1">|</span>
          {LAYER_FILTERS.map(f => (
            <FilterPill
              key={f.value}
              label={f.label}
              active={layerFilter === f.value}
              onClick={() => setLayerFilter(f.value)}
            />
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <motion.div {...stagger(2)}>
        <p className="text-[11px] text-muted-foreground">
          {filtered.length === PRODUCTS.length
            ? `Showing all ${PRODUCTS.length} products`
            : `${filtered.length} of ${PRODUCTS.length} products`}
        </p>
      </motion.div>

      {/* Content */}
      <motion.div {...stagger(3)}>
        {filtered.length === 0 ? (
          <EmptyState
            title="No products match your filters"
            description="Try adjusting your search or clearing the phase/layer filters."
            action={
              <Button variant="outline" size="sm" className="text-xs h-7"
                onClick={() => { setQuery(''); setPhaseFilter('all'); setLayerFilter('all') }}
              >
                Clear filters
              </Button>
            }
          />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="text-[11px] text-muted-foreground w-[280px]">Product</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">Phase</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">Layer</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground text-right">MRR</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground text-right">MAU</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">Lead</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => {
                  const layerDef = LAYER_DEFS.find(l => l.id === p.layer)
                  const layerLabel = layerDef ? `${layerDef.number} — ${layerDef.label}` : p.layer
                  return (
                    <TableRow key={p.id} className="border-border/30 hover:bg-card-hover">
                      <TableCell className="py-2.5">
                        <Link
                          to={`/products/${p.id}`}
                          className="flex items-center gap-2.5 group"
                        >
                          <ProductIcon icon={p.icon} className="text-lg leading-none" />
                          <div>
                            <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">{p.shortName}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <PhaseBadge phase={p.phase} showDot />
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-[11px] text-muted-foreground">{layerLabel}</span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-mono text-xs">
                        {p.revenue.mrr > 0 ? formatCurrency(p.revenue.mrr, true) : '—'}
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-mono text-xs">
                        {p.usage.mau > 0 ? formatNumber(p.usage.mau) : '—'}
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-[11px] text-muted-foreground">{p.productManager}</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
