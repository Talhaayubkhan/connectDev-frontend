# ConnectDev Frontend Stability Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing ConnectDev frontend reliable, responsive, accessible, tested, secure, and accurately documented without adding chat.

**Architecture:** TanStack Query remains the only server state manager. Focused services return stable domain values, shared interface components own repeated loading and error behavior, and route modules load lazily. Existing visual language stays in place while mobile layout and accessibility behavior are corrected.

**Tech Stack:** React 19, Vite 7, React Router 7, TanStack Query 5, Axios, Formik, Yup, Tailwind CSS 4, DaisyUI 5, Vitest, React Testing Library

**Spec:** `docs/superpowers/specs/2026-08-27-frontend-stability-hardening-design.md`

## Global Constraints

- Cover only authentication, password recovery, feed discovery, connection requests, connections, and profiles.
- Do not build chat in this pull request.
- Keep the current ConnectDev visual identity and DaisyUI theme.
- Comments explain only non obvious decisions and contracts.
- Preserve cookie based authentication through `withCredentials: true`.
- Support responsive reflow at 320, 375, 768, 1024, and 1440 pixel widths.
- End with zero lint errors, passing tests, a successful production build, and no high severity production dependency findings.

---

### Task 1: Test Harness and Dependency Baseline

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.js`
- Create: `src/test/setup.js`
- Create: `src/test/renderApp.jsx`
- Create: `src/utils/validation.test.js`

**Interfaces:**
- Produces: `renderWithProviders(ui, options)` for component tests.
- Produces: `npm test`, `npm run test:coverage`, and `npm run check` scripts.

- [ ] **Step 1: Install the testing dependencies and safe dependency updates**

Run:

```bash
npm install --save-dev vitest@latest jsdom@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest @vitest/coverage-v8@latest
npm audit fix
```

- [ ] **Step 2: Add the test scripts and Vitest configuration**

Add these scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"check": "npm run lint && npm test && npm run build"
```

Add this test configuration to `vite.config.js`:

```js
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: "./src/test/setup.js",
  css: true,
},
```

- [ ] **Step 3: Add the shared test setup and provider renderer**

`src/test/setup.js`:

```js
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);
```

`src/test/renderApp.jsx` creates a `QueryClient` with retry disabled, wraps children in `QueryClientProvider` and `MemoryRouter`, and returns the client next to React Testing Library's render result.

- [ ] **Step 4: Write and run validation tests**

Cover password strength, matching confirmation, optional profile URLs, and duplicate skills with case insensitive normalization.

Run:

```bash
npm test -- src/utils/validation.test.js
```

Expected: duplicate skills with different letter casing fails until Task 6 updates the schema.

- [ ] **Step 5: Commit the testing baseline**

```bash
git add package.json package-lock.json vite.config.js src/test src/utils/validation.test.js
git commit -m "test: add frontend regression harness"
```

### Task 2: Runtime Configuration, API Errors, and State Ownership

**Files:**
- Modify: `.gitignore`
- Create: `.env.example`
- Delete: `.env`
- Modify: `src/utils/constants.js`
- Create: `src/services/apiError.js`
- Modify: `src/services/apiClient.js`
- Modify: `src/main.jsx`
- Delete: `src/store/index.js`
- Delete: `src/store/features/auth/authSlice.js`
- Delete: `src/store/features/feed/feedSlice.js`
- Modify: `src/hooks/auth/useAuthMutation.js`
- Test: `src/services/apiError.test.js`

**Interfaces:**
- Produces: `getErrorMessage(error, fallback)` returning a user safe string.
- Produces: `QUERY_KEYS` and `ROUTES` as the only shared key and route constants.
- Consumes: TanStack Query cache for authentication cleanup.

- [ ] **Step 1: Write failing error normalization tests**

Test these cases:

```js
expect(getErrorMessage({ response: { data: { message: "Invalid email" } } }, "Failed")).toBe("Invalid email");
expect(getErrorMessage(new Error("Network Error"), "Failed")).toBe("Network Error");
expect(getErrorMessage({}, "Failed")).toBe("Failed");
```

Run `npm test -- src/services/apiError.test.js` and verify failure because the module does not exist.

- [ ] **Step 2: Implement stable runtime configuration and API error handling**

