"use client"

import { useState, useMemo } from "react"
import { ArrowLeft } from "lucide-react"
import { Header } from "./header"
import { FilterBar, type Filters } from "./filter-bar"
import { MasonryGrid } from "./masonry-grid"
import { AlbumsGrid } from "./albums-grid"
import { PhotoViewer } from "./photo-viewer"
import { BottomNav } from "./bottom-nav"
import { Footer } from "./footer"
import { usePhotoStore } from "@/lib/photo-store"
import { Button } from "@/components/ui/button"

type View = "photos" | "albums"

export function Gallery() {
  const { photos, albums } = usePhotoStore()
  const [currentView, setCurrentView] = useState<View>("photos")
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0)
  const [filters, setFilters] = useState<Filters>({
    person: null,
    month: null,
    location: null,
    vibe: null,
    shotOn: null,
    search: "",
  })

  // Get the selected album
  const selectedAlbum = selectedAlbumId
    ? albums.find((a) => a.id === selectedAlbumId)
    : null

  // Filter photos based on current view and filters
  const filteredPhotos = useMemo(() => {
    let photosToFilter = photos

    // If viewing an album, only show photos from that album
    if (selectedAlbumId) {
      photosToFilter = photos.filter((p) => p.albumId === selectedAlbumId)
    }

    return photosToFilter.filter((photo) => {
      // Person filter
      if (filters.person && !photo.people.includes(filters.person)) {
        return false
      }

      // Month filter
      if (filters.month) {
        const photoDate = new Date(photo.date)
        const photoMonth = photoDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
        if (photoMonth !== filters.month) {
          return false
        }
      }

      // Location filter
      if (filters.location && photo.location !== filters.location) {
        return false
      }

      // Vibe filter
      if (filters.vibe && photo.vibe !== filters.vibe) {
        return false
      }

      // Shot on filter
      if (filters.shotOn && photo.shotOn !== filters.shotOn) {
        return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesLocation = photo.location.toLowerCase().includes(searchLower)
        const matchesPeople = photo.people.some((p) =>
          p.toLowerCase().includes(searchLower)
        )
        const matchesVibe = photo.vibe.toLowerCase().includes(searchLower)
        if (!matchesLocation && !matchesPeople && !matchesVibe) {
          return false
        }
      }

      return true
    })
  }, [photos, filters, selectedAlbumId])

  const handlePhotoClick = (index: number) => {
    setViewerInitialIndex(index)
    setViewerOpen(true)
  }

  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbumId(albumId)
    // Reset filters when entering an album
    setFilters({
      person: null,
      month: null,
      location: null,
      vibe: null,
      shotOn: null,
      search: "",
    })
  }

  const handleBackFromAlbum = () => {
    setSelectedAlbumId(null)
    setFilters({
      person: null,
      month: null,
      location: null,
      vibe: null,
      shotOn: null,
      search: "",
    })
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
    setSelectedAlbumId(null)
    setFilters({
      person: null,
      month: null,
      location: null,
      vibe: null,
      shotOn: null,
      search: "",
    })
  }

  const photoCount = filteredPhotos.length
  const totalCount = selectedAlbumId
    ? photos.filter((p) => p.albumId === selectedAlbumId).length
    : photos.length

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={selectedAlbumId ? "albums" : currentView}
        onViewChange={handleViewChange}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 sm:pb-16">
        {/* Album header when viewing an album */}
        {selectedAlbum && (
          <div className="pt-6 pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackFromAlbum}
              className="text-muted-foreground hover:text-foreground -ml-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to albums
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">
              {selectedAlbum.emoji} {selectedAlbum.name}
            </h1>
            {selectedAlbum.description && (
              <p className="text-muted-foreground mt-1">
                {selectedAlbum.description}
              </p>
            )}
          </div>
        )}

        {/* Show filter bar for photos view or album detail */}
        {(currentView === "photos" || selectedAlbumId) && (
          <FilterBar filters={filters} onFiltersChange={setFilters} />
        )}

        <div className="py-6">
          {currentView === "photos" || selectedAlbumId ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {photoCount === totalCount
                  ? `${totalCount} photos`
                  : `Showing ${photoCount} of ${totalCount} photos`}
              </p>
              <MasonryGrid
                photos={filteredPhotos}
                onPhotoClick={handlePhotoClick}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {albums.length} {albums.length === 1 ? "album" : "albums"}
              </p>
              <AlbumsGrid
                albums={albums}
                photos={photos}
                onAlbumClick={handleAlbumClick}
              />
            </>
          )}
        </div>
      </main>

      {/* Photo viewer modal */}
      {viewerOpen && (
        <PhotoViewer
          photos={filteredPhotos}
          initialIndex={viewerInitialIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      <Footer />

      {/* Mobile bottom nav — liquid glass */}
      <BottomNav
        currentView={selectedAlbumId ? "albums" : currentView}
        onViewChange={handleViewChange}
      />
    </div>
  )
}
