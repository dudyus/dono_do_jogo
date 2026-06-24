import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const FUSO_PARTIDAS = "America/Sao_Paulo"

function paraDataUtc(iso: string): Date {
  const temFuso = /Z$|[+-]\d{2}:\d{2}$/.test(iso)
  return new Date(temFuso ? iso : `${iso}Z`)
}

export function formatarHorarioPartida(iso: string | null): string {
  if (!iso) return "--:--"
  return paraDataUtc(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUSO_PARTIDAS,
  })
}

export function formatarDataPartida(iso: string | null): string {
  if (!iso) return ""
  return paraDataUtc(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: FUSO_PARTIDAS,
  })
}

export function chaveDataPartida(iso: string | null): string {
  if (!iso) return "sem-data"
  return paraDataUtc(iso).toLocaleDateString("en-CA", { timeZone: FUSO_PARTIDAS })
}
