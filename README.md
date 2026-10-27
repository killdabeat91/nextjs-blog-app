# Full Stack Open - Next.js Blog App

A blog application built with Next.js App Router, TypeScript, Tailwind CSS, NextAuth.js, and Drizzle ORM on PostgreSQL (Neon).

## Requirements

- Node.js 20+
- PostgreSQL database (Neon or local)

## Environment Variables

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL`: Connection string to PostgreSQL
- `AUTH_SECRET`: Random 32-byte secret string
- `AUTH_URL`: Canonical URL (e.g. `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Alias for `AUTH_SECRET`
- `NEXTAUTH_URL`: Alias for `AUTH_URL`

## Database Migrations

Generate migration files from schema:
```bash
npm run db:generate
```

Apply migrations to database:
```bash
npm run db:migrate
```

Or push schema directly:
```bash
npm run db:push
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm run start
```

## Running Tests

End-to-end tests with Playwright:
```bash
npm run test:e2e
```