Use only `VITE_API_BASE_URL`, strip trailing slashes, set a 15 second timeout, and keep credentials enabled. Add `.env` to `.gitignore`, provide `.env.example`, and remove the tracked development file.

`getErrorMessage` must prefer `response.data.message`, then `error.message` unless it is the generic Axios status message, then the supplied fallback.

- [ ] **Step 3: Remove unused Redux state**

Remove the Redux provider from `src/main.jsx`, delete the unused store files, and remove Redux dispatches from authentication mutations. Logout and password change clear TanStack Query and navigate with `{ replace: true }`.

- [ ] **Step 4: Consolidate constants**

Remove `BASE_URL`, `CONNECTION_KEYS`, unused chat routes, and unused socket events. Extend `ROUTES` with exact auth paths and use `QUERY_KEYS` in every query and mutation.

- [ ] **Step 5: Run focused and full checks, then commit**

```bash
npm test -- src/services/apiError.test.js
npm run lint
git add .gitignore .env.example src package.json package-lock.json
git rm .env src/store/index.js src/store/features/auth/authSlice.js src/store/features/feed/feedSlice.js
git commit -m "refactor: simplify frontend state and api config"
```

### Task 3: Shared Async States and Lazy Routes

**Files:**
- Create: `src/components/common/PageLoader.jsx`
- Create: `src/components/common/EmptyState.jsx`
- Modify: `src/components/common/ErrorPage.jsx`
- Modify: `src/routes/AppRoutes.jsx`
- Modify: `src/routes/ProtectedRoute.jsx`
- Modify: `src/routes/PublicRoute.jsx`
- Modify: `src/layouts/MainLayout.jsx`
- Test: `src/routes/routeGuards.test.jsx`

**Interfaces:**
- Produces: `PageLoader({ label, fullPage })`.
- Produces: `EmptyState({ icon, title, description, action })`.
- Produces: `ErrorPage({ code, message, subMessage, onRetry, fullPage })`.

- [ ] **Step 1: Write route guard regression tests**

Mock `useShowProfile` and verify:

```js
expect(screen.getByRole("status", { name: /checking your session/i })).toBeInTheDocument();
expect(screen.getByText("Protected content")).toBeInTheDocument();
expect(screen.getByText("Public content")).toBeInTheDocument();
```

Also verify unauthenticated protected navigation resolves to the login path and authenticated public navigation resolves to the feed path.

- [ ] **Step 2: Run the route tests and verify they fail**

Run `npm test -- src/routes/routeGuards.test.jsx`.

Expected: FAIL because the accessible shared status does not exist.

- [ ] **Step 3: Build shared state components**

Use semantic headings, `role="status"` for loaders, concise copy, optional retry actions, and authenticated layout height based on available content rather than `min-h-screen` inside every page.

- [ ] **Step 4: Lazy load page modules**

Replace eager page imports with `lazy(() => import(...))` and wrap the route tree in `Suspense` using `PageLoader`. Keep layouts and route guards eager because they are part of the shell.

- [ ] **Step 5: Run tests and measure the production bundle**

```bash
npm test -- src/routes/routeGuards.test.jsx
npm run build
```

Expected: route tests pass and page modules appear as separate build chunks.

- [ ] **Step 6: Commit**

```bash
git add src/components/common src/routes src/layouts/MainLayout.jsx
git commit -m "refactor: standardize page states and lazy routes"
```

### Task 4: Authentication and Password Recovery Fixes

**Files:**
- Modify: `src/components/common/PasswordInput.jsx`
- Modify: `src/pages/auth/LoginPage.jsx`
- Modify: `src/pages/auth/ForgotPasswordPage.jsx`
- Modify: `src/pages/auth/ResetPasswordPage.jsx`
- Modify: `src/services/auth/userAuth.js`
- Modify: `src/hooks/auth/useAuthMutation.js`
- Test: `src/pages/auth/ResetPasswordPage.test.jsx`
- Test: `src/pages/auth/LoginPage.test.jsx`

**Interfaces:**
- `PasswordInput({ name, label, placeholder, autoComplete })` owns one connected error message.
- `resetPassword({ token, newPassword, confirmPassword })` sends all three fields.

- [ ] **Step 1: Write failing reset password and auth layout tests**

Submit matching values and assert:

