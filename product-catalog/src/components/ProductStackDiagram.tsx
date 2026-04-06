import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LAYER_DEFS, SOLVING_CONTEXTS } from '@/lib/constants'
import { PRODUCTS_BY_LAYER } from '@/lib/mock-data'

const LAYER_DESCRIPTIONS: Record<string, string> = {
  l1: 'Cloud, Networking & Compute',
  l2: 'ML Pipelines, Inference & Security',
  l3: 'Business Apps & Workflows',
}

export function ProductStackDiagram() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [hovered, setHovered] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (hovered) return
    intervalRef.current = setInterval(() => {
      setActiveSlide(s => (s + 1) % SOLVING_CONTEXTS.length)
    }, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [hovered])

  const activeContext = SOLVING_CONTEXTS[activeSlide]
  const highlightedIds = new Set<string>(activeContext.productIds)

  const layers = [...LAYER_DEFS].reverse() // L5 → L1

  return (
    <div
      className="max-w-5xl mx-auto w-full flex flex-col gap-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight">
            Oninfinia Stack
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Home-grown &amp; battle-tested — every layer built, deployed, and operated by Infinia
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center rounded-full border border-border/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            23 Products
          </span>
          <span className="inline-flex items-center rounded-full border border-border/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            3 Sovereign Layers
          </span>
          <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            100% On-Premise
          </span>
        </div>
      </div>

      {/* ── SOLVING context row ── */}
      <div className="overflow-x-auto scrollbar-none rounded-lg border border-border/60 shadow-sm dark:shadow-none">
        <div className="grid grid-cols-5 min-w-[560px]">
          {SOLVING_CONTEXTS.map((ctx, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={cn(
                'flex flex-col gap-0.5 px-4 py-3 text-left transition-all duration-200',
                'border-r border-border/40 last:border-r-0',
                i === activeSlide ? 'bg-muted/50' : 'bg-card hover:bg-muted/30'
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Solving
              </span>
              <span className={cn(
                'text-[11px] font-medium leading-snug',
                i === activeSlide ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {ctx.title}
              </span>
              <div className={cn(
                'h-0.5 rounded-full mt-1 transition-all duration-300',
                i === activeSlide ? 'bg-primary w-full' : 'bg-transparent w-0'
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Layer rows ── */}
      <div>
        <p className="text-[11px] text-muted-foreground mb-3">Click any product to explore</p>
        <div className="flex flex-col gap-2.5">
          {layers.map((layer) => {
            const products = PRODUCTS_BY_LAYER[layer.id]
            const desc = LAYER_DESCRIPTIONS[layer.id] ?? ''
            return (
              <div
                key={layer.id}
                className="flex items-stretch rounded-xl border border-border/60 bg-card shadow-sm dark:shadow-none overflow-hidden"
              >
                {/* Layer label */}
                <div className="flex flex-col items-center justify-center gap-1 px-4 py-5 shrink-0 w-[120px] border-r border-border/40 bg-muted/30">
                  <span className={cn(
                    'inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-bold text-white',
                    layer.bgClass
                  )}>
                    {layer.number}
                  </span>
                  <span className="text-[11px] font-semibold text-foreground text-center leading-tight mt-0.5">
                    {layer.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 text-center leading-tight">
                    {desc}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 mt-1">
                    {products.length} products
                  </span>
                </div>

                {/* Products */}
                <div className="flex flex-wrap content-center gap-2.5 flex-1 px-5 py-4">
                  {products.map((product) => {
                    const isHighlighted = highlightedIds.has(product.id)
                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className={cn(
                          'inline-flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5',
                          'bg-background border-border/60',
                          'hover:bg-muted/40 hover:border-border hover:shadow-sm hover:-translate-y-0.5',
                          'transition-all duration-150 text-xs font-medium text-foreground',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                          isHighlighted
                            ? 'opacity-100 ring-2 ring-primary/30 border-primary/30 shadow-sm'
                            : 'opacity-60 hover:opacity-90'
                        )}
                      >
                        <span className="text-base leading-none">{product.icon}</span>
                        <span>{product.shortName}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Data Center base */}
        <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3.5 text-center mt-2.5 shadow-sm dark:shadow-none">
          <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">Data Center</span>
        </div>
      </div>

      {/* ── Carousel dots ── */}
      <div className="flex justify-center gap-1 pt-1">
        {SOLVING_CONTEXTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className="p-2 flex items-center justify-center"
            aria-label={`Slide ${i + 1}: ${SOLVING_CONTEXTS[i].title}`}
          >
            <span className={cn(
              'block rounded-full transition-all duration-300',
              i === activeSlide
                ? 'w-5 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground'
            )} />
          </button>
        ))}
      </div>
    </div>
  )
}
