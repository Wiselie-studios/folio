import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showTagline?: boolean
  className?: string
}

export function Logo({ size = "md", showTagline = false, className }: LogoProps) {
  const sizes = {
    sm: {
      folio: "text-xl",
      byline: "text-[10px]",
      tagline: "text-xs",
    },
    md: {
      folio: "text-2xl",
      byline: "text-[11px]",
      tagline: "text-sm",
    },
    lg: {
      folio: "text-4xl",
      byline: "text-xs",
      tagline: "text-base",
    },
  }

  return (
    <div className={cn("flex flex-col items-start", className)}>
      {/* Folio + by wiselie on the same row */}
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-serif italic tracking-tight text-foreground leading-none",
            sizes[size].folio
          )}
        >
          Folio
        </span>
        <span
          className={cn(
            "font-sans font-light text-muted-foreground tracking-wide lowercase leading-none",
            sizes[size].byline
          )}
        >
          by wiselie
        </span>
      </div>
      {/* Tagline — bigger, darker, clearly separated */}
      {showTagline && (
        <span
          className={cn(
            "font-sans font-normal italic text-foreground/60 tracking-wide leading-none mt-2",
            sizes[size].tagline
          )}
        >
          Life, curated.
        </span>
      )}
    </div>
  )
}
