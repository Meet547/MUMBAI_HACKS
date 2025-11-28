# Draftzi Demo

This is a minimal Next.js + TypeScript scaffold created to run `mumbai_hacs-2.tsx` locally as the homepage.

Quick start (macOS / zsh):

```bash
cd ~/Desktop/draftzi-demo
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

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

