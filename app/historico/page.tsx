import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { BackButton } from "@/components/back-button"
import { HistoryTable } from "@/components/history-table"

export default function HistoricoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-6 md:px-8 pb-24 md:pb-8">
        <BackButton />

        <div className="max-w-4xl mx-auto mt-4">
          <HistoryTable />
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
