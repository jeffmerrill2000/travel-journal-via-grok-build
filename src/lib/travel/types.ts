export type City = {
  id: string
  name: string
  country?: string
}

export type Location = {
  id: string
  cityId: string
  title: string
  address?: string
  url?: string
  lat?: number
  lng?: number
  notes: string
}

export type CityInput = {
  name: string
  country?: string
}

export type LocationInput = {
  title: string
  address?: string
  url?: string
  lat?: number
  lng?: number
  notes: string
}
