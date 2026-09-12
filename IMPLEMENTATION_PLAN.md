## Implementation Plan

**Goal:** Fix the 7 FINAL blockers from the Phase 8 audit and make MOVA demo-competition-ready without adding new features or redesigning the product.

### Blocker-by-Blocker approach

1. **Demo Mode (isolated)**
3. **Demo data isolation**
   - Demo data lives only in `mova-demo-mode-v1`; never written into Firestore user docs/resets/checkins.
   - When demo mode active, real Firebase reads are bypassed for demo persona/history; real auth may remain anonymous but is not used for demo writes.

4. **Demo user persona**
   - Generic competition persona (not Amina) with realistic occupation/profile fields for scheduling, personalization, contexts, activity selection.

5. **Demo data seed**
   - Seed realistic demo history: completed resets, one skipped, one rescheduled, multiple activity types/contexts, walking activity, realistic times, at least one reward.
   - Analytics/rewards derive from seeded data.

6. **Demo scenario/narrative**
14. **Notification integration**
    - Ensure scheduled reset → reminder service → notification/in-app intervention → START path is connected; if browser notifications unavailable, in-app intervention still works.

15. **Demo reset**
    - Add RESET DEMO control that clears only demo state and restores initial demo scenario; never delete Firebase user/real history/places/profile.

16. **Demo mode exit**
    - Add EXIT DEMO MODE that restores normal user state and removes demo state from product UI; no manual storage clearing required.

17. **Demo + AI**
    - Deterministic behavioral engine produces recommendation even if AI provider unavailable; AI explanation optional.

18. **Demo + analytics**
    - Demo analytics derived from demo history via existing `buildAnalyticsSummary`.

19. **Demo + rewards**
    - Rewards derived from demo activity via existing `calculateRewards`.

20. **Browser E2E validation**
    - After implementation, run app in browser and perform full E2E checklist; record PASS/FAIL/BLOCKED.

21. **Build validation**
    - Run `npx tsc --noEmit` and `npm run build`; both must pass.

22. **Final code cleanup**
    - Remove unnecessary console.logs, debug buttons, dead imports, dead prototype logic, duplicate services, fake metrics, fake AI claims, obsolete routes, temporary testing code after confirming no functionality loss.

23. **Final product audit**
    - Re-audit all features and classify each as WORKING/PARTIAL/FAILED.

24. **Final competition test + readiness verdict**
    - Run full competition narrative end-to-end and provide final status table, demo mode summary, E2E results, build status, remaining issues, verdict: READY or NEEDS FIXES.

### Key files to modify/create

Created:
- `src/lib/mova-demo.ts`

Modified:
- `src/lib/mova-store.tsx`
- `src/routes/home.tsx`
- `src/routes/reset.tsx`
- `src/routes/verify.tsx`
- `src/routes/walk.tsx`
- `src/routes/scan.tsx`
- `src/routes/places.tsx`
- `src/routes/profile.tsx`
- `src/routes/checkin.tsx`
- `src/routes/learning.tsx`
- `src/routes/insights.tsx`
- possibly `src/lib/mova-types.ts`, `src/lib/mova-demo-geo.ts`, `src/lib/mova-activities.ts`, `src/lib/notifications/notification-service.ts`, `src/lib/camera/verification-service.ts`

Not touched:
- Visual identity.

### Validation

- TypeScript: `npx tsc --noEmit`
- Build: `npm run build`
- Browser E2E: manual checklist executed and recorded.

### End state

Two modes: NORMAL MODE (real Firebase-backed user) and DEMO MODE (controlled isolated competition scenario). Same UI and core domain interfaces; only data/control layer differs.

   - Demo home shows: MOVA understands user → context → upcoming reset → recommendation → reminder/trigger → start → activity → verification → complete → analytics/rewards → next recommendation.

7. **Demo context control**
   - Add demo control to set context HOME/WORK/SCHOOL/ON THE MOVE feeding existing context-aware logic; UI marks “Demo context · Work”.

8. **Demo time control**
   - Add “Trigger next reset” control that uses existing reminder/intervention flow (create reminder, mark triggered, show intervention UI) without bypassing it.

9. **Demo walking**
   - Demo walking uses existing walking/reset architecture with controlled simulated progress 0.00 → 0.20 → 0.45 → 0.70 mi, clearly labeled simulated; final reset completes via normal pipeline.

10. **Demo camera**
    - Camera demo uses official verification architecture and real camera preview when available; otherwise existing controlled fallback; clearly labeled prototype/demo verification.

11. **Prototype route cleanup**
    - `scan.tsx`, `walk.tsx`, `places.tsx` reviewed: keep but make purpose explicit (demo/prototype) and integrate walking/camera into official reset journey so users don't need to manually navigate from unrelated pages.

12. **Official walking flow**
    - Walking reset starts from Home/recommended activity → START → walking activity → location tracking → distance progress → goal reached → complete; eliminate need to manually navigate to `/walk`.

13. **Official camera flow**
    - Camera-required reset: Home → recommended activity → START → activity → VERIFY → camera → verified → complete; eliminate need to manually navigate to `/scan`.

   - Create `src/lib/mova-demo.ts` (demo state provider + demo data seed) using isolated in-memory + `localStorage` namespace `mova-demo-mode-v1`.
   - Do NOT touch real Firebase data path.
   - Inject demo state into existing `MovaProvider` so the same UI and domain interfaces are reused.

2. **Demo Mode activation**
   - Add activation path via URL query param `?demo` plus a small demo control in Profile (only visible when appropriate).
   - Presenter can open `http://localhost:5173/?demo` to enter demo mode quickly.
