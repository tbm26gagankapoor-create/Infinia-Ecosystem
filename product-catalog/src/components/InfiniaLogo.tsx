interface InfiniaLogoProps {
  size?: number
  className?: string
}

/**
 * Infinia Technologies official logo mark.
 * Two right-pointing chevron shapes from the official brand SVG.
 */
export function InfiniaLogo({ size = 28, className }: InfiniaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="50 450 190 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Larger chevron */}
      <polygon
        points="233.79 540.34 150.67 623.02 89.72 623.02 172.83 540.34 189.08 540.34 105.97 457.7 150.67 457.7 233.79 540.34"
        className="fill-zinc-500 dark:fill-[#d3d3d3]"
      />
      {/* Smaller chevron */}
      <polygon
        points="151.48 540.34 107.87 583.74 75.87 583.74 119.48 540.34 99.46 540.34 55.82 496.95 107.87 496.95 151.48 540.34"
        className="fill-zinc-500 dark:fill-[#d3d3d3]"
      />
    </svg>
  )
}
