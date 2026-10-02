import { Link, useRouterState } from "@tanstack/react-router"
import { Compass } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { useTravelStore } from "@/lib/travel/store"

function navClass(active: boolean): string {
  return active
    ? "inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper"
    : "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted hover:text-ink"
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true
    const finish = () => {
      if (active) setHydrated(true)
    }
    const unsub = useTravelStore.persist.onFinishHydration(finish)
    if (useTravelStore.persist.hasHydrated()) {
      finish()
    } else {
      void Promise.resolve(useTravelStore.persist.rehydrate()).catch(finish)
    }
    return () => {
      active = false
      unsub()
    }
  }, [])

  return (
    <div className="min-h-dvh">
      <div className="h-1.5 bg-stamp" aria-hidden="true" />
      <div className="mx-auto flex min-h-[calc(100dvh-0.375rem)] w-full max-w-3xl flex-col px-4 pb-10 pt-5">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-ink text-paper">
              <Compass className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
                travel-journal-grok
              </p>
              <p className="font-display text-2xl leading-none font-medium text-ink">Travel Journal</p>
            </div>
          </div>
          <nav className="flex gap-1 rounded-full border border-line bg-card p-1" aria-label="Primary">
            <Link to="/" className={navClass(pathname === "/")}>
              Cities
            </Link>
            <Link to="/map" className={navClass(pathname === "/map")}>
              Map
            </Link>
          </nav>
        </header>
        <main className="flex-1">
          {hydrated ? (
            children
          ) : (
            <p className="text-muted" role="status">
              Opening your journal…
            </p>
          )}
        </main>
      </div>
    </div>
  )
}
