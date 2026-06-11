"use client"

import { useState } from "react"

interface TabsToggleProps {
  tabs: string[]
  defaultTab?: string
  onTabChange?: (tab: string) => void
}

export function TabsToggle({ tabs, defaultTab, onTabChange }: TabsToggleProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            activeTab === tab
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
