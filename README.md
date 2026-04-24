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
