# connectDev — Frontend

The React frontend for **connectDev**, a developer networking platform. Handles authentication, profiles, connections, real-time chat, and content discovery.

## Features

- **Authentication** — Secure login and registration with JWT-based session handling
- **Profiles** — Create and manage your professional profile
- **Connections** — Send, receive, and manage connection requests
- **Real-time Chat** — Instant 1:1 messaging powered by Socket.IO
- **Feed & Discovery** — Browse and interact with relevant developers
- **Responsive** — Fully optimized for desktop, tablet, and mobile

## Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **HTTP Client:** Axios (configured in `services/apiClient.js`)
- **State Management:** Context API / Redux
- **Styling:** CSS
- **Linting:** ESLint

## Getting Started

### Prerequisites

- Node.js v14+
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/connectDev-frontend.git
cd connectDev-frontend
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

For production, set this to your deployed backend URL:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Running the App

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

The dev server runs at `http://localhost:5173`.

> **Note:** This project is currently in active development and not yet deployed to production. The build and preview scripts are available for local testing only.

## Project Structure

```
src/
├── App.jsx                   # Root component
├── main.jsx                  # Entry point
├── index.css                 # Global styles
│
├── routes/
│   ├── AppRoutes.jsx         # Route definitions
│   ├── ProtectedRoute.jsx    # Redirects unauthenticated users to login
│   └── PublicRoute.jsx       # Redirects authenticated users away from auth pages
│
├── layouts/
│   ├── MainLayout.jsx        # Authenticated app shell (nav, sidebar)
│   ├── AuthLayout.jsx        # Minimal layout for login/register
│   └── ChatLayout.jsx        # Chat interface layout
│
├── pages/
│   ├── auth/                 # Login, Register
│   ├── feed/                 # Discovery feed
│   ├── connections/          # Connections and requests
│   └── profile/              # Profile view and edit
│
├── components/
│   ├── common/               # Buttons, cards, inputs, modals
│   └── layout/               # Header, sidebar, nav components
│
├── hooks/
│   ├── auth/                 # useLogin, useRegister, etc.
│   ├── chats/                # useMessages, useChatList, etc.
│   ├── connections/          # useConnections, useRequests, etc.
│   ├── feed/                 # useFeed
│   └── profile/              # useProfile, useEditProfile
│
├── services/
│   ├── apiClient.js          # Axios instance — base URL, interceptors, auth headers
│   ├── auth/                 # Auth API calls
│   ├── chats/                # Chat API calls
│   ├── connections/          # Connection API calls
│   ├── feed/                 # Feed API calls
│   └── profile/              # Profile API calls
│
├── store/                    # Global state (Redux/Context)
├── utils/                    # Shared utility functions
└── assets/                   # Images, fonts, static files
```

**Architecture pattern:** `Page` → `Hook` → `Service` → `apiClient`

Pages own layout and rendering; hooks manage state and side effects; services handle all API calls.

## Authentication Flow

1. User submits credentials on the login page
2. The backend validates and sets a JWT httpOnly cookie
3. Axios interceptors attach credentials to every subsequent request
4. `ProtectedRoute` verifies auth state before rendering any guarded page
5. Unauthenticated users are redirected to `/login`

## Scripts

| Script            | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start development server                       |
| `npm run build`   | Create a production build (outputs to `dist/`) |
| `npm run preview` | Serve the production build locally for testing |
| `npm run lint`    | Run ESLint                                     |

## Related

[Backend Repository](../connectDev-backend) — Node.js / Express / Socket.IO API

## Author

**Talha Ayub** — [GitHub](https://github.com/your-username)

## License

ISC
