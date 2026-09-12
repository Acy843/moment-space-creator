export type LocationPermissionStatus = "unknown" | "granted" | "denied" | "unavailable" | "timeout";

export type SavedPlaceLabel = "home" | "school" | "work";

export type SavedPlace = {
  id: string;
  label: SavedPlaceLabel;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  createdAt: string;
  updatedAt: string;
};

export type LocationContext = "home" | "school" | "work" | "unknown" | "on_the_move";

export type LocationSnapshot = {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestamp: string;
};

export type WalkingSession = {
  id: string;
  resetId: string;
  startedAt: string;
  endedAt: string | null;
  distanceMeters: number;
  distanceMiles: number;
  status: "active" | "completed" | "idle";
};
