// Phase 1 — strict domain types. No `any` leaks into UI.
// Firestore Timestamps are converted in mova-repo; UI only sees ISO strings.

export type ResetKind = "Movement" | "Breathing" | "Eye" | "Reflection" | "Hydration";
export type ResetStatus = "completed" | "rescheduled";

export type AuthStatus = "disabled" | "loading" | "ready" | "error";

export type AuthenticatedMovaUser = {
  uid: string;
  isAnonymous: boolean;
  displayName: string | null;
  email: string | null;
};

export type UserDocument = {
  displayName: string | null;
  email: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MovaProfile = {
  occupation: string;
  workStyle: string[];
  constraints: string[];
  breakRhythm: string;
  goals: string[];
  movementPreference: string | null;
  preferredActivityTypes: string[];
  typicalLocations: string[];
  updatedAt: string;
};

export type PrivacyPreferences = {
  shareAggregatedWorkplaceData: boolean;
  allowPersonalization: boolean;
};

export type MovaSettings = {
  notificationsEnabled: boolean;
  locationEnabled: boolean;
  cameraVerificationEnabled: boolean;
  preferredReminderStyle: "gentle" | "firm" | "silent";
  privacy: PrivacyPreferences;
  updatedAt: string;
};

export type OnboardingDraft = {
  occupation: string;
  customOccupation: string;
  workStyle: string[];
  constraints: string[];
  breakRhythm: string;
};

export type ResetEntry = {
  id: string;
  time: string;
  title: string;
  kind: ResetKind;
  status: ResetStatus;
  feeling?: string | undefined;
  reason?: string | undefined;
  createdAt: string;
};

export type MovaState = {
  user: AuthenticatedMovaUser | null;
  userDoc: UserDocument | null;
  profile: MovaProfile | null;
  settings: MovaSettings | null;
  history: ResetEntry[];
  onboarded: boolean;
  lastFeeling?: string | undefined;
  lastNeeds: string[];
};

export function nowIso(): string {
  return new Date().toISOString();
}

export function displayTimeFromIso(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "Just now";
  }
}

export function emptyProfile(): MovaProfile {
  return {
    occupation: "",
    workStyle: [],
    constraints: [],
    breakRhythm: "",
    goals: [],
    movementPreference: null,
    preferredActivityTypes: [],
    typicalLocations: [],
    updatedAt: nowIso(),
  };
}

export function defaultSettings(): MovaSettings {
  return {
    notificationsEnabled: true,
    locationEnabled: false,
    cameraVerificationEnabled: true,
    preferredReminderStyle: "gentle",
    privacy: {
      shareAggregatedWorkplaceData: false,
      allowPersonalization: true,
    },
    updatedAt: nowIso(),
  };
}


