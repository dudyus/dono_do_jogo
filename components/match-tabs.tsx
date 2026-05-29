"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface MatchTabsProps {
  slug: string
  activeTab: "odds" | "apostas-destacadas"
}

export function MatchTabs({ slug, activeTab }: MatchTabsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={`/partida/${slug}`}
        className={`px-4 py-2 text-sm rounded-md transition-colors ${
          activeTab === "odds"
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        Odds
      </Link>
      <Link
        href={`/partida/${slug}/apostas-destacadas`}
        className={`px-4 py-2 text-sm rounded-md transition-colors ${
          activeTab === "apostas-destacadas"
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        Apostas destacadas
      </Link>
    </div>
  )
}
