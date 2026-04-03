import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ExternalLink, FileText, BookOpen, BarChart2, Zap } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ProductIcon } from '@/components/ProductIcon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PhaseBadge } from '@/components/PhaseBadge'
import { StatusBadge } from '@/components/StatusBadge'
import { StatCard } from '@/components/StatCard'
import { PRODUCTS, type DocType } from '@/lib/mock-data'
import { formatCurrency, formatNumber, formatDate } from '@/lib/formatters'
import { CHART_MD, STAT_GRID, stagger, STREAM_DEFS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const UPDATE_TYPE_STYLES: Record<string, string> = {
  feature: 'bg-primary/10 text-primary',
  bugfix: 'bg-destructive/10 text-destructive',
  launch: 'bg-emerald-500/10 text-emerald-400',
  milestone: 'bg-amber-500/10 text-amber-400',
}

const DOC_TYPE_ICON: Record<DocType, typeof FileText> = {
  prd: FileText,
  'market-research': BarChart2,
  onepager: Zap,
  technical: BookOpen,
}

const DOC_TYPE_LABEL: Record<DocType, string> = {
  prd: 'PRD',
  'market-research': 'Market Research',
  onepager: 'One-Pager',
  technical: 'Technical',
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = PRODUCTS.find(p => p.id === id)

  if (!product) return <Navigate to="/products" replace />

  const streamLabel = STREAM_DEFS.find(s => s.id === product.stream)?.label ?? product.stream
  const relatedProducts = PRODUCTS.filter(p => product.relatedProductIds.includes(p.id))

  const TOOLTIP_STYLE = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontSize: 12,
    color: 'var(--foreground)',
  }
  const LABEL_STYLE = { color: 'var(--muted-foreground)', fontSize: 11 }
  const AXIS_PROPS = {
    tick: { fontSize: 10, fill: 'var(--muted-foreground)' },
    axisLine: false as const,
    tickLine: false as const,
  }

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <motion.div {...stagger(0)}>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All products
        </Link>
      </motion.div>

      {/* Product header */}
      <motion.div {...stagger(1)} className="flex items-start gap-4">
        <ProductIcon icon={product.icon} className="text-4xl leading-none mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-semibold text-foreground">{product.name}</h1>
            <span className="text-xs font-mono text-muted-foreground">{product.shortName}</span>
            <PhaseBadge phase={product.phase} showDot />
            <StatusBadge status={product.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-[640px]">
            {product.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground/60">
            <span>{streamLabel} stream</span>
            <span>·</span>
            <span>Since {formatDate(product.foundedDate)}</span>
            <span>·</span>
            <span>PM: {product.productManager}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div {...stagger(2)}>
        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList className="bg-card/50 border border-border/40 h-8 p-0.5 gap-0.5">
            {['overview', 'revenue', 'usage', 'updates', 'docs', 'team'].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="h-7 px-3 text-xs capitalize data-[state=active]:bg-background data-[state=active]:shadow-none"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── OVERVIEW ── */}
          <TabsContent value="overview" className="space-y-5 mt-0">
            {/* KPIs */}
            <div className={STAT_GRID}>
              <StatCard
                label="MRR"
                value={product.revenue.mrr > 0 ? formatCurrency(product.revenue.mrr, true) : '—'}
                trend={product.revenue.growthRate > 0
                  ? { value: `+${product.revenue.growthRate}%`, up: true, text: 'growth rate' }
                  : undefined}
                description="Monthly recurring revenue"
              />
              <StatCard
                label="ARR"
                value={product.revenue.arr > 0 ? formatCurrency(product.revenue.arr, true) : '—'}
                description="Annual recurring revenue"
              />
              <StatCard
                label="MAU"
                value={product.usage.mau > 0 ? formatNumber(product.usage.mau) : '—'}
                trend={product.usage.growthRate > 0
                  ? { value: `+${product.usage.growthRate}%`, up: true, text: 'growth rate' }
                  : undefined}
                description="Monthly active users"
              />
              <StatCard
                label="Total Users"
                value={product.usage.totalUsers > 0 ? formatNumber(product.usage.totalUsers) : '—'}
                description="All-time registered users"
              />
            </div>

            {/* Mission */}
            <Card className="border-border/40">
              <CardContent className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground/50 mb-1.5">Mission</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{product.mission}</p>
              </CardContent>
            </Card>

            {/* Key features + tech stack */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border/40">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Key Features</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <ul className="space-y-1.5">
                    {product.keyFeatures.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-foreground/80">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-border/40">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tech Stack</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {product.techStack.map(t => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded border border-border/40 bg-muted/30 px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <Card className="border-border/40">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Related Products</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {relatedProducts.map(rp => (
                      <Link
                        key={rp.id}
                        to={`/products/${rp.id}`}
                        className="inline-flex items-center gap-1.5 rounded border border-border/40 bg-card hover:bg-card-hover px-2.5 py-1.5 text-xs text-foreground transition-colors"
                      >
                        <ProductIcon icon={rp.icon} className="text-sm" />
                        <span>{rp.shortName}</span>
                        <PhaseBadge phase={rp.phase} />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── REVENUE ── */}
          <TabsContent value="revenue" className="space-y-5 mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard
                label="Current MRR"
                value={product.revenue.mrr > 0 ? formatCurrency(product.revenue.mrr, true) : '—'}
                description="Monthly recurring revenue"
              />
              <StatCard
                label="ARR"
                value={product.revenue.arr > 0 ? formatCurrency(product.revenue.arr, true) : '—'}
                description="Annualised run rate"
              />
              <StatCard
                label="MRR Growth"
                value={product.revenue.growthRate > 0 ? `+${product.revenue.growthRate}%` : '—'}
                description="Month-over-month"
              />
            </div>

            {product.revenue.mrr > 0 ? (
              <Card className="border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue History</CardTitle>
                  <CardDescription className="text-xs">MRR over the last 12 months</CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-4">
                  <ResponsiveContainer width="100%" height={CHART_MD}>
                    <AreaChart data={product.revenue.history} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" {...AXIS_PROPS} tickFormatter={v => v.slice(5)} />
                      <YAxis hide />
                      <Tooltip
                        formatter={((v: number) => [formatCurrency(v, true), 'MRR']) as never}
                        contentStyle={TOOLTIP_STYLE}
                        labelStyle={LABEL_STYLE}
                      />
                      <Area type="monotone" dataKey="amount" stroke="var(--chart-1)" strokeWidth={1.5} fill="url(#revGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/40">
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No revenue yet — product is pre-commercial.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── USAGE ── */}
          <TabsContent value="usage" className="space-y-5 mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="DAU" value={formatNumber(product.usage.dau)} description="Daily active users" />
              <StatCard label="MAU" value={formatNumber(product.usage.mau)} description="Monthly active users" />
              <StatCard label="Total Users" value={formatNumber(product.usage.totalUsers)} description="All registered users" />
              <StatCard
                label="Growth"
                value={`+${product.usage.growthRate}%`}
                description="MAU growth rate"
              />
            </div>

            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">User Growth</CardTitle>
                <CardDescription className="text-xs">MAU over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <ResponsiveContainer width="100%" height={CHART_MD}>
                  <BarChart data={product.usage.history} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" {...AXIS_PROPS} tickFormatter={v => v.slice(5)} />
                    <YAxis hide />
                    <Tooltip
                      formatter={((v: number) => [formatNumber(v), 'MAU']) as never}
                      contentStyle={TOOLTIP_STYLE}
                      labelStyle={LABEL_STYLE}
                    />
                    <Bar dataKey="users" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── UPDATES ── */}
          <TabsContent value="updates" className="mt-0">
            {product.updates.length === 0 ? (
              <Card className="border-border/40">
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No updates logged yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {product.updates.map((u, i) => (
                  <Card key={i} className="border-border/40">
                    <CardContent className="p-4 flex items-start gap-3">
                      <span className={cn(
                        'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider shrink-0 mt-0.5',
                        UPDATE_TYPE_STYLES[u.type] ?? 'bg-zinc-500/10 text-zinc-400'
                      )}>
                        {u.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground">{u.title}</span>
                          <span className="text-[11px] text-muted-foreground shrink-0">{formatDate(u.date)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{u.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── DOCS ── */}
          <TabsContent value="docs" className="mt-0">
            {product.documents.length === 0 ? (
              <Card className="border-border/40">
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No documents attached to this product.</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PRDs, market research, and one-pagers will appear here when added.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.documents.map((doc, i) => {
                  const Icon = DOC_TYPE_ICON[doc.type]
                  return (
                    <Card key={i} className="border-border/40 hover:bg-card-hover transition-colors">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 rounded bg-primary/10 text-primary shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-medium text-foreground">{doc.label}</div>
                              <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-0.5">
                                {DOC_TYPE_LABEL[doc.type]}
                              </div>
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0"
                            >
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                                Open
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                            {doc.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* ── TEAM ── */}
          <TabsContent value="team" className="mt-0">
            <Card className="border-border/40 max-w-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                  {product.productManager.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{product.productManager}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Product Manager</div>
                  <div className="text-[10px] text-muted-foreground/50 mt-1 font-mono">{product.shortName}</div>
                </div>
              </CardContent>
            </Card>

            {relatedProducts.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] text-muted-foreground/60 uppercase tracking-wider mb-3">Related products</p>
                <div className="flex flex-col gap-2 max-w-sm">
                  {relatedProducts.map(rp => (
                    <Link
                      key={rp.id}
                      to={`/products/${rp.id}`}
                      className="flex items-center gap-2.5 rounded border border-border/40 bg-card hover:bg-card-hover px-3 py-2 transition-colors"
                    >
                      <span>{rp.icon}</span>
                      <span className="text-xs text-foreground flex-1">{rp.name}</span>
                      <PhaseBadge phase={rp.phase} showDot />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
