"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export type ResultType = "em-andamento" | "green" | "red"

interface ResultDropdownProps {
  value: ResultType
  onChange: (value: ResultType) => void
}

const resultOptions: { value: ResultType; label: string; color: string }[] = [
  { value: "em-andamento", label: "Em andamento", color: "bg-yellow-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
]

export function ResultDropdown({ value, onChange }: ResultDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = resultOptions.find((opt) => opt.value === value) || resultOptions[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded text-sm min-w-[140px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${selected.color}`} />
          <span className="text-foreground">{selected.label}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded shadow-lg z-10 min-w-[140px]">
          {resultOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${option.color}`} />
              <span className="text-foreground">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
