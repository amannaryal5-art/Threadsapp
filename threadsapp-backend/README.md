# ThreadsApp Backend

ThreadsApp backend for a fashion ecommerce app built with Node.js, Express, Razorpay, Cloudinary, Firebase, Shiprocket, Nodemailer, Twilio, Joi, and Winston.

Important: this repo is mid-migration:

- App startup, health checks, and migrations now read PostgreSQL config.
- Much of the route/controller/model layer still uses Mongoose-shaped models, so this codebase is not yet a full native Sequelize/Postgres port.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` from `.env.example` and fill in your service credentials.

3. If you want the Postgres schema locally, run migrations and seed data:
```bash
npm run migrate
npm run seed
```

Use local Postgres settings such as:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=threads
```

This seeds two auth accounts for local development:

- Admin UI login: `admin@threadsapp.in` / `Admin123`
- Customer UI login: `shopper@threadsapp.in` / `Admin123`

4. Start the server:
```bash
npm run dev
```

The API base URL is `http://localhost:5000/api/v1`.

## Scripts

- `npm start` starts the production server
- `npm run dev` starts the dev server with nodemon
- `npm run start:local` starts the backend with your local `.env`
- `npm run migrate` runs Sequelize migrations
- `npm run migrate:undo` rolls back all migrations
- `npm run seed` loads sample catalog, coupons, and banners
- `npm run lint` runs ESLint
- `npm test` runs the Node test runner

## Environment

See [.env.example](./.env.example) for the full variable list:

- App: `PORT`, `NODE_ENV`, `FRONTEND_URL`, `PLATFORM_NAME`
- Database: `DATABASE_URL` or `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Auth: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- Media and files: `CLOUDINARY_*`
- Payments: `RAZORPAY_*`
- OTP and messaging: `TWILIO_*`, `FIREBASE_*`
- Shipping: `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`
- Email: `EMAIL_USER`, `EMAIL_PASS`

## API Overview

- `GET /api/v1/health`
- `POST /api/v1/auth/*`
- `GET|PUT|DELETE /api/v1/users/*`
- `GET|POST|PUT|DELETE /api/v1/addresses/*`
- `GET /api/v1/categories/*`
- `GET /api/v1/brands/*`
- `GET /api/v1/products/*`
- `GET|POST|PUT|DELETE /api/v1/cart/*`
- `GET|POST /api/v1/wishlist/*`
- `POST|GET /api/v1/orders/*`
- `POST /api/v1/payments/*`
- `POST|DELETE /api/v1/coupons/*`
- `POST|PUT|DELETE /api/v1/reviews/*`
- `GET /api/v1/search/*`
- `GET /api/v1/banners`
- `GET /api/v1/returns/*`
- `GET|POST|PUT|DELETE /api/v1/admin/*`

## Notes

- Customer signup requires `name`, `phone`, `password`, and optionally `email` plus `gender`.
- Login accepts either `email` + `password` or `phone` + `otp`.
- The admin UI does not support signup. It requires an existing user with `role = 'admin'`.
- In local development, OTP delivery can fall back to backend-terminal logging if SMTP is unavailable.
- Postgres full-text search objects are present in the migration files, but several services still use Mongo-style query operators and model helpers today.
- Product detail, category tree, banners, trending searches, OTP storage, and inventory locks use the built-in in-memory runtime store.
- The included Postman collection is at [threadsapp.postman_collection.json](./threadsapp.postman_collection.json).
