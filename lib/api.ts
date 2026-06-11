// Cliente HTTP da API (FastAPI). Base via NEXT_PUBLIC_API_URL.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    let detail = `Erro ${res.status}`
    try {
      const body = await res.json()
      detail = body.detail ?? detail
    } catch {
      // resposta sem JSON
    }
    throw new ApiError(detail, res.status)
  }

  return res.json() as Promise<T>
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// ---------- Tipos ----------

export type ResultadoAposta = "PENDENTE" | "GANHA" | "PERDIDA" | "CANCELADA"

export interface Banca {
  id: number
  usuario_id: number
  saldo_inicial: number
  saldo_atual: number
  stop_loss: number | null
  meta_diaria: number | null
  status: "ATIVA" | "FECHADA"
  data_criacao: string | null
  data_fechamento: string | null
}

export interface Aposta {
  id: number
  banca_id: number
  partida_id: number | null
  tipo_aposta: string
  odd: number | null
  valor: number | null
  lucro_prejuizo: number | null
  resultado: ResultadoAposta
  data: string | null
}

export interface ItemApostaMultipla {
  id: number
  multipla_id: number
  partida_id: number | null
  tipo_aposta: string
  odd: number
}

export interface ApostaMultipla {
  id: number
  banca_id: number
  usuario_id: number
  valor: number
  odd_total: number
  lucro_prejuizo: number | null
  resultado: ResultadoAposta
  data: string | null
  itens: ItemApostaMultipla[]
}

export interface BancaFlags {
  atingiu_meta: boolean
  atingiu_stop: boolean
  zerada: boolean
}

export interface MelhorAposta {
  tipo_aposta: string
  mercado: string
  selecao: string
  odd: number
  casa_aposta: string
  prob_modelo: number
  prob_implicita: number
  edge: number
  rotulo: string
}

export interface PartidaProxima {
  id: number
  time_casa: string
  time_fora: string
  data: string | null
  rodada: number | null
  gols_casa: number | null
  gols_fora: number | null
  melhor_aposta: MelhorAposta | null
  risco: string
}

export interface OddItem {
  tipo_aposta: string
  mercado: string
  selecao: string
  odd: number
  casa_aposta: string
}

export interface Recomendacao {
  partida_id: number
  time_casa: string
  time_fora: string
  gols_esperados: { casa: number; fora: number; total: number }
  probabilidades: Record<string, number>
  melhor_aposta: MelhorAposta | null
  risco: string
  justificativa: string
  odds: OddItem[]
}

// ---------- Auth ----------

export interface Usuario {
  id: number
  nome: string
  email: string
  perfil_risco: string | null
}

export const api = {
  // Usuario
  editarNome: (usuarioId: number, novo_nome: string) =>
    request<Usuario>(`/usuario/${usuarioId}/nome`, {
      method: "PATCH",
      body: JSON.stringify({ novo_nome }),
    }),

  editarEmail: (usuarioId: number, novo_email: string) =>
    request<Usuario>(`/usuario/${usuarioId}/email`, {
      method: "PATCH",
      body: JSON.stringify({ novo_email }),
    }),

  alterarSenha: (usuarioId: number, senha_atual: string, nova_senha: string) =>
    request<{ mensagem: string }>(`/usuario/${usuarioId}/senha`, {
      method: "PATCH",
      body: JSON.stringify({ senha_atual, nova_senha }),
    }),

  deletarUsuario: (usuarioId: number) =>
    request<{ mensagem: string }>(`/usuario/${usuarioId}`, { method: "DELETE" }),

  login: (email: string, senha: string) =>
    request<{ sucesso: boolean; mensagem: string; usuario?: Usuario }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    }),

  cadastro: (nome: string, email: string, senha: string) =>
    request<{ id: number; nome: string; email: string; mensagem: string }>("/cadastro", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha }),
    }),

  // Banca
  bancaAtiva: (usuarioId: number) =>
    request<{ banca: Banca | null; apostas?: Aposta[]; multiplas?: ApostaMultipla[]; flags?: BancaFlags }>(
      `/banca/ativa/${usuarioId}`
    ),

  criarBanca: (data: {
    usuario_id: number
    saldo_inicial: number
    stop_loss?: number | null
    meta_diaria?: number | null
  }) =>
    request<{ banca: Banca; flags: BancaFlags }>("/banca", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  editarBanca: (bancaId: number, data: { stop_loss?: number; meta_diaria?: number }) =>
    request<{ banca: Banca; flags: BancaFlags }>(`/banca/${bancaId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  fecharBanca: (bancaId: number) =>
    request<{ banca: Banca }>(`/banca/${bancaId}/fechar`, { method: "POST" }),

  historicoBancas: (usuarioId: number) =>
    request<{ historico: (Banca & {
      resultado_final: string
      apostas_ganhas: number
      apostas_perdidas: number
      apostas: Aposta[]
    })[] }>(`/banca/historico/${usuarioId}`),

  // Aposta
  criarAposta: (data: {
    banca_id: number
    usuario_id: number
    partida_id?: number | null
    tipo_aposta: string
    odd: number
    valor: number
  }) =>
    request<{ aposta: Aposta; banca: Banca; flags: BancaFlags }>("/aposta", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resultadoAposta: (apostaId: number, resultado: ResultadoAposta) =>
    request<{ aposta: Aposta; banca: Banca; flags: BancaFlags }>(
      `/aposta/${apostaId}/resultado`,
      { method: "PATCH", body: JSON.stringify({ resultado }) }
    ),

  criarApostaMultipla: (data: {
    banca_id: number
    usuario_id: number
    valor: number
    itens: { partida_id?: number | null; tipo_aposta: string; odd: number }[]
  }) =>
    request<{ multipla: ApostaMultipla; banca: Banca; flags: BancaFlags }>("/aposta-multipla", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  removerItemMultipla: (multiplaId: number, itemId: number) =>
    request<{ multipla: ApostaMultipla; banca: Banca; flags: BancaFlags }>(
      `/aposta-multipla/${multiplaId}/item/${itemId}`,
      { method: "DELETE" }
    ),

  resultadoApostaMultipla: (multiplaId: number, resultado: ResultadoAposta) =>
    request<{ multipla: ApostaMultipla; banca: Banca; flags: BancaFlags }>(
      `/aposta-multipla/${multiplaId}/resultado`,
      { method: "PATCH", body: JSON.stringify({ resultado }) }
    ),

  // Partidas / odds / recomendação
  partidasProximas: (limite = 10) =>
    request<{ partidas: PartidaProxima[] }>(`/partidas/proximas?limite=${limite}`),

  oddsPartida: (partidaId: number) =>
    request<{ partida: PartidaProxima; odds: OddItem[] }>(
      `/partidas/${partidaId}/odds`
    ),

  recomendacao: (partidaId: number) =>
    request<Recomendacao>(`/partidas/${partidaId}/recomendacao`),
}
