# Draftzi Demo

This is a full-stack Next.js + TypeScript frontend with Node.js/Express + PostgreSQL backend.

## Quick start (macOS / zsh):

### Option 1: Run both servers separately

```bash
cd ~/Desktop/draftzi-demo

# Terminal 1: Start backend (Express + PostgreSQL)
cd backend && npm start

# Terminal 2: Start frontend (Next.js)
PORT=3001 npm run dev
```

### Option 2: Install concurrently and run both together

```bash
cd ~/Desktop/draftzi-demo
npm install concurrently --save-dev
npm run dev:both
```

## Access the application:

- **Frontend**: http://localhost:3001 (Next.js with React)
- **Backend API**: http://localhost:3000 (Express with PostgreSQL)
- **Health Check**: http://localhost:3000/api/health

## Authentication:

- Backend uses JWT tokens and bcrypt for password hashing
- PostgreSQL database (Neon) for user storage
- Frontend stores JWT in localStorage and sends with requests
- Real production-ready authentication system

Notes:
- Tailwind is included via `styles/globals.css` and `tailwind.config.js`.
- If you see TypeScript errors about missing types, run `npm i -D @types/react @types/node`.
- If you prefer a different port: `PORT=3001 npm run dev`.

Demo auth API
-----------

This project includes very small demo authentication routes that persist users to `data/users.json`:

- `POST /api/auth/signup` — create a new user (email + password)
- `POST /api/auth/login` — checks credentials and returns a demo token

Security & production notes
--------------------------

- The demo stores plain-text passwords in `data/users.json`. This is only for a local demo — do NOT use this approach in production.
- Replace file-based storage with a proper database and hash passwords (bcrypt) before deploying.
- Do not commit `data/users.json` — it's ignored by `.gitignore`.

Deploying
---------

You can deploy this Next.js app to Vercel easily. Basic steps:

1. Create a Git repository and push this folder (the `.gitignore` will exclude local data):

```bash
cd ~/Desktop/draftzi-demo
git init
git add .
git commit -m "Initial demo"
```

2. Connect the repo to Vercel and select the project — Vercel will detect Next.js and set the build command automatically.

Local notes
-----------

- To reset demo users: delete or edit `data/users.json`.
- For any API errors, check the server output in the terminal running `npm run dev`.

