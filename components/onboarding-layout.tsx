"use client"

import { ChevronLeft } from "lucide-react"
import { OnboardingProgress } from "./onboarding-progress"

interface OnboardingLayoutProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  onBack?: () => void
  showBackButton?: boolean
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBackButton = true,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {showBackButton && currentStep > 1 && (
          <button
            onClick={onBack}
            className="absolute top-6 left-6 text-primary hover:text-primary/80 transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
          Perfil de Aposta
        </h1>

        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

        {children}
      </div>
    </div>
  )
}
