// Phase 1 service: hydration + onboarding. Routes never touch Firestore.

import { firebaseConfigured } from "@/lib/firebase";
import { loadCachedState, persistCachedState } from "@/lib/mova-cache";
import { addCheckin, addReset, ensureSettings, ensureUser } from "@/lib/mova-repo";
import { fetchProfile, fetchResets, fetchSettings, fetchUser } from "@/lib/mova-repo";
import { saveProfile, saveSettings, saveUser } from "@/lib/mova-repo";
import { defaultSettings, displayTimeFromIso, emptyProfile } from "@/lib/mova-types";
import { nowIso } from "@/lib/mova-types";
import type { AuthenticatedMovaUser, MovaProfile, MovaSettings, MovaState } from "@/lib/mova-types";
import type { OnboardingDraft, ResetEntry, UserDocument } from "@/lib/mova-types";

export type Hydrated = {
  userDoc: UserDocument | null;
  profile: MovaProfile | null;
  settings: MovaSettings | null;
  history: ResetEntry[];
  onboarded: boolean;
};

export async function hydrateUserState(user: AuthenticatedMovaUser | null): Promise<Hydrated> {
  const fb = nowIso();
  if (!user || !firebaseConfigured) {
    const cached = loadCachedState(user?.uid ?? null);
    return {
      userDoc: cached.userDoc,
      profile: cached.profile,
      settings: cached.settings,
      history: cached.history,
      onboarded: cached.onboarded,
    };
  }
  await ensureUser(user.uid);
  const [userDoc, profile, settings, history] = await Promise.all([
    fetchUser(user.uid, fb),
    fetchProfile(user.uid, fb),
    fetchSettings(user.uid, fb).then(async (s) => s ?? ensureSettings(user.uid)),
    fetchResets(user.uid, fb, 50).catch(() => [] as ResetEntry[]),
  ]);
  return {
    userDoc,
    profile,
    settings,
    history,
    onboarded: userDoc?.onboardingCompleted === true,
  };
}

export function draftToProfile(draft: OnboardingDraft): MovaProfile {
  const occupation = draft.occupation === "Other" && draft.customOccupation
    ? draft.customOccupation.trim()
    : draft.occupation;
  return {
    occupation,
    workStyle: draft.workStyle,
    constraints: draft.constraints,
    breakRhythm: draft.breakRhythm,
    goals: [],
    movementPreference: null,
    preferredActivityTypes: [],
    typicalLocations: [],
    updatedAt: nowIso(),
  };
}

export async function completeOnboardingFlow(
  user: AuthenticatedMovaUser | null,
  draft: OnboardingDraft,
): Promise<Hydrated> {
  const profile = draftToProfile(draft);
  if (!user || !firebaseConfigured) {
    const cached = loadCachedState(user?.uid ?? null);
    const next: MovaState = {
      ...cached,
      profile,
      settings: cached.settings ?? defaultSettings(),
      onboarded: true,
      userDoc: cached.userDoc
        ? { ...cached.userDoc, onboardingCompleted: true, updatedAt: nowIso() }
        : {
            displayName: null,
            email: null,
            onboardingCompleted: true,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          },
    };
    persistCachedState(user?.uid ?? null, next);
    return {
      userDoc: next.userDoc,
      profile: next.profile,
      settings: next.settings,
      history: next.history,
      onboarded: true,
    };
  }
  await ensureUser(user.uid);
  await saveProfile(user.uid, profile);
  const settings = await ensureSettings(user.uid);
  await saveUser(user.uid, { onboardingCompleted: true });
  const [userDoc, history] = await Promise.all([
    fetchUser(user.uid, nowIso()),
    fetchResets(user.uid, nowIso(), 50).catch(() => [] as ResetEntry[]),
  ]);
  const next: MovaState = {
    user,
    userDoc,
    profile,
    settings,
    history,
    onboarded: true,
    lastFeeling: undefined,
    lastNeeds: [],
  };
  persistCachedState(user.uid, next);
  return { userDoc, profile, settings, history, onboarded: true };
}

export async function saveProfileFlow(user: AuthenticatedMovaUser | null, profile: MovaProfile): Promise<void> {
  const stamped = { ...profile, updatedAt: nowIso() };
  const cached = loadCachedState(user?.uid ?? null);
  persistCachedState(user?.uid ?? null, { ...cached, profile: stamped });
  if (user && firebaseConfigured) await saveProfile(user.uid, stamped);
}

export async function saveCheckinFlow(user: AuthenticatedMovaUser | null, feeling: string, needs: string[]): Promise<void> {
  const cached = loadCachedState(user?.uid ?? null);
  persistCachedState(user?.uid ?? null, { ...cached, lastFeeling: feeling, lastNeeds: needs });
  if (user && firebaseConfigured) {
    await saveUser(user.uid, {});
    await addCheckin(user.uid, feeling, needs);
  }
}

export async function createResetFlow(
  user: AuthenticatedMovaUser | null,
  input: { title: string; kind: ResetEntry["kind"]; status: ResetEntry["status"]; feeling?: string | undefined; reason?: string | undefined },
): Promise<ResetEntry> {
  const createdAt = nowIso();
  if (user && firebaseConfigured) {
    const id = await addReset(user.uid, input);
    const entry: ResetEntry = { ...input, id, time: displayTimeFromIso(createdAt), createdAt };
    const cached = loadCachedState(user.uid);
    persistCachedState(user.uid, { ...cached, history: [entry, ...cached.history].slice(0, 100) });
    return entry;
  }
  const entry: ResetEntry = {
    ...input,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `local-${Date.now()}`,
    time: displayTimeFromIso(createdAt),
    createdAt,
  };
  const cached = loadCachedState(user?.uid ?? null);
  persistCachedState(user?.uid ?? null, { ...cached, history: [entry, ...cached.history].slice(0, 100) });
  return entry;
}

export function emptyProfileForNewUser(): MovaProfile {
  return emptyProfile();
}
