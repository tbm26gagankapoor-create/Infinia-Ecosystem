import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { PhaseBadge } from '@/components/PhaseBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FilterPill } from '@/components/FilterPill'
import { PRODUCTS, ALL_PMS, TOTAL_MRR } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { stagger } from '@/lib/constants'
import { POSITIVE, NEGATIVE } from '@/lib/design-tokens'
import { ProductIcon } from '@/components/ProductIcon'
import { AvatarInitials } from '@/components/AvatarInitials'
import { usePageTitle } from '@/hooks/usePageTitle'

type SortKey = 'mrr' | 'mau' | 'products' | 'name'

function buildPmGroups() {
  return ALL_PMS.map(pm => {
    const products = PRODUCTS.filter(p => p.productManager === pm)
    const totalMrr = products.reduce((s, p) => s + p.revenue.mrr, 0)
    const totalMau = products.reduce((s, p) => s + p.usage.mau, 0)
    const weightedGrowth = totalMrr > 0
      ? products.reduce((s, p) => s + p.revenue.mrr * p.revenue.growthRate, 0) / totalMrr
      : 0
    return { pm, products, totalMrr, totalMau, weightedGrowth }
  })
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'mrr', label: 'MRR' },
  { key: 'mau', label: 'MAU' },
  { key: 'products', label: 'Products' },
  { key: 'name', label: 'Name' },
]

export default function Teams() {
  usePageTitle('Teams')
  const [sortKey, setSortKey] = useState<SortKey>('mrr')

  const sortedGroups = useMemo(() => {
    const groups = buildPmGroups()
    switch (sortKey) {
      case 'mrr': return groups.sort((a, b) => b.totalMrr - a.totalMrr)
      case 'mau': return groups.sort((a, b) => b.totalMau - a.totalMau)
      case 'products': return groups.sort((a, b) => b.products.length - a.products.length)
      case 'name': return groups.sort((a, b) => a.pm.localeCompare(b.pm))
    }
  }, [sortKey])

  return (
    <div className="space-y-6">
      <motion.div {...stagger(0)}>
        <PageHeader
          title="Teams"
          subtitle={`${ALL_PMS.length} product managers across ${PRODUCTS.length} products`}
        />
      </motion.div>

      {/* KPI summary */}
      <motion.div {...stagger(1)} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Product Managers', value: String(ALL_PMS.length), desc: 'managing the portfolio' },
          { label: 'Products', value: String(PRODUCTS.length), desc: 'across 5 layers' },
          { label: 'Avg Products / PM', value: (PRODUCTS.length / ALL_PMS.length).toFixed(1), desc: 'portfolio distribution' },
        ].map(kpi => (
          <Card key={kpi.label} className="border-border/40">
            <CardContent className="p-3">
              <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">{kpi.label}</div>
              <div className="text-lg font-semibold font-mono text-foreground">{kpi.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.desc}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Sort controls */}
      <motion.div {...stagger(2)} className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground/60 uppercase tracking-wider mr-1">Sort by</span>
        {SORT_OPTIONS.map(opt => (
          <FilterPill
            key={opt.key}
            label={opt.label}
            active={sortKey === opt.key}
            onClick={() => setSortKey(opt.key)}
          />
        ))}
      </motion.div>

      {/* PM cards */}
      <div className="space-y-4">
        {sortedGroups.length === 0 && (
          <Card className="border-border/40">
            <CardContent className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No product managers found.</p>
            </CardContent>
          </Card>
        )}
        {sortedGroups.map(({ pm, products, totalMrr, totalMau, weightedGrowth }, idx) => {
          const mrrPct = TOTAL_MRR > 0 ? (totalMrr / TOTAL_MRR) * 100 : 0
          return (
            <motion.div key={pm} {...stagger(idx + 3)}>
              <Card className="border-border/40">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="text-sm font-mono font-semibold text-muted-foreground/60 w-6 text-center shrink-0">
                      #{idx + 1}
                    </div>
                    {/* Avatar */}
                    <AvatarInitials name={pm} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground truncate">{pm}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                          {products.length} {products.length === 1 ? 'product' : 'products'}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Product Manager</div>
                    </div>
                    {/* Metrics */}
                    <div className="hidden sm:flex items-center gap-5 text-right shrink-0">
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
                        <div className={`text-xs font-mono font-medium ${weightedGrowth >= 0 ? POSITIVE : NEGATIVE}`}>
                          {weightedGrowth >= 0 ? '+' : ''}{weightedGrowth.toFixed(1)}%
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Growth</div>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio proportion bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.max(mrrPct, 0.5)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {mrrPct.toFixed(1)}% of total MRR
                    </span>
                  </div>

                  {/* Product list */}
                  <div className="mt-3 space-y-1">
                    {products.map(p => (
                      <Link
                        key={p.id}
                        to={`/products/${p.id}`}
                        className="flex items-center gap-2 sm:gap-3 group rounded px-2 py-1.5 hover:bg-card-hover transition-colors -mx-2"
                      >
                        <ProductIcon icon={p.icon} className="text-lg leading-none w-6 sm:w-7 text-center shrink-0" />
                        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate flex-1 min-w-0">
                          {p.name}
                        </span>
                        <PhaseBadge phase={p.phase} showDot />
                        <div className="text-[11px] font-mono text-muted-foreground shrink-0 w-16 text-right hidden sm:block">
                          {p.revenue.mrr > 0 ? formatCurrency(p.revenue.mrr, true) : '—'}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
