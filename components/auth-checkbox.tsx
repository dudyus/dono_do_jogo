"use client"

import { Check } from "lucide-react"

interface AuthCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function AuthCheckbox({ label, checked, onChange }: AuthCheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
          checked 
            ? "bg-primary border-primary" 
            : "border-muted-foreground/50 bg-transparent"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-background" />}
      </div>
      <span className="text-sm text-primary">{label}</span>
    </label>
  )
}
