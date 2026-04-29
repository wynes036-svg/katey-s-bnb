// Shared TypeScript types for The Sensory Stay

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Mood {
  id: string
  name: string
  videoUrl: string
  audioUrl: string
  descriptor: string
}

export interface Hotspot {
  id: string
  photoId: string
  pitch: number
  yaw: number
  title: string
  description: string
}

export interface RoomPhoto {
  id: string
  roomId: string
  url: string
  hotspots: Hotspot[]
}

export interface Room {
  id: string
  name: string
  description: string
  moodId: string
  mood: Mood
  vrImageUrl: string
  povVideoUrl: string
  photos: RoomPhoto[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LocalExperience {
  id: string
  title: string
  description: string
  price: number
  moodId: string
  mood: Mood
  availableDates: Date[]
  isActive: boolean
}

export interface BookingExperience {
  id: string
  bookingId: string
  experienceId: string
  experience: LocalExperience
  price: number
}

export interface BreakfastSelection {
  personIndex: number
  items: string[]
  restrictions: string[]
}

export interface Booking {
  id: string
  reservationId: string
  roomId: string
  room: Room
  guestName: string
  guestEmail: string
  checkIn: Date
  checkOut: Date
  status: BookingStatus
  stripeSessionId?: string | null
  totalPrice: number
  breakfastSelections: BreakfastSelection[]
  experiences: BookingExperience[]
  welcomePacketUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ArtistSpotlight {
  id: string
  title: string
  videoUrl: string
  videoDuration: number
  description: string
  externalUrl?: string | null
  isPublished: boolean
  createdAt: Date
}

export interface WeatherCache {
  id: string
  temperature: number
  condition: string
  descriptor: string
  fetchedAt: Date
}

export interface WeatherData {
  temperature: number
  condition: string
  descriptor: string
  fetchedAt: Date
  isStale?: boolean
}

// Quiz types
export type QuizAnswer = 0 | 1 | 2

export interface QuizAnswers {
  q1: QuizAnswer
  q2: QuizAnswer
  q3: QuizAnswer
}

export interface RoomRecommendation {
  room: Room
  score: number
  explanation: string
}

// Booking flow state
export interface BookingFlowState {
  roomId: string | null
  checkIn: Date | null
  checkOut: Date | null
  guestName: string
  guestEmail: string
  breakfastSelections: BreakfastSelection[]
  selectedExperiences: LocalExperience[]
  totalPrice: number
  paymentError: string | null
}

// Admin types
export interface AdminUploadResult {
  url: string
  key: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
