import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { City, CityInput, Location, LocationInput } from "@/lib/travel/types"

const STORAGE_KEY = "travel-journal-grok"

const seedCities: City[] = [
  { id: "city-lisbon", name: "Lisbon", country: "Portugal" },
  { id: "city-kyoto", name: "Kyoto", country: "Japan" },
]

const seedLocations: Location[] = [
  {
    id: "loc-senhora",
    cityId: "city-lisbon",
    title: "Miradouro da Senhora do Monte",
    address: "Largo Monte, 1100-364 Lisboa",
    url: "https://www.visitlisboa.com/",
    lat: 38.7192,
    lng: -9.1334,
    notes:
      "Best late-afternoon light over the terracotta roofs.\nBring a layer — the wind comes up the hill after five.",
  },
  {
    id: "loc-belem",
    cityId: "city-lisbon",
    title: "Pastéis de Belém",
    address: "Rua de Belém 84-92, 1300-085 Lisboa",
    url: "https://pasteisdebelem.pt/",
    lat: 38.6976,
    lng: -9.2033,
    notes: "Order two pastéis and eat them at the counter. The line moves faster than it looks.",
  },
  {
    id: "loc-path",
    cityId: "city-kyoto",
    title: "Philosopher's Path",
    address: "Tetsugaku-no-michi, Sakyo Ward",
    notes:
      "Walk south from Ginkaku-ji. Cherry blossoms crowd the canal in early April.\nNo coordinates yet — pin it on the next visit.",
  },
]

type TravelState = {
  cities: City[]
  locations: Location[]
  addCity: (input: CityInput) => string
  updateCity: (id: string, input: CityInput) => void
  deleteCity: (id: string) => void
  addLocation: (cityId: string, input: LocationInput) => string
  updateLocation: (id: string, input: LocationInput) => void
  deleteLocation: (id: string) => void
}

function newId(): string {
  return crypto.randomUUID()
}

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export const useTravelStore = create<TravelState>()(
  persist(
    (set) => ({
      cities: seedCities,
      locations: seedLocations,
      addCity: (input) => {
        const id = newId()
        const city: City = { id, name: input.name, country: input.country }
        set((state) => ({ cities: [city, ...state.cities] }))
        return id
      },
      updateCity: (id, input) =>
        set((state) => ({
          cities: state.cities.map((city) =>
            city.id === id ? { ...city, name: input.name, country: input.country } : city,
          ),
        })),
      deleteCity: (id) =>
        set((state) => ({
          cities: state.cities.filter((city) => city.id !== id),
          locations: state.locations.filter((location) => location.cityId !== id),
        })),
      addLocation: (cityId, input) => {
        const id = newId()
        const location: Location = { id, cityId, ...input }
        set((state) => ({ locations: [location, ...state.locations] }))
        return id
      },
      updateLocation: (id, input) =>
        set((state) => ({
          locations: state.locations.map((location) =>
            location.id === id ? { ...location, ...input } : location,
          ),
        })),
      deleteLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((location) => location.id !== id),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : window.localStorage,
      ),
      skipHydration: true,
      partialize: (state) => ({ cities: state.cities, locations: state.locations }),
    },
  ),
)

export const TRAVEL_STORAGE_KEY = STORAGE_KEY
