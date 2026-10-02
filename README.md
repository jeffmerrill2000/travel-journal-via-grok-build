# travel-journal-grok

A personal travel journal. Keep cities you have visited, the places inside them, and multi-line notes. Places with coordinates show up as pins on a map.

Everything stays in the browser. There is no account, no server database, and no paid map API.

## Local commands

```bash
npm install
npm run dev
npm run build
```

`npm run dev` starts the Vite dev server. `npm run build` creates the production Vite build.

## How persistence works

All journal state lives in one [Zustand](https://zustand.docs.pmnd.rs/) store (`src/lib/travel/store.ts`). The store uses Zustand's `persist` middleware and writes JSON to `localStorage` under the key `travel-journal-grok`.

- Cities: name, optional country
- Places: title, optional street address, optional URL, optional latitude/longitude, multi-line notes
- Deleting a city also deletes its places

The first visit seeds two cities: Lisbon (two places, both with coordinates) and Kyoto (one place, no coordinates, so it stays off the map until you add them). Editing, adding, or deleting updates `localStorage` immediately. Clearing site data for this origin wipes the journal and the seed appears again on the next load.

"Use my location" is optional. It calls the browser Geolocation API on your device and only fills the latitude and longitude fields. Coordinates are not sent to a backend.

## Map tiles

The map uses [Leaflet](https://leafletjs.com/) and OpenStreetMap raster tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`). **OpenStreetMap tiles are for personal use.** Follow the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/) — do not point a high-traffic public site at the public tile servers.

## Deploy on Vercel

Vercel will not use the Dockerfile.

- Framework: **Vite**
- Build command: `npm run build`
- Output directory: **dist**

`npm run build` is the Vite production build. The Docker image (below) copies the Vite client assets into `dist` and nginx serves that directory. No environment variables or API keys are required.

## Docker (optional)

`Dockerfile` builds the app and serves the Vite `dist` output with nginx. Vercel will not use this image.

```bash
docker build -t travel-journal-grok .
docker run --rm -p 8080:80 travel-journal-grok
```
