"use client"

import { AlbumCard } from "./album-card"
import type { Album, Photo } from "@/lib/data"

interface AlbumsGridProps {
  albums: Album[]
  photos: Photo[]
  onAlbumClick: (albumId: string) => void
}

export function AlbumsGrid({ albums, photos, onAlbumClick }: AlbumsGridProps) {
  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground text-lg">No albums yet</p>
        <p className="text-muted-foreground text-sm mt-1">
          Albums will appear here once created
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          photos={photos}
          onClick={() => onAlbumClick(album.id)}
        />
      ))}
    </div>
  )
}
