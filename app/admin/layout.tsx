"use client"

import { AuthProvider } from "@/lib/auth-context"
import { PhotoStoreProvider } from "@/lib/photo-store"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <PhotoStoreProvider>
        {children}
      </PhotoStoreProvider>
    </AuthProvider>
  )
}
