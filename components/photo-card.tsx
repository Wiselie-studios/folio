"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Download, MapPin, Calendar, Users, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { usePhotoStore } from "@/lib/photo-store"
import type { Photo } from "@/lib/data"

interface PhotoCardProps {
  photo: Photo
  onClick?: () => void
}

export function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const { user } = useAuth()
  const { toggleLike } = usePhotoStore()
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const isLiked = user?.email ? photo.likedBy.includes(user.email) : false

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (user?.email) {
      toggleLike(photo.id, user.email)
    }
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `folio-${photo.id}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const formattedDate = new Date(photo.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-muted cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="relative" style={{ paddingBottom: `${(photo.height / photo.width) * 100}%` }}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <Image
          src={photo.url}
          alt={`Photo from ${photo.location}`}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            isHovered ? "scale-105" : "scale-100",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Actions */}
      <div
        className={cn(
          "absolute top-3 right-3 flex gap-2 transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        )}
      >
        <button
          onClick={handleLike}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
            isLiked
              ? "bg-primary text-primary-foreground"
              : "bg-background/90 text-foreground hover:bg-background"
          )}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        </button>
        <button
          onClick={handleDownload}
          className="w-9 h-9 rounded-full bg-background/90 text-foreground flex items-center justify-center hover:bg-background transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Info overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="flex flex-col gap-2 text-background">
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-medium">{photo.location}</span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-background/80">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {photo.people.join(", ")}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {photo.vibe}
            </span>
          </div>
          {photo.likes > 0 && (
            <span className="text-xs text-background/70">
              {photo.likes} {photo.likes === 1 ? "like" : "likes"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
