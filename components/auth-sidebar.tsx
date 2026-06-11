import Link from "next/link"

interface AuthSidebarProps {
  title: string
  subtitle: string
  ctaText: string
  ctaButtonText: string
  ctaHref: string
}

export function AuthSidebar({
  title,
  subtitle,
  ctaText,
  ctaButtonText,
  ctaHref,
}: AuthSidebarProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-primary p-12 text-center">
      
      <h1 className="text-5xl font-bold text-white mb-6 text-balance leading-tight">
        {title}
      </h1>

      <p className="text-white/90 text-xl mb-12 max-w-md leading-relaxed">
        {subtitle}
      </p>

      <p className="text-white/80 text-base mb-4 mt-12">
        {ctaText}
      </p>

      <Link
        href={ctaHref}
        className="w-full max-w-xs bg-white text-primary py-3 rounded-md font-medium hover:bg-white/90 transition-colors"
      >
        {ctaButtonText}
      </Link>

    </div>
  )
}