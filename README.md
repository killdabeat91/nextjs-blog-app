# Full Stack Open - Next.js

Exercises 1-24 for the Next.js section of Full Stack Open.

## Getting Started

1. Install packages:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your `DATABASE_URL` (Neon PostgreSQL) and `AUTH_SECRET`.

3. Push schema to database:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Running tests

Run playwright e2e tests:
```bash
npm run test:e2e
```
