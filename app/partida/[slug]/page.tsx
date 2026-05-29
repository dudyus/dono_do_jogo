import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { BackButton } from "@/components/back-button"
import { MatchHeader } from "@/components/match-header"
import { MatchTabs } from "@/components/match-tabs"
import { OddsGrid } from "@/components/odds-grid"
import { getMatchBySlug } from "@/lib/matches-data"

interface MatchPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { slug } = await params
  const match = getMatchBySlug(slug)

  if (!match) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-6 md:px-8 md:py-8 max-w-6xl mx-auto pb-24 md:pb-8">
        <div className="flex items-center gap-4 mb-4">
          <BackButton />
        </div>

        <p className="text-muted-foreground text-sm mb-6">{match.date}</p>

        <div className="space-y-6">
          <MatchHeader
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            time={match.time}
          />

          <MatchTabs slug={slug} activeTab="odds" />

          <OddsGrid
            homeTeamShort={match.homeTeam.shortName}
            awayTeamShort={match.awayTeam.shortName}
          />
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
