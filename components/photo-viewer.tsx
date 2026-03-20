"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { X, Heart, Download, ChevronLeft, ChevronRight, MapPin, Calendar, Users, Sparkles, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { usePhotoStore } from "@/lib/photo-store"
import type { Photo } from "@/lib/data"

interface PhotoViewerProps {
  photos: Photo[]
  initialIndex: number
  onClose: () => void
}

export function PhotoViewer({ photos, initialIndex, onClose }: PhotoViewerProps) {
  const { user } = useAuth()
  const { toggleLike } = usePhotoStore()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDraggingZoom, setIsDraggingZoom] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null)
  
  // Swipe state for physical dragging
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeStartX, setSwipeStartX] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)

  const photo = photos[currentIndex]
  const isLiked = user?.email ? photo.likedBy.includes(user.email) : false

  const formattedDate = new Date(photo.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const goToPrevious = useCallback(() => {
    if (currentIndex === 0) {
      // Bounce back if at first photo
      setIsAnimating(true)
      setSwipeOffset(0)
      setTimeout(() => setIsAnimating(false), 300)
      return
    }
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setIsAnimating(true)
    setSwipeOffset(window.innerWidth)
    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1)
      setSwipeOffset(0)
      setIsAnimating(false)
    }, 300)
  }, [currentIndex])

  const goToNext = useCallback(() => {
    if (currentIndex === photos.length - 1) {
      // Bounce back if at last photo
      setIsAnimating(true)
      setSwipeOffset(0)
      setTimeout(() => setIsAnimating(false), 300)
      return
    }
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setIsAnimating(true)
    setSwipeOffset(-window.innerWidth)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setSwipeOffset(0)
      setIsAnimating(false)
    }, 300)
  }, [currentIndex, photos.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, goToPrevious, goToNext])

  // Scroll to zoom (desktop)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setScale((prev) => Math.min(Math.max(1, prev + delta), 4))
    if (scale + delta <= 1) {
      setPosition({ x: 0, y: 0 })
    }
  }, [scale])

  // Touch handlers for pinch-to-zoom and physical swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      setTouchStartDistance(distance)
    } else if (e.touches.length === 1 && scale === 1) {
      // Start swipe
      setSwipeStartX(e.touches[0].clientX)
      setIsSwiping(true)
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan zoomed image
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y })
      setIsDraggingZoom(true)
    }
  }, [scale, position])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistance !== null) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const delta = (distance - touchStartDistance) / 200
      setScale((prev) => Math.min(Math.max(1, prev + delta), 4))
      setTouchStartDistance(distance)
    } else if (isSwiping && e.touches.length === 1 && scale === 1) {
      // Physical swipe - image follows finger
      const currentX = e.touches[0].clientX
      const deltaX = currentX - swipeStartX
      
      // Add resistance at edges
      const isAtStart = currentIndex === 0 && deltaX > 0
      const isAtEnd = currentIndex === photos.length - 1 && deltaX < 0
      
      if (isAtStart || isAtEnd) {
        // Rubber band effect at edges
        setSwipeOffset(deltaX * 0.3)
      } else {
        setSwipeOffset(deltaX)
      }
    } else if (isDraggingZoom && e.touches.length === 1 && scale > 1) {
      // Pan zoomed image
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    }
  }, [touchStartDistance, isSwiping, scale, swipeStartX, currentIndex, photos.length, isDraggingZoom, dragStart])

  const handleTouchEnd = useCallback(() => {
    if (isSwiping && scale === 1) {
      const threshold = window.innerWidth * 0.2 // 20% of screen width
      const velocity = Math.abs(swipeOffset) / 100 // Simple velocity check
      
      if (swipeOffset > threshold || (swipeOffset > 50 && velocity > 1)) {
        // Swipe right - go to previous
        if (currentIndex > 0) {
          setIsAnimating(true)
          setSwipeOffset(window.innerWidth)
          setTimeout(() => {
            setCurrentIndex((prev) => prev - 1)
            setSwipeOffset(0)
            setIsAnimating(false)
          }, 250)
        } else {
          // Snap back
          setIsAnimating(true)
          setSwipeOffset(0)
          setTimeout(() => setIsAnimating(false), 250)
        }
      } else if (swipeOffset < -threshold || (swipeOffset < -50 && velocity > 1)) {
        // Swipe left - go to next
        if (currentIndex < photos.length - 1) {
          setIsAnimating(true)
          setSwipeOffset(-window.innerWidth)
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1)
            setSwipeOffset(0)
            setIsAnimating(false)
          }, 250)
        } else {
          // Snap back
          setIsAnimating(true)
          setSwipeOffset(0)
          setTimeout(() => setIsAnimating(false), 250)
        }
      } else {
        // Snap back to center
        setIsAnimating(true)
        setSwipeOffset(0)
        setTimeout(() => setIsAnimating(false), 250)
      }
    }
    
    setTouchStartDistance(null)
    setIsSwiping(false)
    setIsDraggingZoom(false)
  }, [isSwiping, scale, swipeOffset, currentIndex, photos.length])

  // Mouse drag for desktop swipe
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDraggingZoom(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    } else {
      setSwipeStartX(e.clientX)
      setIsSwiping(true)
    }
  }, [scale, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingZoom && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    } else if (isSwiping && scale === 1) {
      const deltaX = e.clientX - swipeStartX
      
      // Add resistance at edges
      const isAtStart = currentIndex === 0 && deltaX > 0
      const isAtEnd = currentIndex === photos.length - 1 && deltaX < 0
      
      if (isAtStart || isAtEnd) {
        setSwipeOffset(deltaX * 0.3)
      } else {
        setSwipeOffset(deltaX)
      }
    }
  }, [isDraggingZoom, scale, dragStart, isSwiping, swipeStartX, currentIndex, photos.length])

  const handleMouseUp = useCallback(() => {
    if (isSwiping && scale === 1) {
      const threshold = window.innerWidth * 0.15
      
      if (swipeOffset > threshold && currentIndex > 0) {
        setIsAnimating(true)
        setSwipeOffset(window.innerWidth)
        setTimeout(() => {
          setCurrentIndex((prev) => prev - 1)
          setSwipeOffset(0)
          setIsAnimating(false)
        }, 250)
      } else if (swipeOffset < -threshold && currentIndex < photos.length - 1) {
        setIsAnimating(true)
        setSwipeOffset(-window.innerWidth)
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1)
          setSwipeOffset(0)
          setIsAnimating(false)
        }, 250)
      } else {
        setIsAnimating(true)
        setSwipeOffset(0)
        setTimeout(() => setIsAnimating(false), 250)
      }
    }
    
    setIsDraggingZoom(false)
    setIsSwiping(false)
  }, [isSwiping, scale, swipeOffset, currentIndex, photos.length])

  const handleLike = () => {
    if (user?.email) {
      toggleLike(photo.id, user.email)
    }
  }

  const handleDownload = async () => {
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

  // Get adjacent photos for peek effect
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : null
  const nextPhoto = currentIndex < photos.length - 1 ? photos[currentIndex + 1] : null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Navigation arrows (desktop) */}
      <button
        onClick={goToPrevious}
        className={cn(
          "hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white items-center justify-center hover:bg-white/20 transition-colors",
          currentIndex === 0 && "opacity-30 cursor-not-allowed"
        )}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className={cn(
          "hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white items-center justify-center hover:bg-white/20 transition-colors",
          currentIndex === photos.length - 1 && "opacity-30 cursor-not-allowed"
        )}
        disabled={currentIndex === photos.length - 1}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Photo carousel container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
          cursor: scale > 1 
            ? (isDraggingZoom ? "grabbing" : "grab") 
            : (isSwiping ? "grabbing" : "grab"),
          touchAction: "none"
        }}
      >
        {/* Carousel track with all three images */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center",
            isAnimating && "transition-transform duration-250 ease-out"
          )}
          style={{
            transform: `translateX(${swipeOffset}px)`,
          }}
        >
          {/* Previous photo (peeking from left) */}
          {prevPhoto && (
            <div 
              className="absolute inset-y-0 flex items-center justify-center"
              style={{ 
                width: "100%",
                right: "100%",
              }}
            >
              <div className="relative w-full h-full opacity-60">
                <Image
                  src={prevPhoto.url}
                  alt={`Photo from ${prevPhoto.location}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  draggable={false}
                />
              </div>
            </div>
          )}

          {/* Current photo */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: scale > 1 ? `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)` : undefined,
            }}
          >
            <Image
              src={photo.url}
              alt={`Photo from ${photo.location}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              draggable={false}
            />
          </div>

          {/* Next photo (peeking from right) */}
          {nextPhoto && (
            <div 
              className="absolute inset-y-0 flex items-center justify-center"
              style={{ 
                width: "100%",
                left: "100%",
              }}
            >
              <div className="relative w-full h-full opacity-60">
                <Image
                  src={nextPhoto.url}
                  alt={`Photo from ${nextPhoto.location}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  draggable={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto px-4 pb-6 pt-16 pointer-events-auto">
          {/* Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center transition-colors",
                  isLiked
                    ? "bg-white text-black"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                )}
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              </button>
              <button
                onClick={handleDownload}
                className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
            
            {/* Photo counter */}
            <span className="text-white/60 text-sm font-medium">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {photo.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {photo.people.join(", ")}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {photo.vibe}
            </span>
            {photo.shotOn && (
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                {photo.shotOn}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
