// Phase 1 repository: users/{uid}, profile/main, settings/main.
// No `any`. Firestore Timestamps converted here; UI sees ISO strings.

import { getFirestoreDbAsync } from "@/lib/firebase";
import { defaultSettings, displayTimeFromIso, emptyProfile } from "@/lib/mova-types";
import type { MovaProfile, MovaSettings, ResetEntry, UserDocument } from "@/lib/mova-types";

export const USERS = "users";
export const PROFILE = "profile";
export const SETTINGS = "settings";
export const MAIN = "main";
export const RESETS = "resets";
export const CHECKINS = "checkins";

type DocSnap = { exists: () => boolean; data: () => Record<string, unknown> };
type ColSnap = { forEach: (cb: (d: { id: string; data: () => Record<string, unknown> }) => void) => void };
type FM = {
  doc: (...a: unknown[]) => unknown;
  collection: (...a: unknown[]) => unknown;
  getDoc: (r: unknown) => Promise<DocSnap>;
  setDoc: (r: unknown, d: Record<string, unknown>, o?: Record<string, unknown>) => Promise<void>;
  addDoc: (c: unknown, d: Record<string, unknown>) => Promise<{ id: string }>;
  getDocs: (q: unknown) => Promise<ColSnap>;
  query: (...a: unknown[]) => unknown;
  orderBy: (...a: unknown[]) => unknown;
  limit: (...a: unknown[]) => unknown;
  serverTimestamp: () => unknown;
};

async function fm(): Promise<FM> {
  return (await import("firebase/firestore")) as unknown as FM;
}

function iso(v: unknown, fb: string): string {
  const t = v as { toDate?: () => Date } | null | undefined;
  if (t && typeof t.toDate === "function") return t.toDate().toISOString();
  if (typeof v === "string" && v) return v;
  return fb;
}

function s(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function sa(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export function toUser(d: Record<string, unknown>, fb: string): UserDocument {
  return {
    displayName: typeof d["displayName"] === "string" ? (d["displayName"] as string) : null,
    email: typeof d["email"] === "string" ? (d["email"] as string) : null,
    onboardingCompleted: d["onboardingCompleted"] === true,
    createdAt: iso(d["createdAt"], fb),
    updatedAt: iso(d["updatedAt"] ?? d["createdAt"], fb),
  };
}

export function toProfile(d: Record<string, unknown>, fb: string): MovaProfile {
  void emptyProfile;
  return {
    occupation: s(d["occupation"]),
    workStyle: sa(d["workStyle"]),
    constraints: sa(d["constraints"]),
    breakRhythm: s(d["breakRhythm"]),
    goals: sa(d["goals"]),
    movementPreference: typeof d["movementPreference"] === "string" ? (d["movementPreference"] as string) : null,
    preferredActivityTypes: sa(d["preferredActivityTypes"]),
    typicalLocations: sa(d["typicalLocations"]),
    updatedAt: iso(d["updatedAt"], fb),
  };
}
export function toSettings(d: Record<string, unknown>, fb: string): MovaSettings {
  const f = defaultSettings();
  const p = (d["privacy"] ?? {}) as Record<string, unknown>;
  const style = d["preferredReminderStyle"];
  return {
    notificationsEnabled: typeof d["notificationsEnabled"] === "boolean" ? (d["notificationsEnabled"] as boolean) : f.notificationsEnabled,
    locationEnabled: typeof d["locationEnabled"] === "boolean" ? (d["locationEnabled"] as boolean) : f.locationEnabled,
    cameraVerificationEnabled: typeof d["cameraVerificationEnabled"] === "boolean" ? (d["cameraVerificationEnabled"] as boolean) : f.cameraVerificationEnabled,
    preferredReminderStyle: style === "gentle" || style === "firm" || style === "silent" ? style : f.preferredReminderStyle,
    privacy: {
      shareAggregatedWorkplaceData: typeof p["shareAggregatedWorkplaceData"] === "boolean" ? (p["shareAggregatedWorkplaceData"] as boolean) : f.privacy.shareAggregatedWorkplaceData,
      allowPersonalization: typeof p["allowPersonalization"] === "boolean" ? (p["allowPersonalization"] as boolean) : f.privacy.allowPersonalization,
    },
    updatedAt: iso(d["updatedAt"], fb),
  };
}

export function toEntry(id: string, d: Record<string, unknown>, fb: string): ResetEntry {
  const createdAt = iso(d["createdAt"], fb);
  const k = d["kind"];
  const st = d["status"];
  return {
    id,
    time: displayTimeFromIso(createdAt),
    title: typeof d["title"] === "string" ? (d["title"] as string) : "Reset",
    kind: k === "Movement" || k === "Breathing" || k === "Eye" || k === "Reflection" || k === "Hydration" ? k : "Breathing",
    status: st === "rescheduled" ? "rescheduled" : "completed",
    feeling: typeof d["feeling"] === "string" ? (d["feeling"] as string) : undefined,
    reason: typeof d["reason"] === "string" ? (d["reason"] as string) : undefined,
    createdAt,
  };
}

export async function fetchUser(uid: string, fb: string): Promise<UserDocument | null> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  const snap = await m.getDoc(m.doc(db, USERS, uid));
  if (!snap.exists()) return null;
  return toUser(snap.data(), fb);
}

export async function fetchProfile(uid: string, fb: string): Promise<MovaProfile | null> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  const snap = await m.getDoc(m.doc(db, USERS, uid, PROFILE, MAIN));
  if (!snap.exists()) return null;
  return toProfile(snap.data(), fb);
}

