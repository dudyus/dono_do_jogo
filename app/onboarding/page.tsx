"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { OnboardingQuestion } from "@/components/onboarding-question"
import { OnboardingOption } from "@/components/onboarding-option"
import { getUsuario, salvarUsuario } from "@/lib/auth"
import { api, ApiError, type Pergunta } from "@/lib/api"

export default function OnboardingPage() {
  const router = useRouter()
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [respostas, setRespostas] = useState<Record<number, number>>({})
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const usuario = getUsuario()
    if (!usuario) {
      router.push("/login")
      return
    }
    api
      .perguntas()
      .then(setPerguntas)
      .catch((err) => setErro(err instanceof ApiError ? err.message : "Falha ao conectar à API"))
      .finally(() => setCarregando(false))
  }, [router])

  const totalSteps = perguntas.length
  const currentQuestion = perguntas[currentStep - 1]
  const selectedAlternativaId = currentQuestion ? respostas[currentQuestion.id] ?? null : null
  const isLastStep = currentStep === totalSteps

  const handleSelectOption = (alternativaId: number) => {
    if (!currentQuestion) return
    setRespostas((prev) => ({ ...prev, [currentQuestion.id]: alternativaId }))
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const handleNext = async () => {
    if (!selectedAlternativaId) return

    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1)
      return
    }

    const usuario = getUsuario()
    if (!usuario) {
      router.push("/login")
      return
    }

    setEnviando(true)
    setErro("")
    try {
      const listaRespostas = Object.entries(respostas).map(([perguntaId, alternativaId]) => ({
        pergunta_id: Number(perguntaId),
        alternativa_id: alternativaId,
      }))
      const { anamnese_id } = await api.enviarAnamnese(usuario.id, listaRespostas)
      const resultado = await api.resultadoAnamnese(anamnese_id)
      if (resultado.usuario) salvarUsuario(resultado.usuario)
      router.push("/")
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Falha ao salvar seu perfil de risco")
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Carregando perguntas...</p>
      </div>
    )
  }

  if (erro && perguntas.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-destructive text-sm text-center">{erro}</p>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={handleBack}
      showBackButton={currentStep > 1}
    >
      <OnboardingQuestion question={currentQuestion.texto} />

      <div className="flex flex-col gap-3 mb-8">
        {currentQuestion.alternativas.map((alternativa) => (
          <OnboardingOption
            key={alternativa.id}
            label={alternativa.texto}
            selected={selectedAlternativaId === alternativa.id}
            onClick={() => handleSelectOption(alternativa.id)}
          />
        ))}
      </div>

      {erro && <p className="text-destructive text-sm text-center mb-4">{erro}</p>}

      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={!selectedAlternativaId || enviando}
          className={`px-12 py-3 rounded-full font-medium text-sm transition-colors ${
            selectedAlternativaId && !enviando
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
          }`}
        >
          {enviando ? "Salvando..." : isLastStep ? "Finalizar" : "Próxima"}
        </button>
      </div>
    </OnboardingLayout>
  )
}
