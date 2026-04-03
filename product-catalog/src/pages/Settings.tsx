import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Preferences"
        subtitle="Manage your dashboard display settings"
      />
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Theme</div>
            <div className="text-xs text-muted-foreground mt-0.5">Toggle between dark and light mode</div>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  )
}
