# Nexus HR

**Intelligent Workforce Platform** — A world-class enterprise HRMS that competes with BambooHR, Rippling, Workday, and Zoho People.

Built for 2026: AI-native, multi-tenant, premium UX, production-ready.

---

## Features

| Module | Capabilities |
|--------|-------------|
| **Dashboard** | KPIs, AI insights, attendance heatmap, birthdays, approvals, announcements |
| **Employees** | Directory, 360° profiles, timeline, skills, salary, documents |
| **Organization** | Departments, branches, job titles, org chart |
| **Attendance** | Daily tracking, geo/QR/face-ready, shifts, overtime |
| **Leave** | Types, balances, approvals, holiday calendar |
| **Payroll** | Salary structures, processing, payslips, tax |
| **Recruitment** | Job postings, candidates, hiring pipeline, interviews |
| **Performance** | Goals, OKRs, KPIs, 360 reviews |
| **Training** | Courses, learning paths, certificates |
| **Documents** | Contracts, visas, expiry reminders |
| **Assets** | Laptops, phones, assignment tracking |
| **Helpdesk** | HR/IT tickets with priority |
| **Projects** | Tasks, timesheets, assignments |
| **Analytics** | Headcount, attrition, gender, leave trends |
| **AI Assistant** | Natural language HR queries |
| **Workflows** | Drag-and-drop approval flows |
| **Search** | Universal command palette (⌘K) |

---

## Tech Stack

**Frontend:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Shadcn UI · Framer Motion · TanStack Query · Recharts · Zod

**Backend:** NestJS · Prisma · PostgreSQL · Redis · BullMQ · JWT · WebSockets

**Infra:** Docker · Kubernetes-ready · AWS S3

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL & Redis)
- npm 10+

### 1. Clone & Install

```bash
cd products
cp .env.example .env
npm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d postgres redis
```

### 3. Setup Database

```bash
cd apps/api
npx prisma db push
npx ts-node prisma/seed.ts
cd ../..
```

### 4. Run Development Servers

```bash
# From root — starts both API ( :4000 ) and Web ( :3000 )
npm run dev
```

Or separately:

```bash
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:3000
```

### 5. Login

| Field | Value |
|-------|-------|
| Email | `admin@acme.tech` |
| Password | `Demo@1234` |

API docs: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## Project Structure

```
products/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── prisma/          # Schema + seed
│   │   └── src/
│   │       ├── auth/        # JWT, sessions, OAuth-ready
│   │       ├── employees/
│   │       ├── attendance/
│   │       ├── leave/
│   │       ├── payroll/
│   │       ├── recruitment/
│   │       ├── dashboard/
│   │       ├── search/      # Universal search
│   │       ├── ai/          # AI HR Assistant
│   │       └── ...
│   └── web/                 # Next.js frontend
│       └── src/
│           ├── app/         # App Router pages
│           ├── components/  # UI + layout
│           └── lib/         # API client, stores
├── docs/                    # UX research, IA, design system
├── docker-compose.yml
└── package.json             # Monorepo workspaces
```

---

## Multi-Tenancy

Every company is fully isolated. All queries are scoped by `companyId` from the JWT. Unlimited companies, each with their own employees, departments, payroll, and settings.

---

## Design System

Inspired by Linear, Stripe, Vercel, and Notion:

- Indigo/Violet primary palette
- Glassmorphism cards
- Soft shadows & rounded corners
- Dark & Light mode
- Inter typography
- Framer Motion animations
- WCAG-conscious contrast

See `docs/DESIGN_SYSTEM.md` for full tokens.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Command palette / global search |
| `⌘J` / `Ctrl+J` | Open AI Assistant |

---

## Environment Variables

See `.env.example` for the full list. Key variables:

```
DATABASE_URL=postgresql://nexus:nexus_secret@localhost:5432/nexus_hr
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Production Deployment

```bash
docker-compose up -d --build
```

Kubernetes manifests can be layered on top of the Docker images. The API is horizontally scalable; Redis backs sessions and job queues.

---

## License

Proprietary — All rights reserved.
