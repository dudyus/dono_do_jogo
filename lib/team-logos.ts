const logoMap: { keywords: string[]; logo: string }[] = [
  { keywords: ["arsenal"],                           logo: "/logos/arsenal.png" },
  { keywords: ["aston villa"],                       logo: "/logos/aston_villa.png" },
  { keywords: ["bournemouth"],                       logo: "/logos/bournemouth.png" },
  { keywords: ["brentford"],                         logo: "/logos/brentford.png" },
  { keywords: ["brighton"],                          logo: "/logos/brighton.png" },
  { keywords: ["chelsea"],                           logo: "/logos/chelsea.png" },
  { keywords: ["crystal palace"],                    logo: "/logos/crystal_palace.png" },
  { keywords: ["everton"],                           logo: "/logos/everton.png" },
  { keywords: ["fulham"],                            logo: "/logos/fulham.png" },
  { keywords: ["ipswich"],                           logo: "/logos/ipswich.png" },
  { keywords: ["leicester"],                         logo: "/logos/leicester.png" },
  { keywords: ["liverpool"],                         logo: "/logos/liverpool.png" },
  { keywords: ["manchester city", "man city"],       logo: "/logos/man_city.png" },
  { keywords: ["manchester united", "man united"],   logo: "/logos/man_united.png" },
  { keywords: ["newcastle"],                         logo: "/logos/newcastle.png" },
  { keywords: ["nottingham", "nott'm forest"],       logo: "/logos/nottingham_forest.png" },
  { keywords: ["southampton"],                       logo: "/logos/southampton.png" },
  { keywords: ["tottenham", "spurs"],                logo: "/logos/tottenham.png" },
  { keywords: ["west ham"],                          logo: "/logos/west_ham.png" },
  { keywords: ["wolverhampton", "wolves"],           logo: "/logos/wolves.png" },
  { keywords: ["leeds"],                             logo: "/logos/leeds_united.png" },
  { keywords: ["sunderland"],                        logo: "/logos/sunderland.png" },
  { keywords: ["hull city", "hull"],                 logo: "/logos/hull_city.png" },
  { keywords: ["coventry"],                          logo: "/logos/coventry_city.png" },
]

export function getTeamLogo(name: string): string | null {
  const lower = name.toLowerCase()
  for (const entry of logoMap) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.logo
    }
  }
  return null
}
