import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { BackButton } from "@/components/back-button"
import { MatchHeader } from "@/components/match-header"
import { MatchTabs } from "@/components/match-tabs"
import { BookmakerSelect } from "@/components/bookmaker-select"
import { FeaturedBetsGrid } from "@/components/featured-bets-grid"
import { getMatchBySlug } from "@/lib/matches-data"

interface FeaturedBetsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function FeaturedBetsPage({ params }: FeaturedBetsPageProps) {
  const { slug } = await params
  const match = getMatchBySlug(slug)

  if (!match) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-8 py-8 max-w-6xl mx-auto pb-8">
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

          <div className="flex items-center justify-center gap-2">
            <MatchTabs slug={slug} activeTab="apostas-destacadas" />
            <BookmakerSelect />
          </div>

          <FeaturedBetsGrid />
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
