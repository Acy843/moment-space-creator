// Phase 1 — anonymous auth state (stable UID, no login UI).
// Anonymous auth is intentional: judges get a UID without creating an account.

import { useEffect, useState } from "react";
import { firebaseConfigured, getFirebaseAuthAsync } from "@/lib/firebase";
import type { AuthenticatedMovaUser, AuthStatus } from "@/lib/mova-types";

export type Phase1AuthState = {
  status: AuthStatus;
  user: AuthenticatedMovaUser | null;
  error: string | null;
};

export function usePhase1Auth(): Phase1AuthState {
  const [state, setState] = useState<Phase1AuthState>(() =>
    firebaseConfigured
      ? { status: "loading", user: null, error: null }
      : { status: "disabled", user: null, error: null },
  );

  useEffect(() => {
    if (!firebaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const auth = (await getFirebaseAuthAsync()) as {
          currentUser: {
            uid: string;
            isAnonymous?: boolean;
            displayName?: string | null;
            email?: string | null;
          } | null;
        };
        const mod = (await import("firebase/auth")) as unknown as {
          onAuthStateChanged: (
            a: unknown,
            cb: (u: AuthenticatedMovaUser | null) => void,
          ) => void;
          signInAnonymously: (a: unknown) => Promise<void>;
        };
        mod.onAuthStateChanged(auth, (u) => {
          if (cancelled || !u) return;
          setState({
            status: "ready",
            user: {
              uid: u.uid,
              isAnonymous: u.isAnonymous ?? true,
              displayName: u.displayName ?? null,
              email: u.email ?? null,
            },
            error: null,
          });
        });
        const current = auth.currentUser;
        if (!current) await mod.signInAnonymously(auth);
        else if (!cancelled)
          setState({
            status: "ready",
            user: {
              uid: current.uid,
              isAnonymous: current.isAnonymous ?? true,
              displayName: current.displayName ?? null,
              email: current.email ?? null,
            },
            error: null,
          });
      } catch (e) {
        if (!cancelled)
          setState({
            status: "error",
            user: null,
            error: e instanceof Error ? e.message : "auth_failed",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

// Back-compat for Phase 0 store import path.
export type Phase0AuthState = {
  status: AuthStatus;
  uid: string | null;
  error: string | null;
};

export function usePhase0Auth(): Phase0AuthState {
  const a = usePhase1Auth();
  return { status: a.status, uid: a.user?.uid ?? null, error: a.error };
}

