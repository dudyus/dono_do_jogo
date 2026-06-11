export interface Team {
  name: string
  logo: string
  shortName: string
}

export interface Match {
  id: number
  slug: string
  homeTeam: Team
  awayTeam: Team
  time: string
  date: string
  betTip: string
}

export const matches: Match[] = [
  {
    id: 1,
    slug: "gremio-vs-coritiba",
    homeTeam: {
      name: "Grêmio FPBA",
      shortName: "GRE",
      logo: "/logos/Gremio_logo.svg",
    },
    awayTeam: {
      name: "Coritiba",
      shortName: "COR",
      logo: "/logos/coritiba_logo.png",
    },
    time: "16:00",
    date: "Domingo, 26/04",
    betTip: "+0,5 impedimentos para o Grêmio",
  },
  {
    id: 2,
    slug: "corinthians-vs-vasco",
    homeTeam: {
      name: "Corinthians",
      shortName: "COR",
      logo: "/logos/corinthians_logo.png",
    },
    awayTeam: {
      name: "Vasco da Gama",
      shortName: "VAS",
      logo: "/logos/vasco_logo.png",
    },
    time: "16:00",
    date: "Domingo, 26/04",
    betTip: "1° tempo: Menos de 2.5 gols",
  },
  {
    id: 3,
    slug: "bragantino-vs-palmeiras",
    homeTeam: {
      name: "RB Bragantino",
      shortName: "BRA",
      logo: "/logos/bragantino_logo.png",
    },
    awayTeam: {
      name: "Palmeiras",
      shortName: "PAL",
      logo: "/logos/palmeiras_logo.webp",
    },
    time: "18:30",
    date: "Domingo, 26/04",
    betTip: "Ambas marcam: Sim",
  },
  {
    id: 4,
    slug: "athletico-vs-vitoria",
    homeTeam: {
      name: "Athletico-PR",
      shortName: "ATH",
      logo: "/logos/athletico_logo.png",
    },
    awayTeam: {
      name: "Vitória-BA",
      shortName: "VIT",
      logo: "/logos/vitoria_logo.png",
    },
    time: "18:30",
    date: "Domingo, 26/04",
    betTip: "Ambas marcam: Não",
  },
  {
    id: 5,
    slug: "atletico-mg-vs-flamengo",
    homeTeam: {
      name: "Atlético-MG",
      shortName: "CAM",
      logo: "/logos/atletico_logo.png",
    },
    awayTeam: {
      name: "Flamengo",
      shortName: "FLA",
      logo: "/logos/flamengo_logo.png",
    },
    time: "20:30",
    date: "Domingo, 26/04",
    betTip: "+1,5 gols na partida",
  },
]

export function getMatchBySlug(slug: string): Match | undefined {
  return matches.find((match) => match.slug === slug)
}