export async function fetchSettings(uid: string, fb: string): Promise<MovaSettings | null> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  const snap = await m.getDoc(m.doc(db, USERS, uid, SETTINGS, MAIN));
  if (!snap.exists()) return null;
  return toSettings(snap.data(), fb);
}

export async function saveUser(uid: string, patch: Partial<Omit<UserDocument, "createdAt" | "updatedAt">>): Promise<void> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  await m.setDoc(m.doc(db, USERS, uid), { ...patch, updatedAt: m.serverTimestamp() }, { merge: true });
}

export async function ensureUser(uid: string): Promise<void> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  const ref = m.doc(db, USERS, uid);
  const snap = await m.getDoc(ref);
  if (snap.exists()) return;
  await m.setDoc(ref, {
    displayName: null,
    email: null,
    onboardingCompleted: false,
    createdAt: m.serverTimestamp(),
    updatedAt: m.serverTimestamp(),
  });
}

export async function saveProfile(uid: string, p: MovaProfile): Promise<void> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  await m.setDoc(m.doc(db, USERS, uid, PROFILE, MAIN), { ...p, updatedAt: m.serverTimestamp() }, { merge: true });
}

export async function saveSettings(uid: string, st: MovaSettings): Promise<void> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  await m.setDoc(m.doc(db, USERS, uid, SETTINGS, MAIN), { ...st, updatedAt: m.serverTimestamp() }, { merge: true });
}

export async function ensureSettings(uid: string): Promise<MovaSettings> {
  const { nowIso } = await import("@/lib/mova-types");
  const ex = await fetchSettings(uid, nowIso());
  if (ex) return ex;
  const fresh = defaultSettings();
  await saveSettings(uid, fresh);
  return fresh;
}

export async function fetchResets(uid: string, fb: string, pageSize = 50): Promise<ResetEntry[]> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  const q = m.query(m.collection(db, USERS, uid, RESETS), m.orderBy("createdAt", "desc"), m.limit(pageSize));
  const snap = await m.getDocs(q);
  const out: ResetEntry[] = [];
  snap.forEach((d) => {
    const raw = d.data();
    out.push(toEntry(d.id, raw, iso(raw["createdAt"], fb)));
  });
  return out;
}

export async function addReset(
  uid: string,
  e: { title: string; kind: ResetEntry["kind"]; status: ResetEntry["status"]; feeling?: string | undefined; reason?: string | undefined },
): Promise<string> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  const ref = await m.addDoc(m.collection(db, USERS, uid, RESETS), { uid, ...e, createdAt: m.serverTimestamp() });
  return ref.id;
}

export async function addCheckin(uid: string, feeling: string, needs: string[]): Promise<string> {
  const db = await getFirestoreDbAsync();
  const m = await fm();
  const ref = await m.addDoc(m.collection(db, USERS, uid, CHECKINS), { uid, feeling, needs, createdAt: m.serverTimestamp() });
  return ref.id;
}

