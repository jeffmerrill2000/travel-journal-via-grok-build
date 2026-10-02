import { createFileRoute, Link } from "@tanstack/react-router"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { CityDialog } from "@/components/travel/city-dialog"
import { ConfirmDialog } from "@/components/travel/confirm-dialog"
import { iconBtn, primaryBtn } from "@/components/travel/ui"
import { useTravelStore } from "@/lib/travel/store"

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Cities · Travel Journal" }] }),
  component: CitiesPage,
})

function CitiesPage() {
  const cities = useTravelStore((state) => state.cities)
  const locations = useTravelStore((state) => state.locations)
  const addCity = useTravelStore((state) => state.addCity)
  const updateCity = useTravelStore((state) => state.updateCity)
  const deleteCity = useTravelStore((state) => state.deleteCity)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const editing = cities.find((city) => city.id === editingId) ?? null
  const confirming = cities.find((city) => city.id === confirmId) ?? null
  const placeCount = locations.length

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">Cities</h1>
          <p className="mt-1 text-sm text-muted tabular-nums">
            {cities.length} {cities.length === 1 ? "city" : "cities"} · {placeCount}{" "}
            {placeCount === 1 ? "place" : "places"}
          </p>
        </div>
        <button type="button" className={primaryBtn} onClick={() => setAdding(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Add city
        </button>
      </div>

      {cities.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-card px-5 py-10 text-center">
          <p className="font-display text-2xl">No cities yet</p>
          <p className="mt-2 text-sm text-muted">Add the first city you've been to. Places go inside it.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {cities.map((city) => {
            const count = locations.filter((location) => location.cityId === city.id).length
            return (
              <li key={city.id} className="flex items-stretch rounded-card border border-line bg-card">
                <Link
                  to="/city/$cityId"
                  params={{ cityId: city.id }}
                  className="min-w-0 flex-1 px-4 py-4"
                >
                  <span className="block font-display text-2xl leading-tight font-medium">{city.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {city.country ? city.country : "Country not set"}
                    <span className="px-1.5" aria-hidden="true">
                      ·
                    </span>
                    <span className="tabular-nums">
                      {count} {count === 1 ? "place" : "places"}
                    </span>
                  </span>
                </Link>
                <div className="flex items-center pr-1">
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label={`Edit ${city.name}`}
                    onClick={() => setEditingId(city.id)}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label={`Delete ${city.name}`}
                    onClick={() => setConfirmId(city.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <CityDialog
        open={adding}
        title="Add a city"
        submitLabel="Add city"
        initial={{ name: "", country: undefined }}
        onOpenChange={setAdding}
        onSubmit={(value) => addCity(value)}
      />
      <CityDialog
        open={editing !== null}
        title="Edit city"
        submitLabel="Save"
        initial={{ name: editing?.name ?? "", country: editing?.country }}
        onOpenChange={(open) => {
          if (!open) setEditingId(null)
        }}
        onSubmit={(value) => {
          if (editing) updateCity(editing.id, value)
        }}
      />
      <ConfirmDialog
        open={confirming !== null}
        title={confirming ? `Remove ${confirming.name}?` : "Remove city?"}
        body="This deletes the city and every place saved inside it. This only affects this browser."
        confirmLabel="Delete city"
        onOpenChange={(open) => {
          if (!open) setConfirmId(null)
        }}
        onConfirm={() => {
          if (confirming) deleteCity(confirming.id)
        }}
      />
    </div>
  )
}
