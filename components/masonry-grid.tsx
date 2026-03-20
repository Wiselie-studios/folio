"use client"

import { useMemo } from "react"
import { PhotoCard } from "./photo-card"
import type { Photo } from "@/lib/data"

interface MasonryGridProps {
  photos: Photo[]
  onPhotoClick?: (photoIndex: number) => void
}

export function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
  // We need different column counts for mobile (2) vs desktop (3)
  // Also track the original index for each photo
  const { mobileColumns, mobileIndexMap } = useMemo(() => {
    const cols: Photo[][] = [[], []]
    const indexMap: Map<string, number> = new Map()
    const colHeights = [0, 0]

    photos.forEach((photo, originalIndex) => {
      const shortestCol = colHeights.indexOf(Math.min(...colHeights))
      cols[shortestCol].push(photo)
      indexMap.set(photo.id, originalIndex)
      colHeights[shortestCol] += photo.height / photo.width
    })

    return { mobileColumns: cols, mobileIndexMap: indexMap }
  }, [photos])

  const { desktopColumns, desktopIndexMap } = useMemo(() => {
    const cols: Photo[][] = [[], [], []]
    const indexMap: Map<string, number> = new Map()
    const colHeights = [0, 0, 0]

    photos.forEach((photo, originalIndex) => {
      const shortestCol = colHeights.indexOf(Math.min(...colHeights))
      cols[shortestCol].push(photo)
      indexMap.set(photo.id, originalIndex)
      colHeights[shortestCol] += photo.height / photo.width
    })

    return { desktopColumns: cols, desktopIndexMap: indexMap }
  }, [photos])

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground text-lg">No photos found</p>
        <p className="text-muted-foreground text-sm mt-1">
          Try adjusting your filters
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: 2 columns with tight gap */}
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        {mobileColumns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2">
            {column.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={() => onPhotoClick?.(mobileIndexMap.get(photo.id) ?? 0)}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Desktop: 3 columns with larger gap */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
        {desktopColumns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6">
            {column.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={() => onPhotoClick?.(desktopIndexMap.get(photo.id) ?? 0)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
