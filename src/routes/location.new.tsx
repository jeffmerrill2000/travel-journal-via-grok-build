import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { LocationForm, emptyLocationDraft } from "@/components/travel/location-form"
import { useTravelStore } from "@/lib/travel/store"

type NewSearch = { city: string }

export const Route = createFileRoute("/location/new")({
  validateSearch: (search: Record<string, unknown>): NewSearch => ({
    city: typeof search.city === "string" ? search.city : "",
  }),
  head: () => ({ meta: [{ title: "New place · Travel Journal" }] }),
  component: NewLocationPage,
})

function NewLocationPage() {
  const { city: cityId } = Route.useSearch()
  const navigate = useNavigate()
  const cities = useTravelStore((state) => state.cities)
  const city = cities.find((item) => item.id === cityId)
  const addLocation = useTravelStore((state) => state.addLocation)

  if (!city) {
    return (
      <div>
        <h1 className="font-display text-4xl font-medium">Add a place</h1>
        <p className="mt-2 text-muted">Choose which city this place belongs to.</p>
        {cities.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Add a city first.</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {cities.map((item) => (
              <li key={item.id}>
                <Link
                  to="/location/new"
                  search={{ city: item.id }}
                  className="flex min-h-11 items-center rounded-card border border-line bg-card px-4 py-3 font-medium"
                >
                  {item.name}
                  {item.country ? <span className="ml-2 font-normal text-muted">{item.country}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link to="/" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted">
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
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">New place</h1>
      <p className="mt-1 mb-5 text-sm text-muted">
        In {city.name}
        {city.country ? `, ${city.country}` : ""}. Coordinates are optional and stay on this device.
      </p>
      <LocationForm
        initial={emptyLocationDraft}
        submitLabel="Save place"
        onCancel={() => {
          void navigate({ to: "/city/$cityId", params: { cityId: city.id } })
        }}
        onSubmit={(value) => {
          addLocation(city.id, value)
          void navigate({ to: "/city/$cityId", params: { cityId: city.id } })
        }}
      />
    </div>
  )
}
