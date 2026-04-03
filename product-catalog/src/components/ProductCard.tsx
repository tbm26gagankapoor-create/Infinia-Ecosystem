import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { PHASE_CONFIG, STATUS_CONFIG } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProductIcon } from '@/components/ProductIcon'
import type { Product } from '@/lib/mock-data'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const phaseCfg = PHASE_CONFIG[product.phase]
  const statusCfg = STATUS_CONFIG[product.status]

  return (
    <Link to={`/products/${product.id}`} className="group block focus-visible:outline-none">
      <Card className={cn(
        'h-full transition-colors duration-150 border-border/40',
        'hover:border-border/80 hover:bg-card-hover',
        'group-focus-visible:ring-2 group-focus-visible:ring-primary/40',
        className
      )}>
        <CardContent className="p-4 flex flex-col gap-3 h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <ProductIcon icon={product.icon} className="text-2xl leading-none" />
              <div>
                <div className="text-sm font-semibold text-foreground leading-tight">{product.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{product.shortName}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
                phaseCfg.pill
              )}>
                <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', phaseCfg.dot)} />
                {phaseCfg.label}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">MRR</div>
                <div className="text-xs font-mono font-medium text-foreground">
                  {product.revenue.mrr > 0 ? formatCurrency(product.revenue.mrr, true) : '—'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">MAU</div>
                <div className="text-xs font-mono font-medium text-foreground">
                  {product.usage.mau > 0 ? formatNumber(product.usage.mau) : '—'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', statusCfg.dot)} />
              <span className="text-[10px] text-muted-foreground">{statusCfg.label}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
