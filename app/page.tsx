import { Header } from "@/components/header"
import { MatchList } from "@/components/match-list"
import { MobileNav } from "@/components/mobile-nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6 md:px-8">
        <div className="mb-6">
          <h2 className="text-muted-foreground text-sm">Domingo, 26/04</h2>
        </div>
        
        <MatchList />
      </main>

      <MobileNav />
    </div>
  )
}
