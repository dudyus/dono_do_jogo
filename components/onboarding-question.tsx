interface OnboardingQuestionProps {
  question: string
}

export function OnboardingQuestion({ question }: OnboardingQuestionProps) {
  return (
    <div className="mb-6">
      <div className="w-full h-px bg-border mb-4" />
      <h2 className="text-lg font-medium text-foreground text-center">
        {question}
      </h2>
    </div>
  )
}
