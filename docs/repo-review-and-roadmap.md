# Repository Review & Improvement Roadmap

## Current state (quick assessment)

This repository is a Vite + React frontend with routing, Redux auth state, React Query for server-state, Axios services, and Socket.IO utility setup.

### Strengths
- Clean separation of concerns across `pages`, `components`, `hooks`, `services`, and `store`.
- Good baseline routing with guest/protected route wrappers.
- React Query default config is present, which is a strong foundation for cache management.
- Tailwind + DaisyUI integration is complete and simple.

### Gaps found during review
1. **Baseline lint fails** due to several unused imports/variables.
2. **README is still boilerplate** and does not describe project-specific setup, env vars, architecture, scripts, or conventions.
3. **No test harness** (`test` script absent) and no CI quality gate.
4. **State ownership is mixed/unclear** (Redux + React Query + some static data in UI) without explicit rules.
5. **Chat page is placeholder-driven** and not yet connected to actual data/socket events.
6. **Error/loading UX standardization is incomplete** across pages and hooks.

---

## Suggested improvements (what, why, how)

## 1) Fix lint errors and enforce a clean baseline first

### Why
- A failing lint baseline slows development and hides real issues.
- It prevents adding CI checks safely.

### How (step-by-step)
1. Remove unused imports/variables reported by ESLint.
2. Run `npm run lint` until it passes.
3. Add `lint` to CI so future PRs cannot reintroduce these issues.

---

## 2) Replace boilerplate README with project documentation

### Why
- New contributors need fast onboarding.
- Correct env setup avoids runtime issues and inconsistent local behavior.

### How (step-by-step)
1. Document app purpose and high-level architecture.
2. Add local setup steps (`npm install`, `npm run dev`, expected `.env` keys).
3. Describe route structure and auth behavior.
4. Add coding conventions (where to place hooks/services/components).
5. Add troubleshooting section for common issues.

---

## 3) Introduce testing baseline (unit + integration)

### Why
- Without tests, regressions are likely as features expand.
- Auth flow, route guards, and async queries are high-risk areas.

### How (step-by-step)
1. Add Vitest + React Testing Library.
2. Add a simple `test` script and one smoke test per critical area:
   - Route guard behavior (guest/protected).
   - Auth slice reducer behavior.
   - One hook/service interaction with mocked API.
3. Add optional coverage target and increment over time.

---

## 4) Define state-management rules (Redux vs React Query)

### Why
- Mixed state tools are fine, but unclear boundaries create duplication and bugs.

### How (step-by-step)
1. Declare policy:
   - **Redux** for client/global UI/auth/session flags.
   - **React Query** for server-fetched remote entities.
2. Remove duplicated server state from Redux where applicable.
3. Standardize query keys and mutation invalidation/update strategy in a shared guide.

---

## 5) Productionize API layer and runtime config

### Why
- Robust API handling reduces edge-case failures and improves observability.

### How (step-by-step)
1. Ensure `BASE_URL` is env-driven and validated at startup.
2. Add Axios response interceptor for normalized error objects.
3. Add token/session-expiry handling strategy (redirect + toast + cache clear).
4. Add request timeout and retry strategy per endpoint type.

---

## 6) Complete real-time chat implementation

### Why
- The current chat appears UI-only and not feature-complete.
- This is likely a core user-facing flow.

### How (step-by-step)
1. Replace hardcoded messages with query-backed conversation history.
2. Use `targetUserId` to fetch room/conversation context.
3. Connect send/receive events through Socket.IO with optimistic UI update.
4. Add reconnection/offline handling and message delivery status.
5. Add cleanup logic on unmount to avoid duplicate listeners.

---

## 7) Standardize loading, empty, and error states

### Why
- Consistent UX reduces confusion and support overhead.

### How (step-by-step)
1. Create reusable components: `PageLoader`, `InlineError`, `EmptyState`.
2. Apply pattern across feed, profile, connections, and requests pages.
3. Ensure all async hooks expose an intentional state model.

---

## 8) Add CI quality gates

### Why
- Automation protects code quality as the team scales.

### How (step-by-step)
1. Add GitHub Action pipeline:
   - install
   - lint
   - test
   - build
2. Require checks before merge.
3. Optionally add dependency audit and formatting checks.

---

## Suggested execution order (next 2-3 sprints)

### Sprint 1 (stability baseline)
1. Lint cleanup and README replacement.
2. CI with lint + build.
3. Add initial test harness and a small smoke suite.

### Sprint 2 (architecture hardening)
1. State ownership policy + refactors.
2. API interceptors and error normalization.
3. Shared async state UI components.

### Sprint 3 (feature completion)
1. Real-time chat end-to-end integration.
2. Chat tests (socket mocking where possible).
3. Performance pass (lazy-loading routes/components, memoization where needed).

---

## Priority matrix
- **P0 (immediate):** lint cleanup, README, CI baseline.
- **P1 (near-term):** tests, state ownership rules, API hardening.
- **P2 (feature depth):** real-time chat completion and performance tuning.

