import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { ConfirmDialog } from "@/components/travel/confirm-dialog"
import { iconBtn, primaryBtn } from "@/components/travel/ui"
import { hasCoords, noteExcerpt } from "@/lib/travel/form"
import { useTravelStore } from "@/lib/travel/store"

export const Route = createFileRoute("/city/$cityId")({
  head: () => ({ meta: [{ title: "Places · Travel Journal" }] }),
  component: CityPage,
})

function CityPage() {
  const { cityId } = Route.useParams()
  const cities = useTravelStore((state) => state.cities)
  const allLocations = useTravelStore((state) => state.locations)
  const deleteLocation = useTravelStore((state) => state.deleteLocation)
  const city = cities.find((item) => item.id === cityId)
  const locations = useMemo(
    () => allLocations.filter((item) => item.cityId === cityId),
    [allLocations, cityId],
  )
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const confirming = locations.find((location) => location.id === confirmId) ?? null

  if (!city) {
    return (
      <div className="py-8">
        <h1 className="font-display text-3xl font-medium">City not found</h1>
        <p className="mt-2 text-muted">It may have been deleted from this browser.</p>
        <Link to="/" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-stamp-deep">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All cities
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All cities
      </Link>
      <div className="mt-2 mb-5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-medium tracking-tight">{city.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {city.country ?? "Country not set"}
            <span className="px-1.5" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">
              {locations.length} {locations.length === 1 ? "place" : "places"}
            </span>
          </p>
        </div>
        <Link to="/location/new" search={{ city: city.id }} className={primaryBtn}>
          <Plus className="size-4" aria-hidden="true" />
          Add place
        </Link>
      </div>

      {locations.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-card px-5 py-10 text-center">
          <p className="font-display text-2xl">No places yet</p>
          <p className="mt-2 text-sm text-muted">Add a street, a viewpoint, a café — notes can be as long as you like.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {locations.map((location) => (
            <li key={location.id} className="rounded-card border border-line bg-card">
              <div className="flex items-start">
                <Link
                  to="/location/$locationId"
                  params={{ locationId: location.id }}
                  className="min-w-0 flex-1 px-4 pt-4 pb-2"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-display text-xl leading-tight font-medium">{location.title}</span>
                    {hasCoords(location.lat, location.lng) ? (
                      <MapPin className="size-4 shrink-0 text-stamp" aria-label="Shown on the map" />
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{noteExcerpt(location.notes)}</span>
                </Link>
                <button
                  type="button"
                  className={`${iconBtn} mt-1 mr-1`}
                  aria-label={`Delete ${location.title}`}
                  onClick={() => setConfirmId(location.id)}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="px-4 pb-4 text-sm text-muted">
                {location.address ? <p>{location.address}</p> : null}
                {location.url ? (
                  <a href={location.url} className="mt-1 inline-flex min-h-11 items-center text-stamp-deep underline" target="_blank" rel="noreferrer">
                    Website
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title={confirming ? `Remove ${confirming.title}?` : "Remove place?"}
        body="The note for this place will be deleted from this browser."
        confirmLabel="Delete place"
        onOpenChange={(open) => {
          if (!open) setConfirmId(null)
        }}
        onConfirm={() => {
          if (confirming) deleteLocation(confirming.id)
        }}
      />
    </div>
  )
}
