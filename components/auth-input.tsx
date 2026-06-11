"use client"

interface AuthInputProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export function AuthInput({ 
  label, 
  type = "text", 
  placeholder,
  value,
  onChange 
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-primary">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-muted-foreground/30 py-2 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
      />
    </div>
  )
}
