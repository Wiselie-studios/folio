"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { usePhotoStore } from "@/lib/photo-store"
import { getAllPeople, getAllVibes } from "@/lib/data"
import { toast } from "sonner"

const sampleImages = [
  "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80",
  "https://images.unsplash.com/photo-1682686581484-a220483e6291?w=800&q=80",
  "https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=800&q=80",
  "https://images.unsplash.com/photo-1682695797873-aa4cb6edd613?w=800&q=80",
]

const albumEmojis = ["🌴", "🎉", "☀️", "✈️", "🏔️", "🎂", "💕", "🌃", "🍕", "🎸", "🏖️", "🎄"]

export default function AdminUploadPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { addPhoto, addAlbum, albums } = usePhotoStore()
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [vibe, setVibe] = useState("")
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])
  const [newPerson, setNewPerson] = useState("")
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New album form state
  const [showNewAlbum, setShowNewAlbum] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState("")
  const [newAlbumEmoji, setNewAlbumEmoji] = useState("🌴")
  const [newAlbumDescription, setNewAlbumDescription] = useState("")

  const existingPeople = getAllPeople()
  const existingVibes = getAllVibes()

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-lg font-medium text-foreground mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Only admins can upload photos.
          </p>
          <Link href="/">
            <Button variant="outline">Go back</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddPerson = () => {
    if (newPerson.trim() && !selectedPeople.includes(newPerson.trim())) {
      setSelectedPeople([...selectedPeople, newPerson.trim()])
      setNewPerson("")
    }
  }

  const handleRemovePerson = (person: string) => {
    setSelectedPeople(selectedPeople.filter((p) => p !== person))
  }

  const handleTogglePerson = (person: string) => {
    if (selectedPeople.includes(person)) {
      handleRemovePerson(person)
    } else {
      setSelectedPeople([...selectedPeople, person])
    }
  }

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) {
      toast.error("Please enter an album name")
      return
    }

    addAlbum({
      name: newAlbumName.trim(),
      emoji: newAlbumEmoji,
      coverPhotoId: "",
      date: new Date().toISOString().slice(0, 7),
      description: newAlbumDescription.trim() || undefined,
    })

    toast.success("Album created")
    setNewAlbumName("")
    setNewAlbumDescription("")
    setShowNewAlbum(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedImage || !location || !date || !vibe || selectedPeople.length === 0) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addPhoto({
      url: selectedImage,
      width: 4,
      height: 3,
      people: selectedPeople,
      date,
      location,
      vibe,
      albumId: selectedAlbumId || undefined,
    })

    toast.success("Photo uploaded successfully")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to gallery</span>
            </Link>
            <span className="text-lg font-medium tracking-tight text-foreground">
              Upload
            </span>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Selection */}
          <div>
            <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-4 block">
              Select a photo
            </FieldLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sampleImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden transition-all ${
                    selectedImage === img
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Sample ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              In a real app, you would upload your own photos here.
            </p>
          </div>

          {/* Location */}
          <FieldGroup>
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                Location
              </FieldLabel>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Paris, France"
                className="h-12 bg-background border-border"
              />
            </Field>
          </FieldGroup>

          {/* Date */}
          <FieldGroup>
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                Date
              </FieldLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 bg-background border-border"
              />
            </Field>
          </FieldGroup>

          {/* Vibe */}
          <FieldGroup>
            <Field>
              <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                Vibe / Mood
              </FieldLabel>
              <Select value={vibe} onValueChange={setVibe}>
                <SelectTrigger className="h-12 bg-background border-border">
                  <SelectValue placeholder="Select a vibe" />
                </SelectTrigger>
                <SelectContent>
                  {existingVibes.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                  <SelectItem value="cozy">cozy</SelectItem>
                  <SelectItem value="adventure">adventure</SelectItem>
                  <SelectItem value="celebration">celebration</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {/* Album */}
          <div>
            <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-4 block">
              Add to Album (Optional)
            </FieldLabel>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                onClick={() => setSelectedAlbumId("")}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  selectedAlbumId === ""
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                None
              </button>
              {albums.map((album) => (
                <button
                  key={album.id}
                  type="button"
                  onClick={() => setSelectedAlbumId(album.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    selectedAlbumId === album.id
                      ? "bg-foreground text-background"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {album.emoji} {album.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowNewAlbum(!showNewAlbum)}
                className="px-4 py-2 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                New Album
              </button>
            </div>

            {/* New Album Form */}
            {showNewAlbum && (
              <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {albumEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewAlbumEmoji(emoji)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors ${
                          newAlbumEmoji === emoji
                            ? "bg-foreground text-background"
                            : "bg-background hover:bg-accent"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  type="text"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="Album name"
                  className="h-11 bg-background border-border"
                />
                <Input
                  type="text"
                  value={newAlbumDescription}
                  onChange={(e) => setNewAlbumDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="h-11 bg-background border-border"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewAlbum(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateAlbum}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    Create Album
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* People */}
          <div>
            <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-4 block">
              Tag People
            </FieldLabel>

            {/* Existing people chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {existingPeople.map((person) => (
                <button
                  key={person}
                  type="button"
                  onClick={() => handleTogglePerson(person)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedPeople.includes(person)
                      ? "bg-foreground text-background"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {person}
                </button>
              ))}
            </div>

            {/* Selected people (new ones) */}
            {selectedPeople.filter((p) => !existingPeople.includes(p)).length >
              0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPeople
                  .filter((p) => !existingPeople.includes(p))
                  .map((person) => (
                    <span
                      key={person}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-foreground text-background"
                    >
                      {person}
                      <button
                        type="button"
                        onClick={() => handleRemovePerson(person)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            {/* Add new person */}
            <div className="flex gap-2">
              <Input
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Add new person"
                className="h-10 bg-background border-border flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddPerson()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddPerson}
                className="h-10 w-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  )
}
