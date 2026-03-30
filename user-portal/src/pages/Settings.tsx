import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

export function Settings() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground mb-1">Settings coming soon</div>
            <p className="text-xs text-muted-foreground">Account configuration, team management, and notification preferences.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
