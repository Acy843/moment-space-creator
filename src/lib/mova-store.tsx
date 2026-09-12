// Phase 1 provider: single hydration point. No per-route Firebase reads.
// Firebase is source of truth; uid-scoped localStorage is cache only.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { usePhase1Auth } from "@/lib/mova-auth";
import { demoDisplayProfile, initialState, loadCachedState, persistCachedState } from "@/lib/mova-cache";
import { clearAllMovaCache } from "@/lib/mova-cache";
import { completeOnboardingFlow, createResetFlow, hydrateUserState } from "@/lib/mova-service";
import { saveCheckinFlow, saveProfileFlow } from "@/lib/mova-service";
import type { AuthenticatedMovaUser, MovaProfile, MovaSettings, MovaState } from "@/lib/mova-types";
import type { OnboardingDraft, ResetEntry, UserDocument } from "@/lib/mova-types";

export type { AuthenticatedMovaUser, MovaProfile, MovaSettings, MovaState, OnboardingDraft, ResetEntry, UserDocument };

export type SyncStatus = "idle" | "loading" | "ready" | "error";

type Ctx = {
  state: MovaState;
  user: AuthenticatedMovaUser | null;
  profile: MovaProfile | null;
  settings: MovaSettings | null;
  onboarded: boolean;
  backend: "local" | "firebase";
  syncStatus: SyncStatus;
  syncError: string | null;
  authReady: boolean;
  displayName: string;
  displayOccupation: string;
  completeOnboarding: (draft: OnboardingDraft) => Promise<void>;
  savingOnboarding: boolean;
  onboardingError: string | null;
  setProfile: (patch: Partial<MovaProfile>) => void;
  addEntry: (e: Omit<ResetEntry, "id" | "time" | "createdAt">) => void;
  setCheckIn: (feeling: string, needs: string[]) => void;
  reset: () => void;
};

const MovaContext = createContext<Ctx | null>(null);

export function MovaProvider({ children }: { children: ReactNode }) {
  const auth = usePhase1Auth();
  const [state, setState] = useState<MovaState>(() => initialState());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setState(loadCachedState(null));
  }, []);

  useEffect(() => {
    if (auth.status === "loading") {
      setSyncStatus("loading");
      return;
    }
    if (auth.status === "disabled") {
      setSyncStatus("idle");
      setState(loadCachedState(null));
      return;
    }
    if (auth.status === "error") {
      setSyncStatus("error");
      setSyncError(auth.error);
      setState(loadCachedState(null));
      return;
    }
    if (auth.status === "ready" && auth.user) {
      const u = auth.user;
      setSyncStatus("loading");
      const cached = loadCachedState(u.uid);
      if (cached.profile || cached.userDoc) {
        setState((prev) => ({
          ...prev,
          user: u,
          userDoc: cached.userDoc,
          profile: cached.profile,
          settings: cached.settings,
          history: cached.history,
          onboarded: cached.onboarded,
        }));
      } else {
        setState((prev) => ({ ...prev, user: u }));
      }
      hydrateUserState(u)
        .then((h) => {
          setState((prev) => ({
            ...prev,
            user: u,
            userDoc: h.userDoc,
            profile: h.profile,
            settings: h.settings,
            history: h.history,
            onboarded: h.onboarded,
          }));
          persistCachedState(u.uid, {
            user: u,
            userDoc: h.userDoc,
            profile: h.profile,
            settings: h.settings,
            history: h.history,
            onboarded: h.onboarded,
            lastFeeling: undefined,
            lastNeeds: [],
          });
          setSyncStatus("ready");
          setSyncError(null);
        })
        .catch((e: unknown) => {
          setSyncStatus("error");
          setSyncError(e instanceof Error ? e.message : "load_failed");
        });
    }
  }, [auth.status, auth.user, auth.error]);

  const completeOnboarding = useCallback(
    async (draft: OnboardingDraft) => {
      setSaving(true);
      setSaveError(null);
      try {
        const done = await completeOnboardingFlow(auth.user, draft);
        setState((prev) => ({
          ...prev,
          userDoc: done.userDoc,
          profile: done.profile,
          settings: done.settings,
          history: done.history,
          onboarded: true,
        }));
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : "save_failed");
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [auth.user],
  );

  const setProfile = useCallback(
    (patch: Partial<MovaProfile>) => {
      setState((prev) => {
        if (!prev.profile) return prev;
        const next = { ...prev.profile, ...patch };
        void saveProfileFlow(auth.user, next);
        return { ...prev, profile: next };
      });
    },
    [auth.user],
  );

  const addEntry = useCallback(
    (entry: Omit<ResetEntry, "id" | "time" | "createdAt">) => {
      void (async () => {
        try {
          const saved = await createResetFlow(auth.user, entry);
          setState((prev) => ({
            ...prev,
            history: [saved, ...prev.history.filter((h) => h.id !== saved.id)].slice(0, 100),
          }));
        } catch (e: unknown) {
          setSyncError(e instanceof Error ? e.message : "save_failed");
        }
      })();
    },
    [auth.user],
  );

  const setCheckIn = useCallback(
    (feeling: string, needs: string[]) => {
      setState((prev) => ({ ...prev, lastFeeling: feeling, lastNeeds: needs }));
      void saveCheckinFlow(auth.user, feeling, needs);
    },
    [auth.user],
  );

  const reset = useCallback(() => {
    clearAllMovaCache();
    setState(initialState());
  }, []);

  const demo = demoDisplayProfile();
  const value = useMemo<Ctx>(
    () => ({
      state,
      user: state.user,
      profile: state.profile,
      settings: state.settings,
      onboarded: state.onboarded,
      backend: auth.user ? "firebase" : "local",
      syncStatus,
      syncError,
      authReady: auth.status === "ready" || auth.status === "disabled",
      displayName: state.userDoc?.displayName ?? state.profile?.occupation ?? demo.name,
      displayOccupation: state.profile?.occupation || demo.occupation,
      completeOnboarding,
      savingOnboarding: saving,
      onboardingError: saveError,
      setProfile,
      addEntry,
      setCheckIn,
      reset,
    }),
    [state, auth.user, auth.status, syncStatus, syncError, demo.name, demo.occupation, completeOnboarding, saving, saveError, setProfile, addEntry, setCheckIn, reset],
  );

  return <MovaContext.Provider value={value}>{children}</MovaContext.Provider>;
}

export function useMova() {
  const ctx = useContext(MovaContext);
  if (!ctx) throw new Error("useMova must be used inside MovaProvider");
  return ctx;
}

