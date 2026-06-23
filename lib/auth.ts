"use client"

import type { Usuario } from "./api"

const KEY = "ddj_usuario"

export function salvarUsuario(usuario: Usuario) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(usuario))
}

export function getUsuario(): Usuario | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Usuario
  } catch {
    return null
  }
}

export function getUsuarioId(): number | null {
  return getUsuario()?.id ?? null
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}
