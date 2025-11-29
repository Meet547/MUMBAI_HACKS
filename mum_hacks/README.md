# Draftzi - MumbaiHacks Submission

## Project Structure

### Frontend (/mum_hacks/frontend)
- Next.js 14 with TypeScript
- Tailwind CSS
- Pages: Landing, Login, Signup, Chat
- Port: 3001

### Backend (/mum_hacks/backend)
- Express.js server
- PostgreSQL (Neon cloud)
- JWT authentication
- Port: 3000

### LLM (/mum_hacks/llm)
- Google Cloud Vertex AI
- Model: text-bison@001
- Credentials: gcp-credentials.json

## Setup Instructions

### Backend Setup:
```bash
cd mum_hacks/backend
npm install
# Add .env file with DATABASE_URL and JWT_SECRET
node index.js
```

### Frontend Setup:
```bash
cd mum_hacks/frontend
npm install
PORT=3001 npm run dev
```

## Environment Variables Required

Backend (.env):
- DATABASE_URL=your_postgres_connection_string
- JWT_SECRET=your_secret_key
- PORT=3000

