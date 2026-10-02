import { createFileRoute, Link } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { MapCanvas } from "@/components/travel/map-canvas"
import { hasCoords, noteExcerpt } from "@/lib/travel/form"
import { useTravelStore } from "@/lib/travel/store"

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Map · Travel Journal" }] }),
  component: MapPage,
})

function MapPage() {
  const cities = useTravelStore((state) => state.cities)
  const locations = useTravelStore((state) => state.locations)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const pins = useMemo(
    () =>
      locations
        .filter((location) => hasCoords(location.lat, location.lng))
        .map((location) => ({
          ...location,
          cityName: cities.find((city) => city.id === location.cityId)?.name ?? "Unknown city",
        })),
    [cities, locations],
  )

  const selected = pins.find((pin) => pin.id === selectedId) ?? null

  return (
    <div>
      <h1 className="font-display text-4xl font-medium tracking-tight">Map</h1>
      <p className="mt-1 mb-4 text-sm text-muted">
        Pins for places that have coordinates. Tiles are OpenStreetMap, for personal use.
      </p>
      <div className="-mx-4 overflow-hidden sm:mx-0 sm:rounded-card sm:border sm:border-line">
        <MapCanvas pins={pins} selectedId={selected?.id ?? null} onSelect={setSelectedId} />
      </div>
      <section className="mt-4 rounded-card border border-line bg-card p-4" aria-live="polite">
        {pins.length === 0 ? (
          <p className="text-sm text-muted">
            Nothing to pin yet. Open a place and add latitude and longitude, or use your location.
          </p>
        ) : selected ? (
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">{selected.cityName}</p>
            <h2 className="mt-1 font-display text-2xl font-medium">{selected.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{noteExcerpt(selected.notes, 220)}</p>
            <Link
              to="/location/$locationId"
              params={{ locationId: selected.id }}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-stamp-deep underline"
            >
              Edit this place
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted">Tap a pin to read the note.</p>
        )}
      </section>
      {pins.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {pins.map((pin) => (
            <li key={pin.id}>
              <button
                type="button"
                onClick={() => setSelectedId(pin.id)}
                className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${
                  pin.id === selected?.id ? "border-ink bg-card" : "border-line bg-card"
                }`}
              >
                <span className="font-medium">{pin.title}</span>
                <span className="ml-3 shrink-0 text-muted">{pin.cityName}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