```js
expect(mutate).toHaveBeenCalledWith(
  { token: "valid-token", newPassword: "StrongPass1", confirmPassword: "StrongPass1" },
  expect.any(Object),
);
```

Switch to registration and verify accessible inputs for first name, last name, email, password, and confirmation. Verify only one error is rendered for each password field.

- [ ] **Step 2: Verify the tests fail**

Run `npm test -- src/pages/auth/ResetPasswordPage.test.jsx src/pages/auth/LoginPage.test.jsx`.

- [ ] **Step 3: Fix payloads, labels, errors, and mobile overflow**

Pass `confirmPassword` through the reset page and service. Give inputs connected labels, IDs, autocomplete values, `aria-invalid`, and described error IDs. Remove duplicate page level password errors.

Replace fixed `h-screen overflow-hidden` with `min-h-screen`, vertical scrolling, and `min-h-dvh`. Stack registration name fields below the small breakpoint. Remove invented platform statistics and unimplemented chat claims from the auth hero.

- [ ] **Step 4: Remove disabled source and debug logging**

Delete old commented page implementations and console output. Keep user facing errors through inline messages and toasts.

- [ ] **Step 5: Run tests and commit**

```bash
npm test -- src/pages/auth/ResetPasswordPage.test.jsx src/pages/auth/LoginPage.test.jsx
npm run lint
git add src/components/common/PasswordInput.jsx src/pages/auth src/services/auth src/hooks/auth
git commit -m "fix: harden authentication and password recovery"
```

### Task 5: Connections, Requests, Feed, and Honest Navigation

**Files:**
- Modify: `src/components/common/UserCard.jsx`
- Modify: `src/components/common/ProfileCard.jsx`
- Modify: `src/pages/connections/ConnectionsPage.jsx`
- Modify: `src/pages/connections/RequestPage.jsx`
- Modify: `src/pages/feed/FeedPage.jsx`
- Modify: `src/pages/profile/UniqueProfile.jsx`
- Modify: `src/hooks/connections/useConnections.js`
- Modify: `src/hooks/feed/useFeedData.js`
- Modify: `src/services/connections/getAllConnections.js`
- Modify: `src/services/connections/getAllReceivedRequests.js`
- Modify: `src/services/feed/feedService.js`
- Test: `src/pages/connections/RequestPage.test.jsx`
- Test: `src/components/common/UserCard.test.jsx`

**Interfaces:**
- `pendingAction` always uses `{ id, status }`.
- Connection cards expose only the implemented profile action.
- Empty states may link to `ROUTES.FEED`.

- [ ] **Step 1: Write failing request and card tests**

Click Accept and verify the button for that request renders a spinner and all other request actions are disabled. Verify connection cards have a profile link and no broken message link.

- [ ] **Step 2: Verify the tests fail**

Run `npm test -- src/pages/connections/RequestPage.test.jsx src/components/common/UserCard.test.jsx`.

- [ ] **Step 3: Fix request state and remove broken routes**

Change `type` to `status`, remove the duplicate browser alert, remove `/chat/:id` links, and replace `/connect` navigation with `ROUTES.FEED`. Preserve profile navigation.

- [ ] **Step 4: Normalize service results and async states**

Return arrays from connection services, keep 404 as an empty collection in hooks, use shared query keys, and use shared loader, error, and empty state components. Use content based minimum heights inside `MainLayout`.

- [ ] **Step 5: Improve card responsiveness**

Stack actions at 320 pixels, use stable skill text as keys, ensure buttons have touch friendly height, and prevent long location, occupation, and biography text from causing horizontal overflow.

- [ ] **Step 6: Run tests and commit**

```bash
npm test -- src/pages/connections/RequestPage.test.jsx src/components/common/UserCard.test.jsx
npm run lint
git add src/components/common/UserCard.jsx src/components/common/ProfileCard.jsx src/pages/connections src/pages/feed src/pages/profile/UniqueProfile.jsx src/hooks src/services
git commit -m "fix: repair connection flows and responsive cards"
```

### Task 6: Navigation, Dialog, Profile Form, and Footer Accessibility

