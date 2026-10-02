import { useState } from "react"
import { LocateFixed } from "lucide-react"
import { parseLocationForm } from "@/lib/travel/form"
import type { LocationInput } from "@/lib/travel/types"
import { inputClass, labelClass, primaryBtn, quietBtn } from "@/components/travel/ui"

export type LocationDraft = {
  title: string
  address: string
  url: string
  lat: string
  lng: string
  notes: string
}

export const emptyLocationDraft: LocationDraft = {
  title: "",
  address: "",
  url: "",
  lat: "",
  lng: "",
  notes: "",
}

type Props = {
  initial: LocationDraft
  submitLabel: string
  onSubmit: (value: LocationInput) => void
  onCancel: () => void
}

export function LocationForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [draft, setDraft] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [geoNote, setGeoNote] = useState<string | null>(null)
  const [geoBusy, setGeoBusy] = useState(false)

  function setField<K extends keyof LocationDraft>(key: K, value: LocationDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function useMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoNote("This browser can't share your location. Type coordinates instead.")
      return
    }
    setGeoBusy(true)
    setGeoNote(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setField("lat", position.coords.latitude.toFixed(5))
        setField("lng", position.coords.longitude.toFixed(5))
        setGeoBusy(false)
        setGeoNote("Coordinates filled from this device. Nothing was uploaded.")
      },
      () => {
        setGeoBusy(false)
        setGeoNote("Location was blocked or unavailable. You can type the coordinates.")
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        const parsed = parseLocationForm(draft)
        if (!parsed.ok) {
          setError(parsed.error)
          return
        }
        setError(null)
        onSubmit(parsed.value)
      }}
    >
      <label className="block">
        <span className={labelClass}>Title</span>
        <input
          className={inputClass}
          value={draft.title}
          onChange={(event) => setField("title", event.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className={labelClass}>
          Street address <span className="font-normal text-muted">(optional)</span>
        </span>
        <input
          className={inputClass}
          value={draft.address}
          onChange={(event) => setField("address", event.target.value)}
          autoComplete="street-address"
        />
      </label>
      <label className="block">
        <span className={labelClass}>
          Link <span className="font-normal text-muted">(optional)</span>
        </span>
        <input
          className={inputClass}
          value={draft.url}
          onChange={(event) => setField("url", event.target.value)}
          inputMode="url"
          placeholder="https://"
        />
      </label>
      <fieldset className="space-y-3">
        <legend className={labelClass}>Coordinates (optional)</legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs text-muted">Latitude</span>
            <input
              className={inputClass}
              value={draft.lat}
              onChange={(event) => setField("lat", event.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-muted">Longitude</span>
            <input
              className={inputClass}
              value={draft.lng}
              onChange={(event) => setField("lng", event.target.value)}
              inputMode="decimal"
            />
          </label>
        </div>
        <button type="button" className={quietBtn} onClick={useMyLocation} disabled={geoBusy}>
          <LocateFixed className="size-4" aria-hidden="true" />
          {geoBusy ? "Reading location…" : "Use my location"}
        </button>
        {geoNote ? <p className="text-sm text-muted">{geoNote}</p> : null}
      </fieldset>
      <label className="block">
        <span className={labelClass}>Notes</span>
        <textarea
          className={`${inputClass} min-h-40 resize-y leading-relaxed`}
          value={draft.notes}
          onChange={(event) => setField("notes", event.target.value)}
        />
      </label>
      {error ? (
        <p className="text-sm text-stamp" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" className={primaryBtn}>
          {submitLabel}
        </button>
        <button type="button" className={quietBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
