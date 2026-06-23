import { Header } from "@/components/header"
import { MatchList } from "@/components/match-list"
import { MobileNav } from "@/components/mobile-nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-8 py-6">
        <div className="mb-6">
          <h2 className="text-muted-foreground text-sm">Próximas partidas · Premier League</h2>
        </div>
        
        <MatchList />
      </main>

      <MobileNav />
    </div>
  )
}
