# Jira Test Plan Generator

## Prerequisites
- Node.js 20 or newer
- Jira base URL, email, API token
- Optional Groq API key

The backend reads the workspace root `.env`:

```text
JIRA_BASE_URL=...
JIRA_EMAIL=...
JIRA_TOKEN=...
GROQ_API_KEY=...
PORT=3001
```

## Run

```powershell
cd implementation
npm install
npm run install:all
npm run dev
```

Open `http://localhost:5173`.
