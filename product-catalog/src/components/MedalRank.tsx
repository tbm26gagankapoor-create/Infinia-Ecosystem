export function MedalRank({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-base leading-none" aria-label="1st place">🥇</span>
  if (rank === 2) return <span className="text-base leading-none" aria-label="2nd place">🥈</span>
  if (rank === 3) return <span className="text-base leading-none" aria-label="3rd place">🥉</span>
  return (
    <span className="text-[11px] font-mono text-muted-foreground/60 w-5 text-center">
      #{rank}
    </span>
  )
}
