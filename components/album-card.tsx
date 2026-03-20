"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Album, Photo } from "@/lib/data"

interface AlbumCardProps {
  album: Album
  photos: Photo[]
  onClick: () => void
}

export function AlbumCard({ album, photos, onClick }: AlbumCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const coverPhoto = photos.find((p) => p.id === album.coverPhotoId)
  const photoCount = photos.filter((p) => p.albumId === album.id).length

  const formattedDate = new Date(album.date + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <button
      onClick={onClick}
      className="group text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        {coverPhoto && (
          <Image
            src={coverPhoto.url}
            alt={album.name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              "group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Emoji badge */}
        <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-lg">
          {album.emoji}
        </div>
      </div>

      <div className="mt-3 px-1">
        <h3 className="font-medium text-foreground group-hover:text-foreground/80 transition-colors">
          {album.emoji} {album.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {photoCount} {photoCount === 1 ? "photo" : "photos"} · {formattedDate}
        </p>
      </div>
    </button>
  )
}
