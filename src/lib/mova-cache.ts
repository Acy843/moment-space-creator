// Phase 1 cache: Firebase is source of truth; localStorage is cache only.
// Keys are namespaced per-uid so a new anonymous user never sees old profile.

import { defaultSettings, nowIso } from "@/lib/mova-types";
import type { MovaProfile, MovaSettings, MovaState, ResetEntry, UserDocument } from "@/lib/mova-types";

export const LEGACY_STATE_KEY = "mova-demo-state-v1";
export const LEGACY_PROFILE_KEY = "mova-profile-v1";
export const LEGACY_META_KEY = "mova-meta-v1";
export const LEGACY_HISTORY_KEY = "mova-history-v1";

const uidScope = (uid: string | null) => (uid ? `:${uid}` : ":local");

export const cacheKeys = (uid: string | null) => ({
  user: `mova-user${uidScope(uid)}`,
  profile: `mova-profile-doc${uidScope(uid)}`,
  settings: `mova-settings${uidScope(uid)}`,
  history: `mova-history${uidScope(uid)}`,
});

export const DEMO_FALLBACK_NAME = "Guest";
export const DEMO_FALLBACK_OCCUPATION = "Healthcare";

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota/private mode */
  }
}

export function initialState(): MovaState {
  return {
    user: null,
    userDoc: null,
    profile: null,
    settings: null,
    history: [],
    onboarded: false,
    lastFeeling: undefined,
    lastNeeds: [],
  };
}

export function loadCachedState(uid: string | null): MovaState {
  const k = cacheKeys(uid);
  const user = readJson(k.user) as UserDocument | null;
  const profile = readJson(k.profile) as MovaProfile | null;
  const settings = readJson(k.settings) as MovaSettings | null;
  const history = (readJson(k.history) as ResetEntry[] | null) ?? [];
  const onboarded = user?.onboardingCompleted === true;
  return { user: null, userDoc: user, profile, settings, history, onboarded, lastFeeling: undefined, lastNeeds: [] };
}

export function persistCachedState(uid: string | null, s: MovaState): void {
  const k = cacheKeys(uid);
  if (s.userDoc) writeJson(k.user, s.userDoc);
  if (s.profile) writeJson(k.profile, s.profile);
  if (s.settings) writeJson(k.settings, s.settings);
  writeJson(k.history, s.history.slice(0, 100));
}

export function clearAllMovaCache(): void {
  try {
    const doomed: string[] = [LEGACY_STATE_KEY, LEGACY_PROFILE_KEY, LEGACY_META_KEY, LEGACY_HISTORY_KEY];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("mova-user") || key.startsWith("mova-profile-doc") || key.startsWith("mova-settings") || key.startsWith("mova-history"))) doomed.push(key);
    }
    doomed.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
}

export function demoDisplayProfile(): { name: string; occupation: string } {
  return { name: DEMO_FALLBACK_NAME, occupation: DEMO_FALLBACK_OCCUPATION };
}

export function seedSettings(): MovaSettings {
  return defaultSettings();
}

export function stampNow(): string {
  return nowIso();
}


