"use client"

import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileAvatarProps {
  name: string
  imageUrl?: string
  onChangePhoto?: () => void
}

export function ProfileAvatar({ name, imageUrl, onChangePhoto }: ProfileAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="w-24 h-24 border-2 border-border">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={onChangePhoto}
          className="absolute bottom-0 right-0 bg-muted border border-border rounded-full p-1.5 hover:bg-muted/80 transition-colors"
          aria-label="Alterar foto"
        >
          <Camera className="w-4 h-4 text-foreground" />
        </button>
      </div>
      <h2 className="text-xl font-semibold text-foreground">{name}</h2>
    </div>
  )
}
