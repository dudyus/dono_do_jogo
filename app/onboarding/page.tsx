"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { OnboardingQuestion } from "@/components/onboarding-question"
import { OnboardingOption } from "@/components/onboarding-option"

const ONBOARDING_STEPS = [
  {
    question: "Com que frequência você aposta?",
    options: ["1 vez na semana", "3 a 4 vezes na semana", "Todos os dias"],
  },
  {
    question: "Você costuma definir um limite de perda?",
    options: ["Sempre", "Nunca", "Às vezes"],
  },
  {
    question: "Que tipo de aposta você prefere?",
    options: ["Simples", "Múltiplas", "Ambas"],
  },
  {
    question: "Há quanto tempo você aposta?",
    options: ["Comecei agora", "Menos de 2 anos", "Mais de 2 anos"],
  },
  {
    question: "Qual seu principal objetivo ao apostar?",
    options: ["Diversão", "Renda extra", "Lucro constante"],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const totalSteps = ONBOARDING_STEPS.length
  const currentQuestion = ONBOARDING_STEPS[currentStep - 1]
  const selectedAnswer = answers[currentStep] || null
  const isLastStep = currentStep === totalSteps

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: option }))
  }

  const handleNext = () => {
    if (!selectedAnswer) return

    if (isLastStep) {
      router.push("/")
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={handleBack}
      showBackButton={currentStep > 1}
    >
      <OnboardingQuestion question={currentQuestion.question} />

      <div className="flex flex-col gap-3 mb-8">
        {currentQuestion.options.map((option) => (
          <OnboardingOption
            key={option}
            label={option}
            selected={selectedAnswer === option}
            onClick={() => handleSelectOption(option)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={`px-12 py-3 rounded-full font-medium text-sm transition-colors ${
            selectedAnswer
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
          }`}
        >
          {isLastStep ? "Finalizar" : "Próxima"}
        </button>
      </div>
    </OnboardingLayout>
  )
}
