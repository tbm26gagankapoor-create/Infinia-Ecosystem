import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LAYER_DEFS, SOLVING_CONTEXTS } from '@/lib/constants'
import { PRODUCTS_BY_LAYER } from '@/lib/mock-data'

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
            Enterprise Intelligence Architecture
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Home-grown &amp; battle-tested — every layer built, deployed, and operated by Infinia
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center rounded-full border border-zinc-600 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            24 Products
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-600 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            5 Sovereign Layers
          </span>
          <span className="inline-flex items-center rounded-full bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 text-[11px] font-medium text-teal-300">
            100% On-Premise
          </span>
        </div>
      </div>

      {/* ── SOLVING context row ── */}
      <div className="grid grid-cols-5 rounded-lg overflow-hidden border border-zinc-700/60">
        {SOLVING_CONTEXTS.map((ctx, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={cn(
              'flex flex-col gap-0.5 px-4 py-3 text-left transition-all duration-200',
              'border-r border-zinc-700/60 last:border-r-0',
              i === activeSlide ? 'bg-zinc-700/50' : 'bg-zinc-800/20 hover:bg-zinc-700/20'
            )}
          >
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500">
              Solving
            </span>
            <span className={cn(
              'text-[11px] font-medium leading-snug',
              i === activeSlide ? 'text-foreground' : 'text-zinc-400'
            )}>
              {ctx.title}
            </span>
            <div className={cn(
              'h-0.5 rounded-full mt-1 transition-all duration-300',
              i === activeSlide ? 'bg-teal-400 w-full' : 'bg-transparent w-0'
            )} />
          </button>
        ))}
      </div>

      {/* ── Layer rows ── */}
      <div>
        <p className="text-[11px] text-muted-foreground mb-2.5">Click any product to explore</p>
        <div className="flex flex-col gap-1.5">
          {layers.map((layer) => {
            const products = PRODUCTS_BY_LAYER[layer.id]
            return (
              <div
                key={layer.id}
                className={cn(
                  'flex items-stretch rounded-lg border overflow-hidden',
                  layer.borderClass
                )}
              >
                {/* Layer label */}
                <div className={cn(
                  'flex flex-col items-center justify-center gap-1.5 px-3 py-4 shrink-0 w-[96px] border-r',
                  layer.rowBgClass, layer.borderClass
                )}>
                  <span className={cn(
                    'inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-bold text-white',
                    layer.bgClass
                  )}>
                    {layer.number}
                  </span>
                  <span className="text-[9px] font-medium text-muted-foreground/70 text-center leading-tight max-w-[80px]">
                    {layer.label}
                  </span>
                </div>

                {/* Products */}
                <div className={cn('flex flex-wrap content-center gap-2 flex-1 px-4 py-3', layer.rowBgClass)}>
                  {products.map((product) => {
                    const isHighlighted = highlightedIds.has(product.id)
                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-md border px-3 py-2',
                          'bg-zinc-900/80 border-zinc-700/80',
                          'hover:bg-zinc-800 hover:border-zinc-500 hover:scale-[1.02]',
                          'transition-all duration-150 text-xs font-medium text-foreground',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/40',
                          isHighlighted
                            ? 'opacity-100 ring-1 ring-teal-400/60 border-teal-500/50'
                            : 'opacity-35 hover:opacity-75'
                        )}
                      >
                        <span className="text-sm leading-none">{product.icon}</span>
                        <span>{product.shortName}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Carousel dots ── */}
      <div className="flex justify-center gap-2 pt-1">
        {SOLVING_CONTEXTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === activeSlide
                ? 'w-5 h-1.5 bg-teal-400'
                : 'w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400'
            )}
            aria-label={`Slide ${i + 1}: ${SOLVING_CONTEXTS[i].title}`}
          />
        ))}
      </div>
    </div>
  )
}
