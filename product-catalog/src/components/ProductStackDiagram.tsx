import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { STREAM_DEFS, PHASE_CONFIG } from '@/lib/constants'
import { PRODUCTS_BY_STREAM } from '@/lib/mock-data'
import { ProductIcon } from '@/components/ProductIcon'

function PhaseDot({ phase }: { phase: keyof typeof PHASE_CONFIG }) {
  const cfg = PHASE_CONFIG[phase]
  return <span className={cn('inline-block h-1.5 w-1.5 rounded-full flex-shrink-0', cfg.dot)} />
}

export function ProductStackDiagram() {
  // Render bottom-to-top: foundation → ai-foundation → agents
  const rows = [...STREAM_DEFS]

  return (
    <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-card overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-300 dark:border-zinc-700">
        <h3 className="text-lg font-semibold text-foreground">Product Stack</h3>
        <p className="text-sm text-muted-foreground mt-1">Explore our full product portfolio — click any product to learn more</p>
      </div>
      <div className="divide-y divide-zinc-300 dark:divide-zinc-700">
        {[...rows].reverse().map((stream) => {
          const products = PRODUCTS_BY_STREAM[stream.id]
          return (
            <div key={stream.id} className="flex items-start gap-8 px-6 py-6">
              {/* Stream label */}
              <div className="min-w-[200px] pt-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
                  {stream.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1 hidden lg:block">
                  {stream.description}
                </div>
              </div>

              {/* Product badges */}
              <div className="flex flex-wrap gap-3 flex-1">
                {products.map((product) => {
                  const phaseCfg = PHASE_CONFIG[product.phase]
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className={cn(
                        'inline-flex items-center gap-2.5 rounded-lg border px-4 py-2.5',
                        'bg-zinc-900 dark:bg-zinc-900 border-zinc-600 dark:border-zinc-600 text-foreground',
                        'hover:bg-zinc-800 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 hover:scale-[1.02]',
                        'transition-all duration-150 text-sm font-medium',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
                      )}
                    >
                      <ProductIcon icon={product.icon} className="text-base leading-none" />
                      <span>{product.shortName}</span>
                      <PhaseDot phase={product.phase} />
                      <span className={cn('text-xs font-medium', phaseCfg.text)}>
                        {phaseCfg.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
