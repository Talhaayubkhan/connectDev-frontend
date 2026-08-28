# ConnectDev Frontend Stability Hardening

## Goal

Make the existing ConnectDev frontend reliable, responsive, accessible, easier to maintain, and safe to extend. This pass covers the features that already exist: authentication, password recovery, feed discovery, connection requests, connections, and profiles.

Chat is not part of this pass. The current interface links to chat routes that do not exist. Those actions will be removed until the frontend and backend chat contract is designed and implemented together.

## Confirmed Problems

The repository currently has the following verified issues:

- ESLint fails with four errors.
- The production JavaScript bundle is about 646 kB before gzip and triggers Vite's chunk size warning.
- The production dependency audit reports three high severity findings and one moderate finding.
- Message buttons open `/chat/:userId`, but no chat route or page exists.
- Profile error actions navigate to `/connect`, but no such route exists.
- Connection request loading state uses `type`, while the card reads `status`, so the correct spinner is never shown.
- Reset password submission omits `confirmPassword`, although the service sends that field to the backend.
- The login and registration page uses a fixed viewport height with hidden overflow, which can cut off fields on short mobile screens.
- The footer renders interactive looking links without destinations.
- Dialogs and mobile navigation are missing important keyboard, focus, and screen reader behavior.
- Large blocks of old implementations are commented out inside active source files.
- Runtime configuration, repository documentation, and the existing roadmap describe files and features that are no longer present.
- Loading, empty, and error interfaces use inconsistent full screen sizing and duplicated markup.

## Technical Direction

### Application State

TanStack Query will remain the source of truth for server data, including the current user, feed, requests, connections, and profiles. Redux currently stores an unused duplicate user value and an unused feed slice. If source inspection confirms there are no consumers, Redux and its dead slices will be removed to reduce complexity and bundle size.

Query keys will come from one shared query key object. Mutations will either update cached data directly or invalidate the smallest relevant query. Authentication cleanup will clear the query cache before redirecting to the login route.

### API Layer

The Axios client will validate one documented environment variable, set a request timeout, include credentials, and normalize common response errors. A response interceptor will handle an expired session consistently without creating redirect loops.

Services will return predictable domain data rather than a mix of raw responses, nested `data`, and optional chains. Debug logging will be removed. Comments will explain only decisions that are not evident from the code.

### Routing and Bundle Size

All route paths will use the shared route constants. Invalid `/connect` navigation will point to the feed. Broken chat actions will be removed from current cards and profiles.

Page modules will be loaded with `React.lazy` and `Suspense` so the initial bundle does not contain every screen. A shared page loader will cover lazy loading and authenticated profile checks.

### Shared Interface States

Reusable components will standardize:

- Page loading
- Inline and page errors with a retry action where appropriate
- Empty states with a useful next action
- Avatar fallback behavior
- Accessible confirmation dialogs

These components will replace repeated full viewport wrappers that currently create excessive page height inside the authenticated layout.

### Responsive Layout

The authenticated shell will use one centered content container with mobile first spacing. Individual pages will not add duplicate outer padding or full viewport height.

Authentication pages will use `min-height` and vertical scrolling. Registration name fields and profile form rows will become one column on narrow screens and two columns when space permits. Cards will keep actions at least 44 pixels tall on touch devices and avoid fixed widths that cause horizontal overflow.

The mobile navigation will include an accessible name, close on route change and Escape, lock background scrolling while open, restore focus to its trigger, and expose the active page through `aria-current`.

### Accessibility

Form controls will receive stable identifiers, connected labels, appropriate autocomplete values, invalid state, and error descriptions. Duplicate password error messages will be removed.

Dialogs will use dialog semantics, an accessible title and description, initial focus, Escape handling, and focus restoration. Icon only buttons will receive accessible names. Loading indicators and mutation results will be announced without relying only on color or animation. Motion will respect the user's reduced motion preference.

### Documentation

The README will describe only implemented features and real folders. It will document the correct environment variable, supported Node version, scripts, frontend and backend relationship, architecture, and current chat limitation. The stale review roadmap will either be updated to the completed state or removed if it duplicates the README and pull request.

## Testing Strategy

Vitest, React Testing Library, jest-dom, and user-event will provide the baseline test harness. Mock Service Worker or Axios module mocks will isolate frontend behavior from the backend.

Regression tests will cover:

- Public and protected route decisions
- Reset password payload construction
- Request mutation loading state and cache invalidation
- Login and registration tab behavior
- Mobile navigation open, close, Escape, and accessible naming
- Confirmation dialog keyboard behavior
- Service response normalization and expired session handling
- Core validation schemas

The pull request quality gate will run install, lint, tests, production build, and dependency audit. Tests for confirmed bugs will fail before the fix and pass after it.

## Delivery

Implementation will be delivered from `codex/frontend-stability-hardening` through a pull request into `main`. The pull request will separate functional fixes, responsive and accessibility improvements, cleanup, tests, documentation, and verification evidence in plain language.

## Acceptance Criteria

- Every visible navigation action leads to a real route.
- Authentication, password recovery, feed, requests, connections, and profiles preserve their existing backend contract.
- Confirmed functional regressions have automated tests.
- The layout reflows without horizontal overflow at 320, 375, 768, 1024, and 1440 pixel widths by code inspection and available browser verification.
- Keyboard users can operate menus, forms, dialogs, cards, and primary actions.
- Lint, tests, and the production build exit successfully.
- The production dependency audit has no known high severity findings.
- The initial bundle no longer triggers the current single chunk warning, or any remaining warning is documented with measured evidence.
- README content matches the repository exactly.
- No large blocks of disabled source code, debug logging, fake links, or unused application state remain.

## Limits

The connected cloud browser cannot open the local preview in this environment, so screenshot based visual verification is currently blocked. Code level responsive checks, automated interaction tests, and build verification will still be completed. If a usable preview surface becomes available during implementation, the final pass will also include live viewport screenshots.
