import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MovaProfile = {
  name: string;
  occupation: string;
  workStyle: string[];
  constraints: string[];
  breakRhythm: string;
};

export type ResetEntry = {
  id: string;
  time: string;
  title: string;
  kind: "Movement" | "Breathing" | "Eye" | "Reflection" | "Hydration";
  status: "completed" | "rescheduled";
  feeling?: string;
  reason?: string;
};

export type MovaState = {
  profile: MovaProfile;
  history: ResetEntry[];
  onboarded: boolean;
  lastFeeling?: string;
  lastNeeds: string[];
};

const defaultProfile: MovaProfile = {
  name: "Amina",
  occupation: "Healthcare",
  workStyle: ["Mostly standing", "Walking frequently", "Mentally demanding"],
  constraints: [
    "I work with patients/customers",
    "I have unpredictable breaks",
    "I can't use my phone while working",
  ],
  breakRhythm: "My schedule is unpredictable",
};

const defaultState: MovaState = {
  profile: defaultProfile,
  onboarded: false,
  lastNeeds: [],
  history: [
    {
      id: "h1",
      time: "9:20 AM",
      title: "Breathing reset",
      kind: "Breathing",
      status: "completed",
      feeling: "Better",
    },
    {
      id: "h2",
      time: "11:15 AM",
      title: "Movement reset",
      kind: "Movement",
      status: "completed",
      feeling: "Much better",
    },
    {
      id: "h3",
      time: "1:45 PM",
      title: "Shoulder release",
      kind: "Movement",
      status: "rescheduled",
      reason: "Patient interaction",
    },
    {
      id: "h4",
      time: "3:10 PM",
      title: "Eye reset",
      kind: "Eye",
      status: "completed",
      feeling: "About the same",
    },
  ],
};

type Ctx = {
  state: MovaState;
  setProfile: (patch: Partial<MovaProfile>) => void;
  completeOnboarding: () => void;
  addEntry: (entry: Omit<ResetEntry, "id">) => void;
  setCheckIn: (feeling: string, needs: string[]) => void;
  reset: () => void;
};

const MovaContext = createContext<Ctx | null>(null);
const KEY = "mova-demo-state-v1";

export function MovaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MovaState>(defaultState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...defaultState, ...(JSON.parse(raw) as MovaState) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const setProfile = useCallback((patch: Partial<MovaProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((s) => ({ ...s, onboarded: true }));
  }, []);

  const addEntry = useCallback((entry: Omit<ResetEntry, "id">) => {
    setState((s) => ({
      ...s,
      history: [{ ...entry, id: crypto.randomUUID() }, ...s.history],
    }));
  }, []);

  const setCheckIn = useCallback((feeling: string, needs: string[]) => {
    setState((s) => ({ ...s, lastFeeling: feeling, lastNeeds: needs }));
  }, []);

  const reset = useCallback(() => setState(defaultState), []);

  const value = useMemo(
    () => ({ state, setProfile, completeOnboarding, addEntry, setCheckIn, reset }),
    [state, setProfile, completeOnboarding, addEntry, setCheckIn, reset],
  );

  return <MovaContext.Provider value={value}>{children}</MovaContext.Provider>;
}

export function useMova() {
  const ctx = useContext(MovaContext);
  if (!ctx) throw new Error("useMova must be used inside MovaProvider");
  return ctx;
}
