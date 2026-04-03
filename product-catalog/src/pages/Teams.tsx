import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { PhaseBadge } from '@/components/PhaseBadge'
import { StatusBadge } from '@/components/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PRODUCTS, ALL_PMS } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { stagger, STREAM_DEFS } from '@/lib/constants'

// Group products by PM
const PM_GROUPS = ALL_PMS.map(pm => {
  const products = PRODUCTS.filter(p => p.productManager === pm)
  const totalMrr = products.reduce((s, p) => s + p.revenue.mrr, 0)
  const totalMau = products.reduce((s, p) => s + p.usage.mau, 0)
  return { pm, products, totalMrr, totalMau }
})

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Teams() {
  return (
    <div className="space-y-6">
      <motion.div {...stagger(0)}>
        <PageHeader
          title="Teams"
          subtitle={`${ALL_PMS.length} product managers across ${PRODUCTS.length} products`}
        />
      </motion.div>

      {/* Summary row */}
      <motion.div {...stagger(1)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STREAM_DEFS.map(s => {
          const products = PRODUCTS.filter(p => p.stream === s.id)
          return (
            <Card key={s.id} className="border-border/40">
              <CardContent className="p-3">
                <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">{s.label}</div>
                <div className="text-lg font-semibold text-foreground">{products.length}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">products</div>
              </CardContent>
            </Card>
          )
        })}
        <Card className="border-border/40">
          <CardContent className="p-3">
            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">Total PMs</div>
            <div className="text-lg font-semibold text-foreground">{ALL_PMS.length}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">product managers</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* PM cards */}
      <div className="space-y-4">
        {PM_GROUPS.map(({ pm, products, totalMrr, totalMau }, idx) => (
          <motion.div key={pm} {...stagger(idx + 2)}>
            <Card className="border-border/40">
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {initials(pm)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-foreground">{pm}</CardTitle>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Product Manager</div>
                  </div>
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <div className="text-xs font-mono font-medium text-foreground">
                        {totalMrr > 0 ? formatCurrency(totalMrr, true) : '—'}
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">MRR</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-medium text-foreground">
                        {totalMau > 0 ? formatNumber(totalMau) : '—'}
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">MAU</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-medium text-foreground">{products.length}</div>
                      <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Products</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Product list */}
              <CardContent className="pt-0 pb-4">
                <div className="h-px bg-border/30 mb-3" />
                <div className="space-y-2">
                  {products.map(p => {
                    const streamLabel = STREAM_DEFS.find(s => s.id === p.stream)?.label ?? p.stream
                    return (
                      <Link
                        key={p.id}
                        to={`/products/${p.id}`}
                        className="flex items-center gap-3 group rounded px-2 py-2 hover:bg-card-hover transition-colors -mx-2"
                      >
                        <span className="text-lg leading-none w-7 text-center shrink-0">{p.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/50">{p.shortName}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground/50">{streamLabel}</span>
                            <span className="text-[10px] text-border/60">·</span>
                            <div className="flex flex-wrap gap-1">
                              {p.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0 font-normal">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <PhaseBadge phase={p.phase} showDot />
                          <StatusBadge status={p.status} />
                          <div className="text-right hidden sm:block">
                            <div className="text-[11px] font-mono text-foreground">
                              {p.revenue.mrr > 0 ? formatCurrency(p.revenue.mrr, true) : '—'}
                            </div>
                            <div className="text-[10px] text-muted-foreground/50">MRR</div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
