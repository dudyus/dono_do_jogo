"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, History } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3">
      <div className="flex items-center justify-around">
        <MobileNavItem href="/" icon={<Home className="w-5 h-5" />} label="Home" active={pathname === "/"} />
        <MobileNavItem href="/banca" icon={<Wallet className="w-5 h-5" />} label="Banca" active={pathname === "/banca"} />
        <MobileNavItem href="/historico" icon={<History className="w-5 h-5" />} label="Historico" active={pathname === "/historico"} />
      </div>
    </nav>
  )
}

function MobileNavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 text-xs transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
