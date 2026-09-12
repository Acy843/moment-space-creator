import { fetchPlaces, upsertPlace } from "@/lib/mova-repo";
import type { SavedPlace, SavedPlaceLabel } from "@/lib/location/location-types";
import { DEFAULT_PLACE_RADIUS_METERS } from "@/lib/location/location-service";

export function normalizePlaceLabel(value: string): SavedPlaceLabel | null {
  const lower = value.toLowerCase();
  if (lower === "home" || lower === "school" || lower === "work") return lower;
  return null;
}

export function createSavedPlace(
  label: SavedPlaceLabel,
  latitude: number,
  longitude: number,
  radiusMeters = DEFAULT_PLACE_RADIUS_METERS,
  now = new Date().toISOString(),
): SavedPlace {
  return {
    id: label,
    label,
    latitude,
    longitude,
    radiusMeters,
    createdAt: now,
    updatedAt: now,
  };
}

export async function loadPlacesForUser(uid: string | null): Promise<SavedPlace[]> {
  if (!uid) return [];
  return fetchPlaces(uid);
}

export async function savePlaceForUser(uid: string | null, place: SavedPlace): Promise<SavedPlace> {
  if (!uid) return place;
  const saved = await upsertPlace(uid, place);
  return saved;
}
