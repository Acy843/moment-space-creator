// Demo-only geo helpers for the MOVA competition prototype.
// No backend, no tracking SDK. Pure math + localStorage.
// Location is ONLY read while the user has the page open and presses Start.

export type PlaceId = "home" | "work" | "school";

export type LatLon = { lat: number; lon: number };

export type NamedPlace = LatLon & { id: PlaceId; label: string };

const PLACES_KEY = "mova-places-v1";

export function haversineMeters(a: LatLon, b: LatLon): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const h =
    s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function metersToMiles(m: number): number {
  return m / 1609.344;
}

export function nearestPlace(
  pos: LatLon,
  places: NamedPlace[],
  radiusM = 180,
): NamedPlace | null {
  let best: NamedPlace | null = null;
  let bestD = Infinity;
  for (const p of places) {
    const d = haversineMeters(pos, p);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  if (best && bestD <= radiusM) return best;
  return null;
}

export function loadPlaces(): NamedPlace[] {
  try {
    const raw = localStorage.getItem(PLACES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as NamedPlace[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p) =>
        p && typeof p.lat === "number" && typeof p.lon === "number" && p.id,
    );
  } catch {
    return [];
  }
}

export function savePlaces(places: NamedPlace[]): void {
  try {
    localStorage.setItem(PLACES_KEY, JSON.stringify(places));
  } catch {
    /* ignore quota/private mode */
  }
}

export function todayKey(d = new Date()): string {
  return `mova-miles-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadMiles(key: string): number {
  try {
    return Number(localStorage.getItem(key) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function saveMiles(key: string, miles: number): void {
  try {
    localStorage.setItem(key, String(miles));
  } catch {
    /* ignore */
  }
}
