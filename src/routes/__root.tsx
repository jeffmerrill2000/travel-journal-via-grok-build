import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router"
import { AuthProvider } from "@/lib/auth/provider"
import { PreviewHostBridge } from "@/components/preview-host-bridge"
import { AppShell } from "@/components/travel/shell"
import appCss from "../styles.css?url"

const APP_NAME = "Travel Journal"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "A personal travel journal of cities, places, and notes." },
      { name: "theme-color", content: "#b8432f" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,620&family=Outfit:wght@400;500;600&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="py-10">
      <h1 className="font-display text-3xl font-medium">That page isn't in the journal</h1>
      <p className="mt-2 text-muted">The link may be old, or the place was removed.</p>
      <Link to="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-stamp-deep underline">
        Back to cities
      </Link>
    </div>
  )
}
