import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/PageHeader'
import { SectionTitle } from '@/components/SectionTitle'
import { StatusBadge } from '@/components/StatusBadge'
import {
  Settings2, ShieldCheck, Users, Bell, Plug, Save, Plus, Trash2,
  Globe, Mail, Gauge, AlertCircle, Clock, Lock, Eye, EyeOff, Copy, Check
} from 'lucide-react'
import { toast } from 'sonner'

const ADMIN_USERS = [
  { name: 'Gagan Kapoor', email: 'gagan@infinia.ae', role: 'Super Admin', lastActive: 'Just now', status: 'active' as const, twoFA: true },
  { name: 'Nour Abdalla', email: 'admin@infinia.ae', role: 'Admin', lastActive: '2h ago', status: 'active' as const, twoFA: true },
  { name: 'Ops Manager', email: 'ops@infinia.ae', role: 'Ops', lastActive: '1d ago', status: 'active' as const, twoFA: false },
  { name: 'Finance Bot', email: 'finance@infinia.ae', role: 'Viewer', lastActive: '3d ago', status: 'inactive' as const, twoFA: false },
]

type TabKey = 'general' | 'security' | 'team' | 'notifications' | 'integrations'

const TABS: { key: TabKey; label: string; icon: typeof Settings2 }[] = [
  { key: 'general',       label: 'General',       icon: Settings2   },
  { key: 'security',      label: 'Security',      icon: ShieldCheck },
  { key: 'team',          label: 'Team',          icon: Users       },
  { key: 'notifications', label: 'Notifications', icon: Bell        },
  { key: 'integrations',  label: 'Integrations',  icon: Plug        },
]

function SettingRow({ label, description, children }: { label: string; description?: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5 max-w-sm">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}


function GeneralTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />Platform Identity</CardTitle>
          <CardDescription>How the platform presents itself to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="platform-name" className="text-sm font-medium mb-1.5 block">Platform Name</label>
              <Input id="platform-name" defaultValue="AI Gateway" className="h-9" />
            </div>
            <div>
              <label htmlFor="support-email" className="text-sm font-medium mb-1.5 block">Support Email</label>
              <Input id="support-email" type="email" defaultValue="support@infinia.ae" className="h-9" />
            </div>
            <div>
              <label htmlFor="docs-url" className="text-sm font-medium mb-1.5 block">Docs URL</label>
              <Input id="docs-url" defaultValue="https://docs.infinia.ae/gateway" className="h-9" />
            </div>
            <div>
              <label htmlFor="status-page" className="text-sm font-medium mb-1.5 block">Status Page URL</label>
              <Input id="status-page" defaultValue="https://status.infinia.ae" className="h-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Gauge className="h-4 w-4" />Default Limits</CardTitle>
          <CardDescription>Applied to new API keys unless overridden at the org or key level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="default-rpm" className="text-sm font-medium mb-1.5 block">Default RPM</label>
              <Input id="default-rpm" type="number" defaultValue="60" className="h-9 font-mono" />
              <p className="text-xs text-muted-foreground mt-1">Requests / minute</p>
            </div>
            <div>
              <label htmlFor="default-tpm" className="text-sm font-medium mb-1.5 block">Default TPM</label>
              <Input id="default-tpm" type="number" defaultValue="100000" className="h-9 font-mono" />
              <p className="text-xs text-muted-foreground mt-1">Tokens / minute</p>
            </div>
            <div>
              <label htmlFor="cost-ceiling" className="text-sm font-medium mb-1.5 block">Monthly Cost Ceiling</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input id="cost-ceiling" type="number" defaultValue="5000" className="h-9 font-mono pl-6" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per API key</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4" />Platform Modes</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 divide-y">
          <SettingRow label="Maintenance Mode" description="Blocks all API requests and shows a maintenance page to users. Admin console remains accessible.">
            <Switch />
          </SettingRow>
          <SettingRow label="New Signups" description="Allow new organizations to register on the platform.">
            <Switch defaultChecked />
          </SettingRow>
          <SettingRow label="Free Tier" description="Allow new orgs to sign up on the Free plan with no payment method required.">
            <Switch defaultChecked />
          </SettingRow>
        </CardContent>
      </Card>
    </div>
  )
}

