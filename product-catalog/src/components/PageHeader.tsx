import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  children?: ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground" style={{ textWrap: 'balance' }}>
          {title}
        </h1>
        <p className="text-sm text-muted-foreground/70 mt-0.5">{subtitle}</p>
      </div>
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </div>
  )
}
