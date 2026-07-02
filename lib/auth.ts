"use client"

import type { Usuario } from "./api"

const KEY_USUARIO = "ddj_usuario"
const KEY_TOKEN = "ddj_token"

export function salvarSessao(usuario: Usuario, token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY_USUARIO, JSON.stringify(usuario))
  localStorage.setItem(KEY_TOKEN, token)
}

/** @deprecated use salvarSessao */
export function salvarUsuario(usuario: Usuario) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY_USUARIO, JSON.stringify(usuario))
}

export function getUsuario(): Usuario | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(KEY_USUARIO)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Usuario
  } catch {
    return null
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(KEY_TOKEN)
}

export function getUsuarioId(): number | null {
  return getUsuario()?.id ?? null
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY_USUARIO)
  localStorage.removeItem(KEY_TOKEN)
}