function SecurityTab() {
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Lock className="h-4 w-4" />Authentication Policy</CardTitle>
          <CardDescription>Controls how admin users access this console</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 divide-y">
          <SettingRow label="Enforce 2FA for Admins" description="All admin console users must have two-factor authentication enabled.">
            <Switch defaultChecked />
          </SettingRow>
          <SettingRow label="Session Timeout" description="Automatically log out inactive admin sessions.">
            <div className="flex items-center gap-2">
              <Input id="session-timeout" type="number" defaultValue="60" className="h-9 w-20 font-mono text-sm" />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </SettingRow>
          <SettingRow label="Single Sign-On (SSO)" description="Require login via Infinia's identity provider.">
            <Badge variant="outline" className="text-xs">Coming soon</Badge>
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />IP Allowlist</CardTitle>
          <CardDescription>Restrict admin console access to specific IP addresses. Leave empty to allow all.</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 space-y-3">
          {['10.0.0.0/8', '195.88.124.0/24'].map(ip => (
            <div key={ip} className="flex items-center justify-between border rounded-md px-3 py-2">
              <span className="font-mono text-sm">{ip}</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input id="new-ip" placeholder="192.168.1.0/24" className="h-9 font-mono text-sm flex-1" />
            <Button size="sm" variant="outline" className="h-9 gap-1.5"><Plus className="h-3 w-3" />Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />Audit & Retention</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 divide-y">
          <SettingRow label="Audit Log Retention" description="How long to retain admin action logs.">
            <div className="flex items-center gap-2">
              <Input id="audit-retention" type="number" defaultValue="365" className="h-9 w-20 font-mono text-sm" />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </SettingRow>
          <SettingRow label="API Key Rotation Policy" description="Auto-rotate provider API keys after this many days.">
            <div className="flex items-center gap-2">
              <Input id="key-rotation" type="number" defaultValue="90" className="h-9 w-20 font-mono text-sm" />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Webhook Signing Secret</CardTitle>
          <CardDescription>Used to verify incoming webhook payloads from providers</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center gap-2">
            <Input
              id="webhook-secret"
              type={showWebhookSecret ? 'text' : 'password'}
              defaultValue="whsec_4f8a2b1c9d3e7f6a0b5c8d2e1f4a7b3c"
              className="h-9 font-mono text-sm flex-1"
              readOnly
            />
            <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => setShowWebhookSecret(s => !s)} aria-label={showWebhookSecret ? 'Hide secret' : 'Show secret'}>
              {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => { navigator.clipboard.writeText('whsec_4f8a2b1c9d3e7f6a0b5c8d2e1f4a7b3c'); toast.success('Copied to clipboard') }}>
              <Copy className="h-3.5 w-3.5" />Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TeamTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Admin Users</CardTitle>
              <CardDescription className="mt-0.5">Who has access to this admin console</CardDescription>
            </div>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Invite Admin</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ADMIN_USERS.map(admin => (
                <TableRow key={admin.email}>
                  <TableCell className="font-medium text-sm">{admin.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'Super Admin' ? 'default' : 'outline'} className="text-[10px]">{admin.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {admin.twoFA
                      ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" />Enabled</span>
                      : <span className="text-xs text-amber-500">Not set</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{admin.lastActive}</TableCell>
                  <TableCell><StatusBadge status={admin.status} /></TableCell>
                  <TableCell>
                    {admin.role !== 'Super Admin' && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-red-500">Remove</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Role Permissions</CardTitle>
          <CardDescription>What each admin role can do</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { role: 'Super Admin', perms: ['Full access', 'Manage admins', 'Billing controls', 'Platform settings', 'Delete orgs'] },
              { role: 'Admin', perms: ['Manage orgs & users', 'View billing', 'Manage API keys', 'View audit logs'] },
              { role: 'Ops', perms: ['View all dashboards', 'Manage incidents', 'Model health', 'Read-only billing'] },
              { role: 'Viewer', perms: ['Read-only access', 'View analytics', 'View audit logs'] },
            ].map(r => (
              <div key={r.role} className="border rounded-lg p-3">
                <div className="font-medium text-sm mb-2">{r.role}</div>
                <ul className="space-y-1">
                  {r.perms.map(p => (
                    <li key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-emerald-500 shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" />Email Channels</CardTitle>
          <CardDescription>Where alert emails are sent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <SectionTitle>Ops Alerts</SectionTitle>
          <div>
            <label htmlFor="ops-email" className="text-sm font-medium mb-1.5 block">Ops Team Email</label>
            <Input id="ops-email" type="email" defaultValue="ops@infinia.ae" className="h-9" />
            <p className="text-xs text-muted-foreground mt-1">Receives model health, provider incidents</p>
          </div>
          <SectionTitle>Finance Alerts</SectionTitle>
          <div>
            <label htmlFor="finance-email" className="text-sm font-medium mb-1.5 block">Finance Team Email</label>
            <Input id="finance-email" type="email" defaultValue="finance@infinia.ae" className="h-9" />
            <p className="text-xs text-muted-foreground mt-1">Receives billing events, credit limit alerts</p>
          </div>
          <SectionTitle>Security Alerts</SectionTitle>
          <div>
            <label htmlFor="security-email" className="text-sm font-medium mb-1.5 block">Security Email</label>
            <Input id="security-email" type="email" defaultValue="security@infinia.ae" className="h-9" />
            <p className="text-xs text-muted-foreground mt-1">Receives key rotation reminders, access events</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Slack Webhooks</CardTitle>
          <CardDescription>Post notifications to Slack channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {[
            { label: '#ops-alerts', id: 'slack-ops', val: 'https://hooks.slack.com/services/T00001/B00001/xxxx', help: 'Model health, provider incidents, latency spikes' },
            { label: '#billing-alerts', id: 'slack-billing', val: 'https://hooks.slack.com/services/T00001/B00002/xxxx', help: 'Budget alerts, postpaid suspensions' },
            { label: '#growth', id: 'slack-growth', val: '', help: 'New org signups, plan upgrades' },
          ].map(ch => (
            <div key={ch.id}>
              <label htmlFor={ch.id} className="text-sm font-medium mb-1.5 block">{ch.label}</label>
              <Input id={ch.id} defaultValue={ch.val} placeholder="https://hooks.slack.com/services/..." className="h-9 font-mono text-xs" />
              <p className="text-xs text-muted-foreground mt-1">{ch.help}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 divide-y">
          {[
            { label: 'Model goes down', description: 'Immediate alert when a model becomes unavailable', default: true },
            { label: 'Provider degraded', description: 'Alert when a provider latency or error rate spikes', default: true },
            { label: 'Org credit limit reached', description: 'Alert when a postpaid org hits 100% of credit limit', default: true },
            { label: 'Org credit warning (80%)', description: 'Alert when a postpaid org hits 80% of credit limit', default: true },
            { label: 'New org signup', description: 'Notify when a new organization registers', default: false },
            { label: 'API key auto-rotated', description: 'Confirm when a provider API key is auto-rotated', default: false },
          ].map(item => (
            <SettingRow key={item.label} label={item.label} description={item.description}>
              <Switch defaultChecked={item.default} />
            </SettingRow>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function IntegrationsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Plug className="h-4 w-4" />Platform Webhooks</CardTitle>
          <CardDescription>Push platform events to your own services</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 space-y-4">
          <div>
            <label htmlFor="webhook-url" className="text-sm font-medium mb-1.5 block">Webhook Endpoint URL</label>
            <Input id="webhook-url" placeholder="https://your-service.com/webhooks/ai-gateway" className="h-9" />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Events to send</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {['org.created', 'org.suspended', 'key.created', 'key.revoked', 'budget.alert', 'model.down', 'provider.degraded', 'invoice.generated'].map(e => (
                <label key={e} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" defaultChecked={['budget.alert', 'model.down', 'provider.degraded'].includes(e)} className="rounded" />
                  <span className="font-mono text-xs">{e}</span>
                </label>
              ))}
            </div>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5"><Check className="h-3.5 w-3.5" />Test Webhook</Button>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { name: 'PagerDuty', desc: 'Route critical incidents to on-call rotation', status: 'available' },
          { name: 'Datadog', desc: 'Export platform metrics to Datadog dashboards', status: 'available' },
          { name: 'Stripe', desc: 'Sync billing and invoicing', status: 'connected' },
          { name: 'JIRA', desc: 'Auto-create tickets for critical incidents', status: 'coming_soon' },
        ].map(i => (
          <Card key={i.name}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-sm">{i.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{i.desc}</div>
              </div>
              {i.status === 'connected'
                ? <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 shrink-0">Connected</Badge>
                : i.status === 'coming_soon'
                ? <Badge variant="outline" className="text-[10px] shrink-0">Soon</Badge>
                : <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">Connect</Button>
              }
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Settings() {
  const [tab, setTab] = useState<TabKey>('general')

  const CONTENT: Record<TabKey, ReactNode> = {
    general:       <GeneralTab />,
    security:      <SecurityTab />,
    team:          <TeamTab />,
    notifications: <NotificationsTab />,
    integrations:  <IntegrationsTab />,
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PageHeader title="Settings" subtitle="Platform configuration, security, team, and integrations">
        <Button size="sm" className="gap-1.5" onClick={() => toast.success('Settings saved')}><Save className="h-3.5 w-3.5" />Save Changes</Button>
      </PageHeader>

      <div className="flex gap-6">
        {/* Left nav */}
        <nav className="w-[180px] shrink-0">
          <div className="space-y-0.5">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors text-left focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none ${tab === t.key ? 'bg-accent/60 text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}
              >
                <t.icon className="h-4 w-4 shrink-0" />
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {CONTENT[tab]}
        </div>
      </div>
    </motion.div>
  )
}
