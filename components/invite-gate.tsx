"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Logo } from "./logo"

export function InviteGate() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const result = login(email)
    if (!result.success) {
      setError(result.error || "Something went wrong")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-12">
          <Logo size="lg" showTagline className="items-center" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </FieldLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 bg-background border-border text-base"
                required
              />
              {error && (
                <FieldError>
                  {error}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Enter"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Access is invite-only. Contact the owner for an invite.
        </p>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-muted-foreground">
        © 2026 Wiselie Company. All rights reserved.
      </p>
    </div>
  )
}
