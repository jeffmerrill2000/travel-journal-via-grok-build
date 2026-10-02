import type { CityInput, LocationInput } from "@/lib/travel/types"

export type FormResult<T> = { ok: true; value: T } | { ok: false; error: string }

export function parseCityForm(name: string, country: string): FormResult<CityInput> {
  const trimmed = name.trim()
  if (!trimmed) return { ok: false, error: "Name the city." }
  const place = country.trim()
  return { ok: true, value: { name: trimmed, country: place || undefined } }
}

export function parseLocationForm(raw: {
  title: string
  address: string
  url: string
  lat: string
  lng: string
  notes: string
}): FormResult<LocationInput> {
  const title = raw.title.trim()
  if (!title) return { ok: false, error: "Give the place a title." }

  const latStr = raw.lat.trim()
  const lngStr = raw.lng.trim()
  let lat: number | undefined
  let lng: number | undefined
  if (latStr || lngStr) {
    if (!latStr || !lngStr) {
      return { ok: false, error: "Enter both latitude and longitude, or leave both blank." }
    }
    lat = Number(latStr)
    lng = Number(lngStr)
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      return { ok: false, error: "Latitude must be between −90 and 90." }
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      return { ok: false, error: "Longitude must be between −180 and 180." }
    }
  }

  let url = raw.url.trim()
  if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`
  if (url) {
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { ok: false, error: "Use an http or https link." }
      }
    } catch {
      return { ok: false, error: "That link doesn't look like a URL." }
    }
  }

  return {
    ok: true,
    value: {
      title,
      address: raw.address.trim() || undefined,
      url: url || undefined,
      lat,
      lng,
      notes: raw.notes.replace(/\r\n/g, "\n"),
    },
  }
}

export function noteExcerpt(notes: string, max = 140): string {
  const flat = notes.replace(/\s+/g, " ").trim()
  if (!flat) return "No notes yet."
  if (flat.length <= max) return flat
  return `${flat.slice(0, max - 1).trimEnd()}…`
}

export function hasCoords(lat?: number, lng?: number): boolean {
  return typeof lat === "number" && typeof lng === "number" && Number.isFinite(lat) && Number.isFinite(lng)
}
