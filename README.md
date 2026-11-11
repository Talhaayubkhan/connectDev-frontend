# ConnectDev frontend

ConnectDev is a responsive web app for discovering developers, managing a professional profile, and building a network through connection requests. This repository contains the React frontend. The API lives in the [ConnectDev backend repository](https://github.com/Talhaayubkhan/connectDev-backend).

## Features

- Sign up, sign in, sign out, and password recovery
- Protected routes backed by an HTTP-only cookie session
- Developer discovery feed with connect and skip actions
- Received request review and connection management
- Public connection profiles and an editable personal profile
- Responsive layouts, keyboard-friendly dialogs, and reduced-motion support

Chat is not currently implemented in this frontend.

## Stack

- React 19 and React Router
- Vite 7
- TanStack Query for server state
- Axios for API requests
- Formik and Yup for forms and validation
- Tailwind CSS 4 and DaisyUI
- Vitest and React Testing Library

## Local setup

Requirements: Node.js 22 or newer and npm.

```bash
git clone https://github.com/Talhaayubkhan/connectDev-frontend.git
cd connectDev-frontend
npm ci
cp .env.example .env
npm run dev
```

Configure the backend origin in `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

The development server is available at `http://localhost:5173` by default. The frontend and backend origins must both allow credentialed requests because authentication uses an HTTP-only cookie.

## Quality commands

| Command                 | Purpose                              |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start the Vite development server    |
| `npm run lint`          | Run ESLint                           |
| `npm test`              | Run the Vitest suite once            |
| `npm run test:watch`    | Run tests in watch mode              |
| `npm run test:coverage` | Generate test coverage               |
| `npm run build`         | Create a production build in `dist/` |
| `npm run preview`       | Preview the production build         |
| `npm run check`         | Run lint, tests, and build           |

## Architecture

The main data path is `page -> query or mutation hook -> service -> apiClient`.

- `src/pages`: route-level screens
- `src/components`: shared UI and layouts
- `src/hooks`: TanStack Query hooks and mutations
- `src/services`: API client and endpoint functions
- `src/routes`: lazy routes and access guards
- `src/utils`: routes, query keys, and validation schemas
- `src/test`: shared test setup and render helpers

Server data belongs in TanStack Query. Local component state is used for temporary UI state such as open menus and form input.

## Project notes

The former `docs/` folder contained an internal stability-hardening design and implementation plan, not documentation needed to run or use the app. Its main points are summarized here:

- The frontend covers authentication and password recovery, developer discovery, connection requests, connections, and profiles. Chat is not implemented.
- TanStack Query owns server state; API calls go through the credentialed Axios client and the backend's cookie-based authentication.
- The UI should remain responsive and accessible, including keyboard-operable navigation and dialogs, clear form errors, and reduced-motion support.
- Changes should include focused regression tests and be checked with lint, tests, and a production build. GitHub Actions runs these quality checks on pushes to `main` and pull requests.

That plan was written during an earlier hardening effort and may mention issues or targets that have since changed. Use this README and the current source, package scripts, and workflow as the reference for the frontend's present behavior.

## Security notes

- Do not commit `.env` files.
- Keep `VITE_API_BASE_URL` limited to the API origin. Vite variables are public in the browser bundle, so never put secrets in them.
- The Axios client sends credentials and applies a request timeout. Authorization remains enforced by the backend.

## License

ISC
