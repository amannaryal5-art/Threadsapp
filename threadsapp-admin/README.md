# ThreadsApp Admin

ThreadsApp Admin is a Next.js 14 dashboard for managing the ThreadsApp fashion ecommerce platform. It includes admin authentication, product and inventory workflows, order and return management, users, reviews, coupons, banners, notifications, and analytics dashboards powered by the ThreadsApp REST API backend.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Zustand
- TanStack Query v5
- React Hook Form + Zod
- TanStack Table
- Recharts
- TipTap
- react-dropzone
- react-day-picker
- Axios
- react-hot-toast

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. Point `NEXT_PUBLIC_API_URL` to the ThreadsApp backend, for example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=ThreadsApp Admin
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

4. Start the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Scripts

- `npm run dev` starts the Next.js dev server
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run lint` runs Next.js linting
- `npm run type-check` runs the TypeScript checker

## Auth Flow

- Admin login posts to the local Next.js auth route at `/api/auth/login`
- That route proxies the login request to the ThreadsApp backend
- Access and refresh tokens are stored in secure httpOnly cookies for route protection
- The client also mirrors auth state in Zustand for request interceptors and UI state

## Structure

- `app/(auth)` contains the login experience
- `app/(dashboard)` contains all protected admin pages
- `components/` contains layout, table, form, chart, and feature-level UI
- `hooks/` contains TanStack Query hooks for all backend resources
- `lib/` contains Axios, query client config, utilities, and app constants
- `store/` contains Zustand stores for auth and UI shell state
- `types/` contains shared API and domain types
- `validations/` contains Zod schemas for forms

## Backend Expectations

The dashboard is built to consume the ThreadsApp backend routes under `/api/v1/admin` plus `/api/v1/auth/*`. Make sure the backend supports:

- Admin login through `/auth/login`
- JWT refresh through `/auth/refresh-token`
- Dashboard stats and analytics endpoints
- Admin product, inventory, category, brand, order, return, coupon, review, banner, user, and notification routes

## Notes

- Product and banner image flows currently accept URL-based assets and local preview objects. If you want direct Cloudinary upload from the admin app, extend the upload components with signed upload support.
- Middleware protection lives in both `app/middleware.ts` and root `middleware.ts` so Next.js can enforce route protection correctly while preserving the requested structure.
