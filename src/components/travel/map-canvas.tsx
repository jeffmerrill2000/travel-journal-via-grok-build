import { useEffect, useRef, useState } from "react"
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet"
import "leaflet/dist/leaflet.css"
import { noteExcerpt } from "@/lib/travel/form"
import type { Location } from "@/lib/travel/types"

export type MapPin = Location & { cityName: string }

type Props = {
  pins: MapPin[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MapCanvas({ pins, selectedId, onSelect }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const groupRef = useRef<LayerGroup | null>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const selectedRef = useRef(selectedId)
  selectedRef.current = selectedId
  const [ready, setReady] = useState(false)

  const pinKey = pins
    .map((pin) => `${pin.id}:${pin.lat}:${pin.lng}:${pin.title}:${pin.notes}:${pin.cityName}`)
    .join("|")

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let cancelled = false
    let map: LeafletMap | undefined

    void (async () => {
      const L = await import("leaflet")
      if (cancelled || !hostRef.current) return
      map = L.map(hostRef.current, { scrollWheelZoom: true, zoomControl: true })
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)
      map.setView([20, 0], 2)
      mapRef.current = map
      groupRef.current = L.layerGroup().addTo(map)
      setReady(true)
      window.setTimeout(() => map?.invalidateSize(), 80)
    })()

    return () => {
      cancelled = true
      setReady(false)
      map?.remove()
      mapRef.current = null
      groupRef.current = null
      markersRef.current.clear()
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const group = groupRef.current
    if (!ready || !map || !group) return
    let cancelled = false

    void (async () => {
      const L = await import("leaflet")
      if (cancelled || !mapRef.current || !groupRef.current) return
      group.clearLayers()
      markersRef.current.clear()
      const icon = L.divIcon({
        className: "tj-pin-wrap",
        html: '<span class="tj-pin"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 16],
        popupAnchor: [0, -14],
      })
      const placed: Marker[] = []
      for (const pin of pins) {
        if (typeof pin.lat !== "number" || typeof pin.lng !== "number") continue
        const marker = L.marker([pin.lat, pin.lng], { icon, title: pin.title })
        const body = document.createElement("div")
        const title = document.createElement("strong")
        title.textContent = pin.title
        const excerpt = document.createElement("p")
        excerpt.textContent = noteExcerpt(pin.notes)
        body.append(title, excerpt)
        marker.bindPopup(body)
        marker.on("click", () => onSelectRef.current(pin.id))
        marker.addTo(group)
        markersRef.current.set(pin.id, marker)
        placed.push(marker)
      }
      if (placed.length === 1) {
        map.setView(placed[0].getLatLng(), 13)
      } else if (placed.length > 1) {
        map.fitBounds(L.latLngBounds(placed.map((marker) => marker.getLatLng())).pad(0.35))
      } else {
        map.setView([20, 0], 2)
      }
      if (selectedRef.current) markersRef.current.get(selectedRef.current)?.openPopup()
      window.setTimeout(() => map.invalidateSize(), 80)
    })()

    return () => {
      cancelled = true
    }
  }, [pinKey, pins, ready])

  useEffect(() => {
    if (!ready || !selectedId) return
    const marker = markersRef.current.get(selectedId)
    const map = mapRef.current
    if (!marker || !map) return
    map.panTo(marker.getLatLng())
    marker.openPopup()
  }, [ready, selectedId])

  return <div ref={hostRef} className="tj-map h-[min(62dvh,34rem)] w-full" />
}
