"use client"

interface ProfileFieldProps {
  label: string
  value: string
  type?: "text" | "password"
  buttonText: string
  buttonVariant?: "primary" | "warning"
  onEdit?: () => void
}

export function ProfileField({
  label,
  value,
  type = "text",
  buttonText,
  buttonVariant = "primary",
  onEdit,
}: ProfileFieldProps) {
  const displayValue = type === "password" ? "•".repeat(12) : value

  return (
    <div className="flex flex-row items-end gap-3">
      <div className="flex-1">
        <label className="block text-sm text-primary mb-2">{label}</label>
        <input
          type={type}
          value={displayValue}
          readOnly
          className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-foreground text-sm focus:outline-none"
        />
      </div>
      <button
        onClick={onEdit}
        className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
          buttonVariant === "warning"
            ? "bg-amber-600 hover:bg-amber-700 text-white"
            : "bg-primary hover:bg-primary/80 text-primary-foreground"
        }`}
      >
        {buttonText}
      </button>
    </div>
  )
}
