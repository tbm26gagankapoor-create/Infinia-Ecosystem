import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { PHASE_CONFIG, LAYER_DEFS } from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProductIcon } from '@/components/ProductIcon'
import { AvatarInitials } from '@/components/AvatarInitials'
import type { Product } from '@/lib/mock-data'

interface ProductCardProps {
  product: Product
  className?: string
}

function websiteThumb(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800`
}

export function ProductCard({ product, className }: ProductCardProps) {
  const phaseCfg = PHASE_CONFIG[product.phase]
  const layerDef = LAYER_DEFS.find(l => l.id === product.layer)
  const overflowCount = product.tags.length - 3
  const [imgFailed, setImgFailed] = useState(false)

  const thumbUrl = product.screenshot || (product.websiteUrl ? websiteThumb(product.websiteUrl) : null)
  const showThumb = thumbUrl && !imgFailed

  return (
    <Link to={`/products/${product.id}`} className="group block focus-visible:outline-none">
      <Card className={cn(
        'h-full pt-0 transition-all duration-200 border-border/40',
        'hover:border-border/60 hover:-translate-y-0.5 hover:shadow-md',
        'group-focus-visible:ring-2 group-focus-visible:ring-primary/40',
        className
      )}>
        {/* Hero */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-[inherit]">
          {showThumb ? (
            <img
              src={thumbUrl}
              alt={product.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className={cn(
              'flex h-full w-full items-center justify-center bg-gradient-to-br',
              layerDef?.heroGradient
            )}>
              <ProductIcon icon={product.icon} className="text-5xl opacity-60" />
            </div>
          )}
          {/* Phase badge overlay */}
          <span className={cn(
            'absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm',
            phaseCfg.pill
          )}>
            <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', phaseCfg.dot)} />
            {phaseCfg.label}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 px-4 pb-4">
          <div>
            <div className="text-sm font-semibold text-foreground leading-tight">{product.name}</div>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Footer: Tags + PM */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1 min-w-0">
              {product.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                  {tag}
                </Badge>
              ))}
              {overflowCount > 0 && (
                <span className="text-[10px] text-muted-foreground/60 ml-0.5">+{overflowCount}</span>
              )}
            </div>
            {/* PM pill */}
            <div className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card px-1.5 py-0.5 shrink-0">
              <AvatarInitials name={product.productManager} size="sm" className="h-4 w-4 text-[7px]" />
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{product.productManager.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
