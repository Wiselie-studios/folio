"use client"

import { useEffect, useRef, useState } from "react"
import { Images, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

type View = "photos" | "albums"

interface BottomNavProps {
  currentView: View
  onViewChange: (view: View) => void
}

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const diff = currentScrollY - lastScrollY.current

          if (diff > 6) {
            // Scrolling down — hide
            setVisible(false)
          } else if (diff < -6) {
            // Scrolling up — show
            setVisible(true)
          }

          lastScrollY.current = currentScrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-8 sm:hidden transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "translate-y-28"
      )}
    >
      {/* Liquid glass pill */}
      <nav
        className="flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        <button
          onClick={() => onViewChange("photos")}
          className={cn(
            "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200",
            currentView === "photos"
              ? "bg-white/40 text-foreground shadow-sm"
              : "text-foreground/50 hover:text-foreground/80"
          )}
        >
          <Images className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Photos</span>
        </button>

        <button
          onClick={() => onViewChange("albums")}
          className={cn(
            "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200",
            currentView === "albums"
              ? "bg-white/40 text-foreground shadow-sm"
              : "text-foreground/50 hover:text-foreground/80"
          )}
        >
          <FolderOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Albums</span>
        </button>
      </nav>
    </div>
  )
}
