"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, History } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 border-b border-border">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-primary font-bold text-xl md:text-2xl">
          Dono do Jogo
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        <NavItem href="/" icon={<Home className="w-4 h-4" />} label="Home" active={pathname === "/"} />
        <NavItem href="/banca" icon={<Wallet className="w-4 h-4" />} label="Banca" active={pathname === "/banca"} />
        <NavItem href="/historico" icon={<History className="w-4 h-4" />} label="Historico" active={pathname === "/historico"} />
      </nav>

      <UserDropdown />
    </header>
  )
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-sm transition-colors ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
