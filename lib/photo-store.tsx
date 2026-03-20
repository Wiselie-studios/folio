"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { photos as initialPhotos, albums as initialAlbums, type Photo, type Album } from "./data"

interface PhotoStoreContextType {
  photos: Photo[]
  albums: Album[]
  toggleLike: (photoId: string, userEmail: string) => void
  addPhoto: (photo: Omit<Photo, "id" | "likes" | "likedBy">) => void
  addAlbum: (album: Omit<Album, "id">) => void
}

const PhotoStoreContext = createContext<PhotoStoreContextType | undefined>(undefined)

export function PhotoStoreProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)

  const toggleLike = useCallback((photoId: string, userEmail: string) => {
    setPhotos(prev => prev.map(photo => {
      if (photo.id !== photoId) return photo
      
      const isLiked = photo.likedBy.includes(userEmail)
      if (isLiked) {
        return {
          ...photo,
          likes: photo.likes - 1,
          likedBy: photo.likedBy.filter(email => email !== userEmail),
        }
      } else {
        return {
          ...photo,
          likes: photo.likes + 1,
          likedBy: [...photo.likedBy, userEmail],
        }
      }
    }))
  }, [])

  const addPhoto = useCallback((photoData: Omit<Photo, "id" | "likes" | "likedBy">) => {
    const newPhoto: Photo = {
      ...photoData,
      id: Date.now().toString(),
      likes: 0,
      likedBy: [],
    }
    setPhotos(prev => [newPhoto, ...prev])
  }, [])

  const addAlbum = useCallback((albumData: Omit<Album, "id">) => {
    const newAlbum: Album = {
      ...albumData,
      id: `album-${Date.now()}`,
    }
    setAlbums(prev => [newAlbum, ...prev])
  }, [])

  return (
    <PhotoStoreContext.Provider value={{ photos, albums, toggleLike, addPhoto, addAlbum }}>
      {children}
    </PhotoStoreContext.Provider>
  )
}

export function usePhotoStore() {
  const context = useContext(PhotoStoreContext)
  if (context === undefined) {
    throw new Error("usePhotoStore must be used within a PhotoStoreProvider")
  }
  return context
}
