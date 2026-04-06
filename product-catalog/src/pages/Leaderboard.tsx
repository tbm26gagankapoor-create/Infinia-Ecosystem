import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/PageHeader'
import { PhaseBadge } from '@/components/PhaseBadge'
import { MedalRank } from '@/components/MedalRank'
import { ProductIcon } from '@/components/ProductIcon'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PRODUCTS, TOTAL_MRR } from '@/lib/mock-data'
import type { Product } from '@/lib/mock-data'
import { buildPMLeaderboard } from '@/lib/leaderboard'
import type { PMGroup } from '@/lib/leaderboard'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { stagger, LAYER_DEFS } from '@/lib/constants'
import { POSITIVE, NEGATIVE, TAB_LIST, TAB_TRIGGER } from '@/lib/design-tokens'
import { usePageTitle } from '@/hooks/usePageTitle'
import { AvatarInitials } from '@/components/AvatarInitials'
import { cn } from '@/lib/utils'

/* ── constants ── */
const MAX_MRR = Math.max(...PRODUCTS.map(p => p.revenue.mrr))
const PHASE_ORDER: Record<string, number> = { rd: 0, alpha: 1, beta: 2, ga: 3, sunset: 4 }

/* ── Product columns ── */
const productColumns: ColumnDef<Product, unknown>[] = [
  {
    id: 'rank',
    header: '#',
    size: 50,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <MedalRank rank={row.index + 1} />,
  },
  {
    accessorKey: 'name',
    header: 'Product',
    size: 240,
    enableHiding: false,
    cell: ({ row }) => {
      const p = row.original
      return (
        <div className="flex items-center gap-2.5">
          <ProductIcon icon={p.icon} className="text-base leading-none shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-medium text-foreground truncate">{p.name}</div>
            <div className="text-[10px] text-muted-foreground font-mono">{p.shortName}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'layer',
    header: 'Layer',
    size: 70,
    cell: ({ row }) => {
      const layerDef = LAYER_DEFS.find(l => l.id === row.original.layer)
      if (!layerDef) return null
      return (
        <span className={cn('text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border', layerDef.textClass, layerDef.borderClass)}>
          {layerDef.number}
        </span>
      )
    },
    sortingFn: (a, b) => {
      const aIdx = LAYER_DEFS.findIndex(l => l.id === a.original.layer)
      const bIdx = LAYER_DEFS.findIndex(l => l.id === b.original.layer)
      return aIdx - bIdx
    },
  },
  {
    accessorKey: 'phase',
    header: 'Phase',
    size: 110,
    cell: ({ row }) => <PhaseBadge phase={row.original.phase} showDot />,
    sortingFn: (a, b) => (PHASE_ORDER[a.original.phase] ?? 0) - (PHASE_ORDER[b.original.phase] ?? 0),
  },
  {
    id: 'mrr',
    accessorFn: row => row.revenue.mrr,
    header: 'MRR',
    meta: { align: 'right' },
    cell: ({ row }) => {
      const mrr = row.original.revenue.mrr
      const pct = MAX_MRR > 0 ? (mrr / MAX_MRR) * 100 : 0
      return (
        <div className="flex items-center gap-2 justify-end">
          <div className="w-16 h-1 rounded-full bg-muted/30 overflow-hidden hidden lg:block">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(pct, 1)}%` }} />
          </div>
          <span className="text-xs font-mono text-foreground">
            {mrr > 0 ? formatCurrency(mrr, true) : '—'}
          </span>
        </div>
      )
    },
  },
  {
    id: 'mau',
    accessorFn: row => row.usage.mau,
    header: 'MAU',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {formatNumber(row.original.usage.mau)}
      </span>
    ),
  },
  {
    id: 'growth',
    accessorFn: row => row.revenue.growthRate,
    header: 'Growth',
    meta: { align: 'right' },
    cell: ({ row }) => {
      const rate = row.original.revenue.growthRate
      return (
        <span className={cn('text-xs font-mono font-medium', rate >= 0 ? POSITIVE : NEGATIVE)}>
          {rate >= 0 ? '+' : ''}{rate}%
        </span>
      )
    },
  },
  {
    accessorKey: 'productManager',
    header: 'PM',
    meta: { align: 'right' },
    cell: ({ row }) => {
      const name = row.original.productManager
      return (
        <Link
          to="/teams"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card px-2 py-0.5 hover:border-border/60 hover:bg-card-hover transition-colors"
        >
          <AvatarInitials name={name} size="sm" className="h-4 w-4 text-[7px]" />
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">{name.split(' ')[0]}</span>
        </Link>
      )
    },
  },
]

/* ── PM columns ── */
const pmColumns: ColumnDef<PMGroup, unknown>[] = [
  {
    id: 'rank',
    header: '#',
    size: 50,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <MedalRank rank={row.index + 1} />,
  },
  {
    accessorKey: 'pm',
    header: 'Product Manager',
    size: 220,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <AvatarInitials name={row.original.pm} size="sm" />
        <span className="text-xs font-medium text-foreground">{row.original.pm}</span>
      </div>
    ),
  },
  {
    id: 'mrr',
    accessorFn: row => row.totalMrr,
    header: 'MRR',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className="text-xs font-mono text-foreground">
        {row.original.totalMrr > 0 ? formatCurrency(row.original.totalMrr, true) : '—'}
      </span>
    ),
  },
  {
    id: 'mau',
    accessorFn: row => row.totalMau,
    header: 'MAU',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {formatNumber(row.original.totalMau)}
      </span>
    ),
  },
  {
    id: 'growth',
    accessorFn: row => row.weightedRevGrowth,
    header: 'Growth',
    meta: { align: 'right' },
    cell: ({ row }) => {
      const rate = row.original.weightedRevGrowth
      return (
        <span className={cn('text-xs font-mono font-medium', rate >= 0 ? POSITIVE : NEGATIVE)}>
          {rate >= 0 ? '+' : ''}{rate.toFixed(1)}%
        </span>
      )
    },
  },
  {
    id: 'portfolio',
    accessorFn: row => row.mrrShare,
    header: 'Portfolio',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <span className="text-[11px] text-muted-foreground">
        {(row.original.mrrShare * 100).toFixed(1)}% of MRR
      </span>
    ),
  },
  {
    id: 'products',
    accessorFn: row => row.products.length,
    header: 'Products',
    meta: { align: 'right' },
    cell: ({ row }) => (
      <div className="flex items-center gap-1 justify-end">
        {row.original.products.slice(0, 4).map(p => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            title={p.name}
            className="opacity-60 hover:opacity-100 transition-opacity"
            onClick={e => e.stopPropagation()}
          >
            <ProductIcon icon={p.icon} className="text-sm leading-none" />
          </Link>
        ))}
        {row.original.products.length > 4 && (
          <span className="text-[10px] text-muted-foreground/60 font-mono ml-0.5">
            +{row.original.products.length - 4}
          </span>
        )}
      </div>
    ),
  },
]

/* ── Medal row highlight ── */
function productRowClass(_row: Product, idx: number) {
  if (idx === 0) return 'bg-amber-500/5'
  if (idx === 1) return 'bg-slate-400/5'
  if (idx === 2) return 'bg-orange-600/5'
  return ''
}

function pmRowClass(_row: PMGroup, idx: number) {
  if (idx === 0) return 'bg-amber-500/5'
  if (idx === 1) return 'bg-slate-400/5'
  if (idx === 2) return 'bg-orange-600/5'
  return ''
}

/* ── Page ── */
export default function Leaderboard() {
  usePageTitle('Leaderboard')
  const navigate = useNavigate()

  const pmGroups = useMemo(() => buildPMLeaderboard(), [])

  const topByMrr = useMemo(() => [...PRODUCTS].sort((a, b) => b.revenue.mrr - a.revenue.mrr)[0], [])
  const topByMau = useMemo(() => [...PRODUCTS].sort((a, b) => b.usage.mau - a.usage.mau)[0], [])
  const topByGrowth = useMemo(() => [...PRODUCTS].sort((a, b) => b.revenue.growthRate - a.revenue.growthRate)[0], [])

  const sortedPmByMrr = useMemo(() => [...pmGroups].sort((a, b) => b.totalMrr - a.totalMrr), [pmGroups])
  const topPmByMrr = sortedPmByMrr[0]
  const topPmByGrowth = useMemo(() => [...pmGroups].sort((a, b) => b.weightedRevGrowth - a.weightedRevGrowth)[0], [pmGroups])

  return (
    <div className="space-y-6">
      <motion.div {...stagger(0)}>
        <PageHeader
          title="Leaderboard"
          subtitle={`${PRODUCTS.length} products ranked across ${LAYER_DEFS.length} layers`}
        />
      </motion.div>

      <motion.div {...stagger(1)}>
        <Tabs defaultValue="products">
          <TabsList className={cn(TAB_LIST, 'mb-6')}>
            <TabsTrigger value="products" className={TAB_TRIGGER}>Products</TabsTrigger>
            <TabsTrigger value="pms" className={TAB_TRIGGER}>Product Managers</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-5 mt-0">
            {/* Spotlight KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: 'Top Revenue',
                  value: formatCurrency(topByMrr.revenue.mrr, true),
                  name: topByMrr.name,
                  icon: topByMrr.icon,
                  sub: 'MRR',
                  medal: '🥇',
                },
                {
                  label: 'Most Users',
                  value: formatNumber(topByMau.usage.mau),
                  name: topByMau.name,
                  icon: topByMau.icon,
                  sub: 'MAU',
                  medal: '👥',
                },
                {
                  label: 'Fastest Growing',
                  value: `+${topByGrowth.revenue.growthRate}%`,
                  name: topByGrowth.name,
                  icon: topByGrowth.icon,
                  sub: 'Rev growth',
                  medal: '🚀',
                },
              ].map(kpi => (
                <Card key={kpi.label} className="border-border/40">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base leading-none">{kpi.medal}</span>
                      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{kpi.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProductIcon icon={kpi.icon} className="text-lg leading-none" />
                      <div>
                        <div className="text-xs font-medium text-foreground truncate">{kpi.name}</div>
                        <div className="text-sm font-semibold font-mono text-primary">
                          {kpi.value} <span className="text-[10px] text-muted-foreground font-normal">{kpi.sub}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Table */}
            <DataTable
              columns={productColumns}
              data={PRODUCTS.slice().sort((a, b) => b.revenue.mrr - a.revenue.mrr)}
              searchKey="name"
              searchPlaceholder="Search products..."
              onRowClick={(product) => navigate(`/products/${product.id}`)}
              rowClassName={productRowClass}
              emptyMessage="No products match the selected filters."
              pageSize={15}
            />
          </TabsContent>

          {/* PRODUCT MANAGERS TAB */}
          <TabsContent value="pms" className="space-y-5 mt-0">
            {/* Spotlight KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: 'Top PM by Revenue',
                  name: topPmByMrr.pm,
                  value: formatCurrency(topPmByMrr.totalMrr, true),
                  sub: 'portfolio MRR',
                  medal: '🥇',
                  extra: `${topPmByMrr.products.length} products`,
                },
                {
                  label: 'Top PM by Growth',
                  name: topPmByGrowth.pm,
                  value: `+${topPmByGrowth.weightedRevGrowth.toFixed(1)}%`,
                  sub: 'weighted growth',
                  medal: '🚀',
                  extra: `${topPmByGrowth.products.length} products`,
                },
                {
                  label: 'Portfolio MRR',
                  name: 'All PMs',
                  value: formatCurrency(TOTAL_MRR, true),
                  sub: 'combined',
                  medal: '💼',
                  extra: `${PRODUCTS.length} products`,
                },
              ].map(kpi => (
                <Card key={kpi.label} className="border-border/40">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base leading-none">{kpi.medal}</span>
                      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{kpi.label}</span>
                    </div>
                    <div className="text-xs font-medium text-foreground">{kpi.name}</div>
                    <div className="text-sm font-semibold font-mono text-primary">
                      {kpi.value} <span className="text-[10px] text-muted-foreground font-normal">{kpi.sub}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.extra}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Table */}
            <DataTable
              columns={pmColumns}
              data={sortedPmByMrr}
              searchKey="pm"
              searchPlaceholder="Search PMs..."
              rowClassName={pmRowClass}
              emptyMessage="No PMs found."
              showPagination={false}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
