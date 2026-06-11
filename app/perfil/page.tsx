"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileAvatar } from "@/components/profile-avatar"
import { ProfileField } from "@/components/profile-field"
import { DeleteAccountSection } from "@/components/delete-account-section"
import { getUsuario, salvarUsuario, logout } from "@/lib/auth"
import { api, ApiError, type Usuario } from "@/lib/api"

type Modal = "nome" | "email" | "senha" | null

export default function PerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [modal, setModal] = useState<Modal>(null)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [carregando, setCarregando] = useState(false)

  // campos dos formulários
  const [novoNome, setNovoNome] = useState("")
  const [novoEmail, setNovoEmail] = useState("")
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  useEffect(() => {
    const u = getUsuario()
    if (!u) { router.push("/login"); return }
    setUsuario(u)
  }, [router])

  const abrirModal = (tipo: Modal) => {
    setErro("")
    setSucesso("")
    if (tipo === "nome") setNovoNome(usuario?.nome ?? "")
    if (tipo === "email") setNovoEmail(usuario?.email ?? "")
    if (tipo === "senha") { setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha("") }
    setModal(tipo)
  }

  const fecharModal = () => { setModal(null); setErro(""); setSucesso("") }

  const salvarNome = async () => {
    if (!usuario) return
    if (!novoNome.trim()) { setErro("Nome não pode ser vazio"); return }
    setCarregando(true); setErro("")
    try {
      const atualizado = await api.editarNome(usuario.id, novoNome.trim())
      salvarUsuario(atualizado)
      setUsuario(atualizado)
      setSucesso("Nome atualizado!")
      setTimeout(fecharModal, 1200)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao atualizar nome")
    } finally { setCarregando(false) }
  }

  const salvarEmail = async () => {
    if (!usuario) return
    if (!novoEmail.trim()) { setErro("Email não pode ser vazio"); return }
    setCarregando(true); setErro("")
    try {
      const atualizado = await api.editarEmail(usuario.id, novoEmail.trim())
      salvarUsuario(atualizado)
      setUsuario(atualizado)
      setSucesso("Email atualizado!")
      setTimeout(fecharModal, 1200)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao atualizar email")
    } finally { setCarregando(false) }
  }

  const salvarSenha = async () => {
    if (!usuario) return
    if (!senhaAtual) { setErro("Informe a senha atual"); return }
    if (novaSenha.length < 6) { setErro("Nova senha deve ter pelo menos 6 caracteres"); return }
    if (novaSenha !== confirmarSenha) { setErro("As senhas não coincidem"); return }
    setCarregando(true); setErro("")
    try {
      await api.alterarSenha(usuario.id, senhaAtual, novaSenha)
      setSucesso("Senha alterada!")
      setTimeout(fecharModal, 1200)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao alterar senha")
    } finally { setCarregando(false) }
  }

  const deletarConta = async () => {
    if (!usuario) return
    setCarregando(true); setErro("")
    try {
      await api.deletarUsuario(usuario.id)
      logout()
      router.push("/cadastro")
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao excluir conta")
      setCarregando(false)
    }
  }

  const handleSignOut = () => { logout(); router.push("/login") }

  if (!usuario) return null

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader title="Informações de perfil" onSignOut={handleSignOut} />

      <main className="max-w-2xl mx-auto px-6 py-6">
        <div className="mb-6"><BackButton /></div>

        <div className="bg-card rounded-lg border border-border p-8">
          <div className="mb-8">
            <ProfileAvatar name={usuario.nome} />
          </div>

          <div className="space-y-6">
            <ProfileField
              label="Nome"
              value={usuario.nome}
              buttonText="Editar nome"
              onEdit={() => abrirModal("nome")}
            />
            <ProfileField
              label="Email"
              value={usuario.email}
              buttonText="Editar email"
              onEdit={() => abrirModal("email")}
            />
            <ProfileField
              label="Senha"
              value=""
              type="password"
              buttonText="Mudar senha"
              buttonVariant="primary"
              onEdit={() => abrirModal("senha")}
            />
          </div>

          <div className="mt-8">
            <DeleteAccountSection onDelete={deletarConta} carregando={carregando} />
          </div>
        </div>
      </main>

      {/* ── Overlay de modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-6 shadow-xl">

            {/* Editar nome */}
            {modal === "nome" && (
              <>
                <h2 className="text-base font-semibold text-foreground mb-4">Editar nome</h2>
                <label className="block text-xs text-primary mb-1">Novo nome</label>
                <input
                  autoFocus
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                />
              </>
            )}

            {/* Editar email */}
            {modal === "email" && (
              <>
                <h2 className="text-base font-semibold text-foreground mb-4">Editar email</h2>
                <label className="block text-xs text-primary mb-1">Novo email</label>
                <input
                  autoFocus
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                />
              </>
            )}

            {/* Alterar senha */}
            {modal === "senha" && (
              <>
                <h2 className="text-base font-semibold text-foreground mb-4">Alterar senha</h2>
                {(["Senha atual", "Nova senha", "Confirmar nova senha"] as const).map((label, i) => {
                  const values = [senhaAtual, novaSenha, confirmarSenha]
                  const setters = [setSenhaAtual, setNovaSenha, setConfirmarSenha]
                  return (
                    <div key={label} className="mb-3">
                      <label className="block text-xs text-primary mb-1">{label}</label>
                      <input
                        autoFocus={i === 0}
                        type="password"
                        value={values[i]}
                        onChange={(e) => setters[i](e.target.value)}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  )
                })}
                <div className="mb-4" />
              </>
            )}

            {erro && <p className="text-xs text-destructive mb-3">{erro}</p>}
            {sucesso && <p className="text-xs text-green-500 mb-3">{sucesso}</p>}

            <div className="flex gap-3 justify-end">
              <button
                onClick={fecharModal}
                disabled={carregando}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={modal === "nome" ? salvarNome : modal === "email" ? salvarEmail : salvarSenha}
                disabled={carregando}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {carregando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
