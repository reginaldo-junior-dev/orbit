# Orbit — Frontend

Orbit is a personal productivity SaaS concept — tasks, projects, and goals in one calm workspace. This repository is the frontend: a React + Vite single-page app with a dark, orbital-themed design system, a full authenticated app area, and a real checkout flow integrated with Mercado Pago.

**Live app:** https://orbit-inky-xi.vercel.app
**Backend repo:** https://github.com/reginaldo-junior-dev/orbit-backend

## Demo credentials

The deployed app has two seeded accounts so you can explore it without registering:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@orbit.com` | `iJpD8LqZhHz@v` |
| User | `user@orbit.com` | `ZaNGmWm5Q4@7L` |

The admin account can access `/admin` to view, edit, and delete registered users.

## Payment testing

The checkout flow (Pro / Constellation plans) runs against **Mercado Pago's sandbox**. The backend is configured with Mercado Pago **test credentials**, so any purchase made through the pricing section is a simulated charge — no real money ever moves.

To test the complete payment flow, use the provided test buyer account and test payment credentials:

1. Click a plan's "Assinar"/subscribe button in the pricing section — you'll be redirected to Mercado Pago's Checkout Pro.
2. When Checkout Pro asks you to log in, use a Mercado Pago **test buyer account**, not your personal Mercado Pago account (see below for how to get one).
3. Pay with a Mercado Pago **test card** instead of a real card, to simulate an approved, pending, or rejected payment.
4. You'll land back on the app's dedicated success/pending/failure return page depending on the simulated outcome.

### How to access the test credentials

1. Go to the [Mercado Pago Developers panel](https://www.mercadopago.com.br/developers/panel) and log in (create a free account if you don't have one).
2. Open **Your integrations** and select the application used by this project (or create one).
3. In the application menu, open **Test credentials** to see the test **Public Key** and **Access Token** — the Access Token is what the backend uses as `MP_ACCESS_TOKEN`.
4. Open **Test accounts** in the sidebar and create two test accounts: a **seller** (linked to the application) and a **buyer** (used to log in and pay during checkout).
5. Use the **test buyer** account's email/password when Checkout Pro asks you to log in.
6. Use a Mercado Pago test card number for payment. Mercado Pago's docs list test cards per country and outcome — the "name on card" field (e.g. `APRO`) controls whether the simulated payment is approved, rejected, or pending.

> Test accounts and test cards never move real money — they exist purely so the full payment flow can be exercised safely.

## Features

- **Landing page** — hero, features, pricing, FAQ, testimonials, fully responsive and accessible (skip links, focus states, `prefers-reduced-motion` support)
- **Authentication** — register/login backed by httpOnly cookies (the JWT never touches JavaScript) with CSRF protection on every mutating request
- **Dashboard** — aggregated view of tasks, projects, and goals, plus the user's current plan
- **Tasks, Projects, Goals** — full CRUD, ownership-scoped to the logged-in user
- **Checkout** — the Pro/Constellation plans on the pricing section trigger a real Mercado Pago Checkout Pro flow (monthly or annual billing), with dedicated success/pending/failure return pages
- **Admin area** — list all users, edit their name/email/role, or delete their account entirely (protected against an admin editing/removing themselves)
- **Profile & Settings** — update account details, change password, danger zone

## Tech stack

- React 19 + Vite
- React Router 7
- Tailwind CSS 4
- lucide-react (icons)

## Project structure

```
src/
  components/   ui, layout, sections, shared (design system + composed sections)
  pages/        one file per route
  services/     API calls (api.js centralizes fetch, CSRF, and error handling)
  context/      auth context/provider
  hooks/        shared hooks (e.g. useApiData)
  lib/          small pure helpers (dates, status maps, validation)
```

## Getting started

```bash
npm install
npm run dev
```

The app expects a running instance of the [backend](https://github.com/reginaldo-junior-dev/orbit-backend) API.

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL (or path) for the backend API | `http://localhost:8080` |

In production, `VITE_API_URL` is set to `/api`, and `vercel.json` rewrites `/api/*` to the backend on Render. This keeps the frontend and backend on the same origin from the browser's point of view, which is what makes the authentication cookies work across two separately hosted services (browsers block cross-site cookies between different domains).

### Build

```bash
npm run build
npm run lint
```

### Docker Compose (runs this app + the backend + Postgres together)

This repo has a `Dockerfile` (a static build served by nginx, proxying `/api/*` to the backend so auth cookies keep working), but the actual `docker-compose.yml` that wires it up with the backend and a database lives in the [backend repo](https://github.com/reginaldo-junior-dev/orbit-backend). It expects this repo cloned as a sibling directory:

```
some-folder/
  orbit/           <- this repo
  orbit-backend/
```

Then, from the backend repo: `cp .env.example .env`, fill it in, and `docker compose up --build`. Full instructions (including where to get Mercado Pago test credentials for `.env`) are in that repo's README.

## Development note

This project was developed with the assistance of Claude Code for coding suggestions, debugging, and refactoring.
