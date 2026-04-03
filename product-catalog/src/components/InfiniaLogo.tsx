interface InfiniaLogoProps {
  size?: number
  className?: string
}

/**
 * Infinia Technologies triple-chevron logo mark.
 * Three right-pointing chevrons (>>>) with gradient from solid to faded.
 * Adapts to light/dark theme.
 */
export function InfiniaLogo({ size = 28, className }: InfiniaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left chevron — brightest */}
      <path
        d="M2 4 L20 24 L2 44"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-800 dark:stroke-white"
        fill="none"
      />
      {/* Middle chevron — medium */}
      <path
        d="M20 4 L38 24 L20 44"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-500 dark:stroke-zinc-400"
        fill="none"
      />
      {/* Right chevron — faintest */}
      <path
        d="M38 4 L56 24 L38 44"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-zinc-300 dark:stroke-zinc-600"
        fill="none"
      />
    </svg>
  )
}
