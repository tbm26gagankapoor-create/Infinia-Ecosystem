import { cn } from '@/lib/utils'

interface ProductIconProps {
  icon: string
  className?: string
}

/**
 * Renders a product icon — either an emoji string or an image path (starts with /).
 */
export function ProductIcon({ icon, className }: ProductIconProps) {
  if (icon.startsWith('/')) {
    return (
      <img
        src={icon}
        alt=""
        className={cn('inline-block object-contain', className)}
        style={{ width: '1em', height: '1em' }}
      />
    )
  }
  return <span className={className}>{icon}</span>
}
