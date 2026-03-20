"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { PhotoStoreProvider } from "@/lib/photo-store"
import { InviteGate } from "@/components/invite-gate"
import { Gallery } from "@/components/gallery"

function AppContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <InviteGate />
  }

  return <Gallery />
}

export default function HomePage() {
  return (
    <AuthProvider>
      <PhotoStoreProvider>
        <AppContent />
      </PhotoStoreProvider>
    </AuthProvider>
  )
}
