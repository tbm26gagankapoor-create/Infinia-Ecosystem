import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, X, Copy, CheckCheck, Shield, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { USAGE_DAILY, ACTIVITY, API_KEYS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { StatCard } from '@/components/StatCard'
import { PageHeader } from '@/components/PageHeader'
import type { ChartConfig } from '@/components/ui/chart'

const STATS = [
  { label: 'Total Requests', value: '12,481', trend: { value: '+18%', up: true, text: 'Trending up this month' }, description: 'Requests over the last 30 days' },
  { label: 'Tokens This Month', value: '4.2M', trend: { value: '+34%', up: true, text: 'Strong growth in usage' }, description: 'Input + output tokens combined' },
  { label: 'Spend This Month', value: '$12.57', trend: { value: '+$3.20', up: true, text: 'Within budget this cycle' }, description: 'Of $100.00 purchased credit' },
  { label: 'Avg Latency p50', value: '342ms', trend: { value: '+12ms', up: false, text: 'Slightly higher than last period' }, description: 'Across all models and regions' },
]

const chartConfig = {
  requests: { label: 'Requests', color: 'var(--chart-1)' },
  errors: { label: 'Errors', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function Dashboard() {
  const navigate = useNavigate()
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => localStorage.getItem('onboarding_dismissed') === 'true')

  const dismissOnboarding = () => {
    setOnboardingDismissed(true)
    localStorage.setItem('onboarding_dismissed', 'true')
  }
  const [copied, setCopied] = useState(false)

  const defaultKey = API_KEYS.find(k => k.status === 'active')

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader title="Overview" subtitle="Welcome back, Gagan" />

      {/* Onboarding */}
      {!onboardingDismissed && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-sm">Get started with AI Gateway</CardTitle>
              <CardDescription>3 steps to your first API call</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" aria-label="Dismiss onboarding" onClick={dismissOnboarding}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { num: 1, label: 'Create your account', desc: 'Signed in and org created', done: true },
                { num: 2, label: 'Copy your API key', desc: 'Generate a key and add to your app', done: false, active: true },
                { num: 3, label: 'Make your first call', desc: 'Try playground or use the API', done: false },
              ].map(step => (
                <div key={step.num} className="flex items-start gap-2.5 rounded-md border bg-muted/30 p-3">
                  <div className={cn('flex-shrink-0 mt-0.5', step.done ? 'text-primary' : 'text-muted-foreground')}>
                    {step.done ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className={cn('text-sm font-medium', step.done || step.active ? 'text-foreground' : 'text-muted-foreground')}>
                      {step.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>Requests and errors — last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={USAGE_DAILY} margin={{ left: 12, right: 12 }}>
                <defs>
                  <linearGradient id="reqFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-requests)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-requests)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="errFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-errors)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-errors)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} interval={3} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Area type="natural" dataKey="requests" stroke="var(--color-requests)" fill="url(#reqFill)" strokeWidth={2} dot={false} />
                <Area type="natural" dataKey="errors" stroke="var(--color-errors)" fill="url(#errFill)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ACTIVITY.slice(0, 7).map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5', {
                      'bg-emerald-500': a.type === 'success',
                      'bg-amber-500': a.type === 'warn',
                      'bg-red-500': a.type === 'error',
                      'bg-primary': a.type === 'info',
                    })}
                    role="img"
                    aria-label={a.type}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.desc}</div>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground whitespace-nowrap flex-shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sovereign AI CTA */}
      <div className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Background decorations — clipped independently */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }} />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8">
          {/* Icon block */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg shadow-primary/5">
                <Shield className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Sovereign AI
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1.5 tracking-tight">
              Your models run in your cloud — not ours
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Deploy inside your own VPC. Every prompt, every response, every token stays on your infrastructure — zero data leaves your perimeter.
            </p>
          </div>

          {/* Illustration + actions */}
          <div className="flex flex-col items-end gap-4 flex-shrink-0 w-full md:w-auto">
            {/* Mini architecture diagram */}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-8 w-8 rounded-lg border border-border bg-muted/50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <span className="text-[10px]">Client</span>
              </div>
              <div className="flex items-center gap-1 text-primary/60">
                <div className="h-px w-4 bg-primary/30" />
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-8 w-8 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-primary">Gateway</span>
              </div>
              <div className="flex items-center gap-1 text-primary/60">
                <div className="h-px w-4 bg-primary/30" />
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-8 w-8 rounded-lg border border-border bg-muted/50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                  </svg>
                </div>
                <span className="text-[10px]">Your VPC</span>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <Button size="sm" className="gap-1.5 flex-1 md:flex-initial">
                Deployment Guide <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1 md:flex-initial">
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick key copy */}
      {defaultKey && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{defaultKey.name}</div>
                <div className="text-xs text-muted-foreground">{defaultKey.project}</div>
              </div>
              <code className="text-xs font-mono bg-muted px-2.5 py-1.5 rounded border text-muted-foreground">
                {defaultKey.masked}
              </code>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => handleCopy(defaultKey.masked)} aria-label="Copy API key">
                {copied ? <CheckCheck className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy Key'}
              </Button>
              <Button size="sm" className="gap-1.5 text-xs" onClick={() => navigate('/playground')}>
                Try Playground →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
