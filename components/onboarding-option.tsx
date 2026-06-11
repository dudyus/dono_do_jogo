"use client"

interface OnboardingOptionProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function OnboardingOption({ label, selected, onClick }: OnboardingOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-3 px-6 rounded-full border text-sm font-medium transition-colors ${
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-foreground border-border hover:border-primary/50"
      }`}
    >
      {label}
    </button>
  )
}
