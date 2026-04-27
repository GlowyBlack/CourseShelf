# CourseShelf

CourseShelf is a full-stack app for managing courses and course materials. The backend is an Express + TypeScript API with Prisma/SQLite, and the frontend is React + Vite + Tailwind.

## Setup Instructions

### 1) Prerequisites

- Node.js 20+ (recommended)
- npm 10+

### 2) Clone and install dependencies

```bash
git clone https://github.com/GlowyBlack/CourseShelf
cd CourseShelf
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### 3) Configure environment variables

Backend:

- Create `backend/.env` (if missing) with:

```env
PORT=3000
DATABASE_URL="file:./database.sqlite"
```

Frontend:

- Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4) Prepare database

From `backend/`:

```bash
npx prisma generate
npx prisma db push
```

### 5) Run the app

Backend (terminal 1):

```bash
cd backend
npm run dev
```

Frontend (terminal 2):

```bash
cd frontend
npm run dev
```

### 6) Run tests

Backend tests (Vitest):

```bash
cd backend
npm test
```

Frontend E2E tests (Playwright):

```bash
cd frontend
npm run test:e2e
```

## Approach

I created the application using a layered backend structure (`routes -> controllers -> repositories`) to keep HTTP concerns separate from data access. On the frontend, I split navigation into route-based pages (`/` for course dashboard and `/courses/:courseId` for course details) and used reusable modal components for create/edit flows. I prioritized explicit validation, clear API error handling, and testability (unit + integration + E2E coverage).

## System Architecture

- **Frontend (React + Vite + Tailwind)**
  - `CoursesPage`: list/create courses
  - `CourseDetailsPage`: list/create/edit/delete materials for a selected course
  - Router: `react-router-dom` with page-level logic and API calls
- **Backend (Express + TypeScript)**
  - `app.ts`: app composition (middleware + routes)
  - `index.ts`: process startup + DB connect + server listen
  - Route/controller/repository separation for maintainable request flow
- **Data layer (Prisma + SQLite)**
  - `Course` (one-to-many) `Material`
  - Prisma client generated into backend source tree
- **Testing**
  - Backend: Vitest unit/integration tests
  - Frontend: Playwright E2E instructor flows

