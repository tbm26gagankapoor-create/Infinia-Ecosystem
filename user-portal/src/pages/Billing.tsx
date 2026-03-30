import { useState } from 'react'
import { CreditCard, Plus, RefreshCw, ArrowRight, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TRANSACTIONS, MODEL_USAGE } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const TOTAL_CREDIT = 100
const REMAINING = 47.32
const USED = TOTAL_CREDIT - REMAINING

export function Billing() {
  const [autoTopup, setAutoTopup] = useState(true)
  const [threshold, setThreshold] = useState('10')
  const [addCreditsOpen, setAddCreditsOpen] = useState(false)
  const [postpaidOpen, setPostpaidOpen] = useState(false)
  const [amount, setAmount] = useState('50')

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader title="Billing" subtitle="Manage credits, usage, and payment method">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setPostpaidOpen(true)}>
          Switch to Postpaid <ArrowRight className="h-3 w-3" />
        </Button>
      </PageHeader>

      {/* Credit hero — clean two-stat layout */}
      <Card className="bg-card">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Credit Balance</div>
              <div className="text-4xl font-bold font-mono text-foreground">${REMAINING.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Used this cycle</div>
              <div className="text-3xl font-bold font-mono text-muted-foreground">${USED.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">of ${TOTAL_CREDIT}.00 purchased</div>
            </div>
            <Button onClick={() => setAddCreditsOpen(true)} className="gap-1.5 ml-6">
              <Plus className="h-4 w-4" /> Add Credits
            </Button>
          </div>

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <Switch checked={autoTopup} onCheckedChange={setAutoTopup} id="auto-topup" />
            <label htmlFor="auto-topup" className="text-sm text-foreground cursor-pointer">
              Auto top-up when balance drops below
            </label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                className="w-16 h-7 text-sm font-mono"
                disabled={!autoTopup}
              />
            </div>
            <span className="text-sm text-muted-foreground">→ top up ${autoTopup ? (parseInt(threshold) >= 50 ? '100' : '50') : '50'}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Token consumption */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Token Consumption This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider pl-0">Model</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Tokens</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MODEL_USAGE.map(m => (
                  <TableRow key={m.model} className="hover:bg-muted/50">
                    <TableCell className="pl-0">
                      <div className="text-sm font-medium text-foreground truncate max-w-[140px]">{m.model}</div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {((m.inputTokens + m.outputTokens) / 1000000).toFixed(1)}M total
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-mono text-muted-foreground">{(m.inputTokens / 1000000).toFixed(1)}M in</div>
                      <div className="text-xs font-mono text-muted-foreground">{(m.outputTokens / 1000000).toFixed(1)}M out</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-foreground">
                      ${m.cost.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="hover:bg-transparent border-t border-border">
                  <TableCell className="pl-0 font-semibold text-sm text-foreground">Total</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">4.2M</TableCell>
                  <TableCell className="text-right font-mono font-semibold text-primary">$12.57</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Invoice history */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Invoice History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider pl-0">Date & Model</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">Tokens</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Cost</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {TRANSACTIONS.map(tx => (
                  <TableRow key={tx.id} className="hover:bg-muted/50">
                    <TableCell className="pl-0">
                      <div className="text-sm text-foreground truncate max-w-[120px]">{tx.model}</div>
                      <div className="text-xs font-mono text-muted-foreground">{tx.date.split(' ').slice(-1)[0]}</div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {(tx.inputTokens + tx.outputTokens).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-foreground">{tx.cost}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Download className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Payment method */}
      <Card className="bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1 rounded-md border border-border bg-muted/30 px-3 py-2.5">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Visa ending in 4242</div>
                <div className="text-xs text-muted-foreground">Expires 04/27</div>
              </div>
              <Badge variant="secondary" className="ml-auto text-xs">Default</Badge>
            </div>
            <Button variant="outline" size="sm">Update</Button>
            <Button variant="outline" size="sm">Add Backup</Button>
          </div>
        </CardContent>
      </Card>

      {/* Add credits dialog */}
      <Dialog open={addCreditsOpen} onOpenChange={setAddCreditsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-4 gap-2">
              {['10', '25', '50', '100'].map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={cn(
                    'rounded border py-2 text-sm font-semibold transition-colors',
                    amount === a ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'
                  )}
                >
                  ${a}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Custom Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input value={amount} onChange={e => setAmount(e.target.value)} className="pl-7 text-sm" />
              </div>
            </div>
            <div className="rounded-md bg-muted/50 border border-border px-3 py-2.5 text-xs text-muted-foreground">
              Charged to Visa ···· 4242. Credits added immediately.
              {parseInt(amount) >= 50 && <span className="ml-1 text-primary font-medium">10% volume discount applied!</span>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCreditsOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddCreditsOpen(false)} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Add ${amount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Postpaid dialog */}
      <Dialog open={postpaidOpen} onOpenChange={setPostpaidOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch to Postpaid Billing</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-muted-foreground">
            <p>Postpaid billing is available for organizations spending <strong className="text-foreground">$2,000+/month</strong>. A sales review is required.</p>
            <div className="rounded-md border border-border bg-card p-3 space-y-1.5 text-sm">
              {['Net-30 invoice terms', 'Volume discounts up to 30%', 'Dedicated account manager', 'SLA & SOC 2 documentation'].map(item => (
                <div key={item} className="font-medium text-foreground">{item}</div>
              ))}
            </div>
            <p>Contact <a href="mailto:sales@infinia.ai" className="text-primary underline">sales@infinia.ai</a> or book a call to get started.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPostpaidOpen(false)}>Cancel</Button>
            <Button onClick={() => setPostpaidOpen(false)}>Contact Sales</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
