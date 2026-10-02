import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { ConfirmDialog } from "@/components/travel/confirm-dialog"
import { LocationForm, type LocationDraft } from "@/components/travel/location-form"
import { quietBtn } from "@/components/travel/ui"
import { useTravelStore } from "@/lib/travel/store"

export const Route = createFileRoute("/location/$locationId")({
  head: () => ({ meta: [{ title: "Edit place · Travel Journal" }] }),
  component: EditLocationPage,
})

function toDraft(location: {
  title: string
  address?: string
  url?: string
  lat?: number
  lng?: number
  notes: string
}): LocationDraft {
  return {
    title: location.title,
    address: location.address ?? "",
    url: location.url ?? "",
    lat: typeof location.lat === "number" ? String(location.lat) : "",
    lng: typeof location.lng === "number" ? String(location.lng) : "",
    notes: location.notes,
  }
}

function EditLocationPage() {
  const { locationId } = Route.useParams()
  const navigate = useNavigate()
  const location = useTravelStore((state) => state.locations.find((item) => item.id === locationId))
  const city = useTravelStore((state) =>
    state.cities.find((item) => item.id === location?.cityId),
  )
  const updateLocation = useTravelStore((state) => state.updateLocation)
  const deleteLocation = useTravelStore((state) => state.deleteLocation)
  const [confirming, setConfirming] = useState(false)

  if (!location || !city) {
    return (
      <div className="py-8">
        <h1 className="font-display text-3xl font-medium">Place not found</h1>
        <Link to="/" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-stamp-deep">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All cities
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/city/$cityId"
        params={{ cityId: city.id }}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {city.name}
      </Link>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Edit place</h1>
      <p className="mt-1 mb-5 text-sm text-muted">{location.title}</p>
      <LocationForm
        key={location.id}
        initial={toDraft(location)}
        submitLabel="Save changes"
        onCancel={() => {
          void navigate({ to: "/city/$cityId", params: { cityId: city.id } })
        }}
        onSubmit={(value) => {
          updateLocation(location.id, value)
          void navigate({ to: "/city/$cityId", params: { cityId: city.id } })
        }}
      />
      <div className="mt-8 border-t border-line pt-5">
        <button type="button" className={quietBtn} onClick={() => setConfirming(true)}>
          Delete place
        </button>
      </div>
      <ConfirmDialog
        open={confirming}
        title={`Remove ${location.title}?`}
        body="The note for this place will be deleted from this browser."
        confirmLabel="Delete place"
        onOpenChange={setConfirming}
        onConfirm={() => {
          deleteLocation(location.id)
          void navigate({ to: "/city/$cityId", params: { cityId: city.id } })
        }}
      />
    </div>
  )
}
