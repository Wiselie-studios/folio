export type ShotOnType = "Dazz Cam" | "Lapse" | "Shot on iPhone" | "Mirrorless"

export const shotOnOptions: ShotOnType[] = ["Dazz Cam", "Lapse", "Shot on iPhone", "Mirrorless"]

export interface Photo {
  id: string
  url: string
  width: number
  height: number
  people: string[]
  date: string
  location: string
  vibe: string
  shotOn: ShotOnType
  likes: number
  likedBy: string[]
  albumId?: string
}

export interface Album {
  id: string
  name: string
  emoji: string
  coverPhotoId: string
  date: string
  description?: string
}

export interface InvitedUser {
  email: string
  name: string
  isAdmin: boolean
}

// invited users
export const invitedUsers: InvitedUser[] = [
  { email: "mj@wiselie.co", name: "Michael Junyer", isAdmin: true },
]

// Albums
export const albums: Album[] = []

// Photos
export const photos: Photo[] = []

// Get unique values for filters
export const getAllPeople = () => {
  const people = new Set<string>()
  photos.forEach(photo => photo.people.forEach(person => people.add(person)))
  return Array.from(people).sort()
}

export const getAllLocations = () => {
  const locations = new Set<string>()
  photos.forEach(photo => locations.add(photo.location))
  return Array.from(locations).sort()
}

export const getAllVibes = () => {
  const vibes = new Set<string>()
  photos.forEach(photo => vibes.add(photo.vibe))
  return Array.from(vibes).sort()
}

export const getAllMonths = () => {
  const months = new Set<string>()
  photos.forEach(photo => {
    const date = new Date(photo.date)
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    months.add(monthYear)
  })
  return Array.from(months).sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateB.getTime() - dateA.getTime()
  })
}
