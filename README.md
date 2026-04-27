# AlumniConnect Institute Network

Verified institute-based alumni-student networking platform built with the MERN stack.

## Structure

- `client` - React + Vite frontend with Tailwind CSS and React Router.
- `server` - Node.js + Express.js API with MongoDB connection setup.

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

3. Update `server/.env` with a valid `MONGO_URI` and strong `JWT_SECRET`.

4. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

## Current MVP Modules

- JWT authentication for all platform roles
- Frontend login flow with protected role-based routes
- Public institute registration request form
- Super admin institute approval and rejection workflow
- Institute admin student and alumni user management with institute-scoped access control
- Student profile create, view, and update flow
- Alumni profile create, view, and update flow with verification status tracking
- Institute admin alumni profile verification and rejection workflow
- Student-only verified alumni search and detail views scoped to the same institute
- Student-to-alumni connection requests with student tracking and alumni accept/reject actions
- Student-to-alumni guidance and referral requests with alumni response and completion workflow
- Alumni-posted opportunities with institute-admin approval and student visibility for approved listings
- Institute-admin announcements and events with audience-scoped visibility for students and alumni
- Automated database-backed notifications for connections, guidance, opportunities, announcements, events, and alumni verification actions
