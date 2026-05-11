# ThreadsApp Web

Customer-facing ecommerce storefront for ThreadsApp, built with Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Zustand, React Query, Axios, Zod, and Razorpay.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Start development:

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run type-check`

## Environment Variables

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`

For Vercel deployments, `NEXT_PUBLIC_API_URL` must point to your deployed backend API origin, for example:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

## Notes

- API requests are routed through `lib/axios.ts` with token refresh handling.
- Query caching is configured in `lib/queryClient.ts`.
- PWA manifest is available at `public/manifest.json`.
- Auth-protected routes are guarded by `middleware.ts`.