**Files:**
- Modify: `src/components/layout/NavBar.jsx`
- Modify: `src/components/layout/Footer.jsx`
- Modify: `src/components/common/PopUp.jsx`
- Modify: `src/pages/profile/ProfilePage.jsx`
- Modify: `src/pages/profile/ProfilePasswordChange.jsx`
- Modify: `src/utils/validation.js`
- Modify: `src/index.css`
- Test: `src/components/layout/NavBar.test.jsx`
- Test: `src/components/common/PopUp.test.jsx`

**Interfaces:**
- Mobile navigation trigger uses `aria-expanded` and `aria-controls="mobile-navigation"`.
- `PopUp` accepts `title`, `message`, `confirmLabel`, `onConfirm`, `onCancel`, and `isLoading`.

- [ ] **Step 1: Write failing keyboard and dialog tests**

Verify the mobile menu opens with an accessible name, closes on Escape, closes after a navigation link click, and reports active navigation with `aria-current="page"`. Verify the confirmation dialog has dialog semantics, focuses Cancel on open, closes on Escape, and returns focus to the invoking control.

- [ ] **Step 2: Verify the tests fail**

Run `npm test -- src/components/layout/NavBar.test.jsx src/components/common/PopUp.test.jsx`.

- [ ] **Step 3: Implement menu and dialog behavior**

Use refs and effects for Escape handling, focus restoration, and body scroll locking. Add dialog title and description IDs. Respect reduced motion through Framer Motion and a global `prefers-reduced-motion` rule.

- [ ] **Step 4: Repair profile form responsiveness and feedback**

Use `grid-cols-1 sm:grid-cols-2`, connect labels to fields, show errors for age, gender, URL, biography, location, occupation, and skills, enforce 15 skills in the add control, and reject duplicates without letter case sensitivity.

The password dialog must use the same accessible dialog behavior, close after successful change, and not use a hard coded white loading overlay.

- [ ] **Step 5: Replace fake footer interactions**

Remove links without destinations. Keep concise branding, current year, and a real GitHub repository link with an accessible external link label.

- [ ] **Step 6: Run tests and commit**

```bash
npm test -- src/components/layout/NavBar.test.jsx src/components/common/PopUp.test.jsx src/utils/validation.test.js
npm run lint
git add src/components src/pages/profile src/utils/validation.js src/index.css
git commit -m "fix: improve responsive and accessible interactions"
```

### Task 7: Documentation, Continuous Integration, and Final Verification

**Files:**
- Modify: `README.md`
- Delete: `docs/repo-review-and-roadmap.md`
- Create: `.github/workflows/frontend-quality.yml`
- Modify: `index.html`

**Interfaces:**
- CI runs Node 22 with `npm ci`, lint, tests, build, and production audit.

- [ ] **Step 1: Replace stale documentation**

Document only implemented features, `VITE_API_BASE_URL`, Node 22 or later, all scripts, the real folder structure, cookie authentication, the backend repository URL, and the fact that chat is intentionally excluded from this version.

Delete the roadmap because verified work and remaining limits belong in the pull request instead of a stale repository document.

- [ ] **Step 2: Add the GitHub Actions quality gate**

Use `actions/checkout@v4` and `actions/setup-node@v4` with Node 22 and npm cache. Run:

```yaml
- run: npm ci
- run: npm run lint
- run: npm test
- run: npm run build
- run: npm audit --omit=dev --audit-level=high
```

- [ ] **Step 3: Correct page metadata**

Set the page title to `ConnectDev | Developer Network`, add a concise description, theme color, and responsive viewport metadata.

- [ ] **Step 4: Run the complete verification matrix**

```bash
npm run lint
npm test
npm run build
npm audit --omit=dev --audit-level=high
git diff --check
```

Expected: every command exits zero. Inspect build output and record chunk sizes for the pull request.

- [ ] **Step 5: Inspect repository state and commit**

```bash
git status --short
git diff --stat main...HEAD
git add README.md .github/workflows/frontend-quality.yml index.html
git rm docs/repo-review-and-roadmap.md
git commit -m "docs: align frontend setup and quality checks"
```

- [ ] **Step 6: Push and open the pull request**

Push `codex/frontend-stability-hardening` and open a pull request into `main` titled `Harden ConnectDev frontend reliability and responsiveness`. The description must summarize fixes, tests, responsive and accessibility changes, verification results, and the local preview capture limitation.
