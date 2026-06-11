"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const bookmakers = ["Betano", "Bet365", "KTO", "SportingBet", "Pixbet", "Betfair"]

interface BookmakerSelectProps {
  defaultValue?: string
  onChange?: (value: string) => void
}

export function BookmakerSelect({ defaultValue = "Betano", onChange }: BookmakerSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue)

  const handleSelect = (bookmaker: string) => {
    setSelected(bookmaker)
    setIsOpen(false)
    onChange?.(bookmaker)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground"
      >
        <span>{selected}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-md shadow-lg z-10 min-w-[120px]">
          {bookmakers.map((bookmaker) => (
            <button
              key={bookmaker}
              onClick={() => handleSelect(bookmaker)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                selected === bookmaker ? "text-primary" : "text-foreground"
              }`}
            >
              {bookmaker}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
