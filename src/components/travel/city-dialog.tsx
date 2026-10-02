import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { parseCityForm } from "@/lib/travel/form"
import type { CityInput } from "@/lib/travel/types"
import { inputClass, labelClass, primaryBtn, quietBtn } from "@/components/travel/ui"

type Props = {
  open: boolean
  title: string
  initial: CityInput
  submitLabel: string
  onOpenChange: (open: boolean) => void
  onSubmit: (value: CityInput) => void
}

export function CityDialog({ open, title, initial, submitLabel, onOpenChange, onSubmit }: Props) {
  const [name, setName] = useState(initial.name)
  const [country, setCountry] = useState(initial.country ?? "")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(initial.name)
    setCountry(initial.country ?? "")
    setError(null)
  }, [open, initial.name, initial.country])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-card p-5 shadow-lg">
          <Dialog.Title className="font-display text-2xl font-medium">{title}</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted">
            A city is the folder. Places and notes live inside it.
          </Dialog.Description>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              const parsed = parseCityForm(name, country)
              if (!parsed.ok) {
                setError(parsed.error)
                return
              }
              onSubmit(parsed.value)
              onOpenChange(false)
            }}
          >
            <label className="block">
              <span className={labelClass}>City</span>
              <input
                className={inputClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="off"
                required
              />
            </label>
            <label className="block">
              <span className={labelClass}>Country <span className="font-normal text-muted">(optional)</span></span>
              <input
                className={inputClass}
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                autoComplete="country-name"
              />
            </label>
            {error ? (
              <p className="text-sm text-stamp" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <Dialog.Close type="button" className={quietBtn}>
                Cancel
              </Dialog.Close>
              <button type="submit" className={primaryBtn}>
                {submitLabel}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
