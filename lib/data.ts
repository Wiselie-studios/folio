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
export const photos: Photo[] = [
  {
    id: "1",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1773994506/fqs_2025-06-13_215234.540_egzyzj.jpg",
    width: 3,
    height: 4,
    people: ["Christina", "Caela"],
    date: "2025-06-13",
    location: "Harbor House Cafe",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "2",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1773994507/fqs_2025-06-13_215720.814_mo6oqw.jpg",
    width: 3,
    height: 4,
    people: ["Christina", "Caela"],
    date: "2025-06-13",
    location: "Harbor House Cafe",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
]

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
