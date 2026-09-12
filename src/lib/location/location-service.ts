import type { LocationContext, LocationPermissionStatus, LocationSnapshot, SavedPlace, WalkingSession } from "@/lib/location/location-types";

export const DEFAULT_PLACE_RADIUS_METERS = 250;

export function haversineMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const h =
    s1 * s1 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function metersToMiles(meters: number): number {
  return meters / 1609.344;
}

export function hasGeolocationSupport(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

export function normalizePermissionStatus(code?: number | null): LocationPermissionStatus {
  if (typeof code !== "number") return "unknown";
  if (code === 1) return "denied";
  if (code === 2) return "unavailable";
  if (code === 3) return "timeout";
  return "unknown";
}

export function describeLocationContext(context: LocationContext): string {
  switch (context) {
    case "home":
      return "Home";
    case "school":
      return "School";
    case "work":
      return "Work";
    case "on_the_move":
      return "On the move";
    default:
      return "Unknown";
  }
}

export async function requestCurrentLocation(): Promise<{ status: LocationPermissionStatus; snapshot: LocationSnapshot | null; message: string | null }> {
  if (!hasGeolocationSupport()) {
    return { status: "unavailable", snapshot: null, message: "This device does not support location." };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          status: "granted",
          snapshot: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracyMeters: pos.coords.accuracy ?? 0,
            timestamp: new Date(pos.timestamp).toISOString(),
          },
          message: null,
        });
      },
      (error) => {
        const status = normalizePermissionStatus(error.code);
        resolve({
          status,
          snapshot: null,
          message:
            status === "denied"
              ? "Location permission is blocked. MOVA will continue without live location."
              : status === "timeout"
                ? "Location request timed out. Try again when you have a better signal."
                : "Location is unavailable right now.",
        });
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  });
}

export function detectLocationContext(snapshot: LocationSnapshot | null, savedPlaces: SavedPlace[]): LocationContext {
  if (!snapshot) return "unknown";

  let best: SavedPlace | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const saved of savedPlaces) {
    const distance = haversineMeters(snapshot, saved);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = saved;
    }
  }

  if (!best) return "on_the_move";

  const margin = Math.max(snapshot.accuracyMeters, 25);
  if (bestDistance <= best.radiusMeters + margin) {
    return best.label;
  }

  return "on_the_move";
}

export function startWalkingTracking(
  onUpdate: (snapshot: LocationSnapshot, totalMeters: number) => void,
  onError: (message: string) => void,
): { stop: () => void; watchId: number | null } {
  if (!hasGeolocationSupport()) {
    onError("This device does not support GPS tracking.");
    return { stop: () => undefined, watchId: null };
  }

  let lastPoint: LocationSnapshot | null = null;
  let totalMeters = 0;
  let watchId: number | null = null;

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const snapshot: LocationSnapshot = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracyMeters: pos.coords.accuracy ?? 0,
        timestamp: new Date(pos.timestamp).toISOString(),
      };

      if (lastPoint) {
        const distance = haversineMeters(lastPoint, snapshot);
        const valid = distance >= 2 && distance <= 500;
        const accuracyIsGood = snapshot.accuracyMeters < 80 || distance < snapshot.accuracyMeters * 3;
        if (valid && accuracyIsGood) {
          totalMeters += distance;
        }
      }

      lastPoint = snapshot;
      onUpdate(snapshot, totalMeters);
    },
    (error) => {
      const code = normalizePermissionStatus(error.code);
      if (code === "denied") {
        onError("Location permission was denied while tracking your walk.");
      } else {
        onError("GPS tracking stopped because the browser could not read your location.");
      }
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
  );

  return {
    watchId,
    stop: () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    },
  };
}

export function createWalkingSession(resetId: string, totalMeters: number): WalkingSession {
  const start = new Date().toISOString();
  return {
    id: `${resetId}-walk-${Date.now()}`,
    resetId,
    startedAt: start,
    endedAt: null,
    distanceMeters: totalMeters,
    distanceMiles: metersToMiles(totalMeters),
    status: "active",
  };
}
