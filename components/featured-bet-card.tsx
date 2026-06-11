"use client"

interface FeaturedBetCardProps {
  odds: string
  title: string
  description: string
}

export function FeaturedBetCard({ odds, title, description }: FeaturedBetCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <p className="text-yellow-300 text-xs">Destaque:</p>
      
      <div className="flex items-start gap-3">
        <span className="text-accent font-bold text-lg">{odds}</span>
        <span className="text-primary font-medium text-sm leading-tight">{title}</span>
      </div>
      
      <p className="text-muted-foreground text-xs leading-relaxed">
        {description}
      </p>
    </div>
  )
}
