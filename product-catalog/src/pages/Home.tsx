import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { TrendingUp, Zap, Award, ArrowRight } from 'lucide-react'
import { ProductStackDiagram } from '@/components/ProductStackDiagram'
import { Card, CardContent } from '@/components/ui/card'
import {
  PRODUCTS, TOTAL_MRR, TOTAL_ARR, TOTAL_MAU,
  PRODUCTS_BY_PHASE, ALL_RECENT_UPDATES,
} from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { stagger, PHASE_CONFIG } from '@/lib/constants'
import { POSITIVE } from '@/lib/design-tokens'
import { ProductIcon } from '@/components/ProductIcon'
import { usePageTitle } from '@/hooks/usePageTitle'

// — CEO signals —
const TOP_EARNER = [...PRODUCTS]
  .filter(p => p.revenue.mrr > 0)
  .sort((a, b) => b.revenue.mrr - a.revenue.mrr)[0]

const FASTEST_GROWING = [...PRODUCTS]
  .filter(p => p.usage.growthRate > 0)
  .sort((a, b) => b.usage.growthRate - a.usage.growthRate)[0]

const LATEST_MILESTONE = ALL_RECENT_UPDATES.find(u => u.type === 'milestone' || u.type === 'launch')

const GA_COUNT = PRODUCTS.filter(p => p.phase === 'ga').length
const ACTIVE_COUNT = PRODUCTS.filter(p => p.status === 'active').length

export default function Home() {
  usePageTitle('Home')
  return (
    <div className="space-y-8">

      {/* ── Architecture context (top) ── */}
      <motion.div {...stagger(0)}>
        <ProductStackDiagram />
      </motion.div>

      {/* ── CEO headline KPIs ── */}
      <motion.div {...stagger(1)} className="space-y-3 border-t border-border/60 pt-8">
        <div>
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium mb-1">Portfolio Overview</p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Infinia Product Portfolio
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Monthly Revenue',
              value: formatCurrency(TOTAL_MRR, true),
              sub: '+12.4% MoM',
              positive: true,
            },
            {
              label: 'ARR Run Rate',
              value: formatCurrency(TOTAL_ARR, true),
              sub: 'Annualised',
              positive: null,
            },
            {
              label: 'Monthly Active Users',
              value: formatNumber(TOTAL_MAU),
              sub: '+18.2% MoM',
              positive: true,
            },
            {
              label: 'In Production',
              value: String(GA_COUNT),
              sub: `${ACTIVE_COUNT} active total`,
              positive: null,
            },
          ].map(kpi => (
            <Card key={kpi.label} className="border-border/60">
              <CardContent className="p-4">
                <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">{kpi.label}</div>
                <div className="text-xl font-bold font-mono text-foreground leading-tight">{kpi.value}</div>
                <div className={`text-[11px] mt-1.5 font-medium ${kpi.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                  {kpi.sub}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ── 3 spotlight cards ── */}
      <motion.div {...stagger(2)} className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Revenue leader */}
        <Link to={`/products/${TOP_EARNER.id}`} className="group">
          <Card className="border-border/60 h-full hover:border-border/80 transition-colors">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-1.5 mb-3">
                <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Revenue Leader</span>
              </div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <ProductIcon icon={TOP_EARNER.icon} className="text-xl leading-none shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {TOP_EARNER.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{TOP_EARNER.productManager}</div>
                </div>
              </div>
              <div className="mt-auto">
                <div className="text-lg font-bold font-mono text-foreground">{formatCurrency(TOP_EARNER.revenue.mrr, true)}</div>
                <div className={`text-[11px] font-medium ${POSITIVE}`}>
                  +{TOP_EARNER.revenue.growthRate}% MoM
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-[11px] text-primary/70 group-hover:text-primary transition-colors">
                <span>View product</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Fastest growing */}
        <Link to={`/products/${FASTEST_GROWING.id}`} className="group">
          <Card className="border-border/60 h-full hover:border-border/80 transition-colors">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Fastest Growing</span>
              </div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <ProductIcon icon={FASTEST_GROWING.icon} className="text-xl leading-none shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {FASTEST_GROWING.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{FASTEST_GROWING.productManager}</div>
                </div>
              </div>
              <div className="mt-auto">
                <div className={`text-lg font-bold font-mono ${POSITIVE}`}>
                  +{FASTEST_GROWING.usage.growthRate}% MAU
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {formatNumber(FASTEST_GROWING.usage.mau)} monthly active users
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-[11px] text-primary/70 group-hover:text-primary transition-colors">
                <span>View product</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Latest milestone */}
        {LATEST_MILESTONE && (
          <Link to={`/products/${LATEST_MILESTONE.productId}`} className="group">
            <Card className="border-border/60 h-full hover:border-border/80 transition-colors">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center gap-1.5 mb-3">
                  <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Latest Milestone</span>
                </div>
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5">
                  {LATEST_MILESTONE.title}
                </div>
                <div className="text-[11px] text-muted-foreground mb-2">{LATEST_MILESTONE.productShortName}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 mt-auto">
                  {LATEST_MILESTONE.description}
                </div>
                <div className="flex items-center gap-1 mt-3 text-[11px] text-primary/70 group-hover:text-primary transition-colors">
                  <span>View product</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </motion.div>

      {/* ── Phase health pills ── */}
      <motion.div {...stagger(3)}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider shrink-0 mr-1">Portfolio health</span>
          {(['ga', 'beta', 'alpha', 'rd', 'sunset'] as const).map(phase => {
            const count = PRODUCTS_BY_PHASE[phase]
            if (!count) return null
            const cfg = PHASE_CONFIG[phase]
            return (
              <Link
                key={phase}
                to="/products"
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border hover:opacity-75 transition-opacity ${cfg.pill}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                <span>{cfg.label}</span>
                <span className="font-bold">{count}</span>
              </Link>
            )
          })}
          <Link to="/products" className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors ml-1 flex items-center gap-0.5">
            <span>See all</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </motion.div>

    </div>
  )
}
