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

// Mock invited users
export const invitedUsers: InvitedUser[] = [
  { email: "alex@example.com", name: "Alex", isAdmin: true },
  { email: "jordan@example.com", name: "Jordan", isAdmin: false },
  { email: "sam@example.com", name: "Sam", isAdmin: false },
  { email: "taylor@example.com", name: "Taylor", isAdmin: false },
  { email: "casey@example.com", name: "Casey", isAdmin: false },
]

// Mock albums
export const albums: Album[] = [
  {
    id: "album-1",
    name: "Miami Trip",
    emoji: "🌴",
    coverPhotoId: "7",
    date: "2024-08",
    description: "Summer vibes in Miami Beach",
  },
  {
    id: "album-2",
    name: "New Year's",
    emoji: "🎉",
    coverPhotoId: "2",
    date: "2024-01",
    description: "Ringing in the new year",
  },
  {
    id: "album-3",
    name: "Summer 2024",
    emoji: "☀️",
    coverPhotoId: "3",
    date: "2024-06",
    description: "Beach days and travel",
  },
  {
    id: "album-4",
    name: "Europe Trip",
    emoji: "✈️",
    coverPhotoId: "1",
    date: "2024-04",
    description: "Exploring Italy and Greece",
  },
]

// Mock photo data with Unsplash images
export const photos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    width: 4,
    height: 5,
    people: ["Alex", "Jordan"],
    date: "2024-08-15",
    location: "Santorini, Greece",
    vibe: "travel",
    shotOn: "Mirrorless",
    likes: 12,
    likedBy: ["jordan@example.com", "sam@example.com"],
    albumId: "album-4",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    width: 3,
    height: 4,
    people: ["Sam", "Taylor", "Casey"],
    date: "2024-07-22",
    location: "Brooklyn, NY",
    vibe: "night out",
    shotOn: "Dazz Cam",
    likes: 8,
    likedBy: ["alex@example.com"],
    albumId: "album-2",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    width: 16,
    height: 9,
    people: ["Jordan", "Casey"],
    date: "2024-06-10",
    location: "Malibu, CA",
    vibe: "beach",
    shotOn: "Shot on iPhone",
    likes: 15,
    likedBy: ["sam@example.com", "taylor@example.com"],
    albumId: "album-3",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
    width: 4,
    height: 6,
    people: ["Alex"],
    date: "2024-09-01",
    location: "Swiss Alps",
    vibe: "travel",
    shotOn: "Mirrorless",
    likes: 20,
    likedBy: ["jordan@example.com", "casey@example.com"],
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    width: 3,
    height: 4,
    people: ["Taylor", "Sam"],
    date: "2024-05-18",
    location: "Austin, TX",
    vibe: "night out",
    shotOn: "Lapse",
    likes: 6,
    likedBy: [],
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    width: 16,
    height: 10,
    people: ["Alex", "Jordan", "Sam"],
    date: "2024-04-05",
    location: "Lake Como, Italy",
    vibe: "travel",
    likes: 25,
    likedBy: ["taylor@example.com", "casey@example.com"],
    albumId: "album-4",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
    width: 4,
    height: 5,
    people: ["Casey"],
    date: "2024-08-20",
    location: "Miami Beach, FL",
    vibe: "beach",
    likes: 11,
    likedBy: ["alex@example.com", "jordan@example.com"],
    albumId: "album-1",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=800&q=80",
    width: 1,
    height: 1,
    people: ["Jordan", "Taylor"],
    date: "2024-03-12",
    location: "Tokyo, Japan",
    vibe: "travel",
    likes: 18,
    likedBy: ["sam@example.com"],
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    width: 3,
    height: 2,
    people: ["Sam", "Alex", "Casey"],
    date: "2024-07-04",
    location: "Los Angeles, CA",
    vibe: "night out",
    likes: 9,
    likedBy: ["taylor@example.com"],
    albumId: "album-3",
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    width: 4,
    height: 3,
    people: ["Taylor"],
    date: "2024-06-28",
    location: "Bali, Indonesia",
    vibe: "beach",
    likes: 14,
    likedBy: ["alex@example.com", "jordan@example.com", "casey@example.com"],
    albumId: "album-3",
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    width: 4,
    height: 5,
    people: ["Alex", "Sam"],
    date: "2024-02-14",
    location: "Paris, France",
    vibe: "dinner",
    likes: 22,
    likedBy: ["jordan@example.com"],
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    width: 16,
    height: 9,
    people: ["Jordan"],
    date: "2024-09-10",
    location: "Yosemite, CA",
    vibe: "nature",
    likes: 30,
    likedBy: ["sam@example.com", "taylor@example.com", "casey@example.com"],
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
