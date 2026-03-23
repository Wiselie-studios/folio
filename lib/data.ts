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
    people: ["Christina Turner", "Caela Steele"],
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
    people: ["Christina Turner", "Caela Steele"],
    date: "2025-06-13",
    location: "Harbor House Cafe",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "3",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1774233770/IMG_0727_zya2hb.jpg",
    width: 3,
    height: 4,
    people: ["Ian Waller"],
    date: "2026-03-22",
    location: "Newport Beach",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "4",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1774233767/IMG_0726_munceh.jpg",
    width: 3,
    height: 4,
    people: ["Ian Waller"],
    date: "2026-03-22",
    location: "Newport Beach",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "5",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1774233767/IMG_0736_m45j0k.jpg",
    width: 3,
    height: 4,
    people: ["Ian Waller"],
    date: "2026-03-22",
    location: "Newport Beach",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "6",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1774233767/IMG_0732_jzdwe2.jpg",
    width: 3,
    height: 4,
    people: ["Ian Waller"],
    date: "2026-03-22",
    location: "Newport Beach",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "7",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1774233656/IMG_0724_twnkfe.jpg",
    width: 3,
    height: 4,
    people: ["MJ Jones", "Lola". "Cohen Swift", "Grace Rawlins", "Sofia Toledo", "Greysa Lemons"],
    date: "2026-03-21",
    location: "The Getty",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "8",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1774233643/IMG_0714_nlqtvc.jpg",
    width: 3,
    height: 4,
    people: ["Lola"],
    date: "2026-03-21",
    location: "The Getty",
    vibe: "",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "9",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1774233636/IMG_0703_fcd2zj.jpg",
    width: 3,
    height: 4,
    people: [],
    date: "2026-03-21",
    location: "La La Land Cafe Beverly Hills",
    vibe: "lifestyle",
    shotOn: "Dazz Cam",
    likes: 0,
    likedBy: [],
  },
  {
    id: "10",
    url: "https://res.cloudinary.com/wiselielabs/image/upload/v1774233624/IMG_0698_so2xev.jpg",
    width: 3,
    height: 4,
    people: [],
    date: "2026-03-21",
    location: "La La Land Cafe Beverly Hills",
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
