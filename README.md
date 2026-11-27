# AITesterBlueprint5X

Hands-on learning material and examples for AI-assisted software testing, QA planning, prompt design, and workflow automation.

## Repository contents

| Folder | Contents |
|---|---|
| `Chapter_00_SKILL_Basics/` | Introductory skills for creating test cases and test plans. |
| `Chapter_001_SKILL_Advance/` | Advanced test-case and test-plan skills, references, and checklists. |
| `Chapter_002_PROMPT_ENG/` | RICE-POT prompt engineering material and a Java Selenium/TestNG example. |
| `Chapter_004_AI_AgentBasic/` | AI test-plan creator planning, design, and React/Express implementation. |
| `Chapter_005_AI_Agent_n8n/` | n8n Jira AI-agent workflow export and related assets. |
| `output/` | Example test plans and test cases in Markdown, PDF, and CSV formats. |

## AI test-plan creator

The application in `Chapter_004_AI_AgentBasic/VIBE_CODING/01_Intelligent_TestPlan_Creator_Agent/implementation/` provides a React UI and Express API. It reads a Jira issue, creates a draft using the supplied test-plan template, and optionally uses Groq when configured.

### Requirements

- Node.js 20 or newer and npm
- Jira Cloud URL, email, and API token
- Optional Groq API key for AI-generated content

### Configuration

Create a **local, untracked** `.env` file in the repository root:

```text
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=you@example.com
JIRA_TOKEN=your-jira-api-token
GROQ_API_KEY=your-groq-api-key
PORT=3001
```

Replace the example values locally; `GROQ_API_KEY` and `PORT` are optional. Jira and Groq credentials are read by the backend only; never commit `.env` or paste secrets into source files. `.env` is ignored by Git.

### Run locally

From the implementation directory:

```powershell
cd Chapter_004_AI_AgentBasic/VIBE_CODING/01_Intelligent_TestPlan_Creator_Agent/implementation
npm install
npm run install:all
npm run dev
```

Open `http://localhost:5173`. The Vite frontend proxies `/api` requests to the Express backend on port `3001` (or the configured `PORT`).

### Workflow

1. Enter a Jira issue key, for example `QA-123`.
2. The backend retrieves the issue through Jira's read-only API.
3. The app builds a draft that follows `01_Plan/TestPlan_Template.md`.
4. Review the plan before using it; generated content is not an approved test plan.

## Selenium example

`Chapter_002_PROMPT_ENG/Template_RICE-POT/` contains a Maven Selenium Java project with PageFactory, TestNG valid/invalid login tests, and Allure integration.

```powershell
cd Chapter_002_PROMPT_ENG/Template_RICE-POT
mvn test
```

Live Salesforce tests are opt-in and require `SALESFORCE_USERNAME`, `SALESFORCE_PASSWORD`, `SALESFORCE_INVALID_USERNAME`, and `SALESFORCE_INVALID_PASSWORD` in the process environment:

```powershell
mvn '-Dsalesforce.liveTests=true' '-Dselenium.headless=false' test
```

Headed mode is the project default; set `-Dselenium.headless=true` to run headlessly. Use test accounts you control.

## n8n workflow

Import `Chapter_005_AI_Agent_n8n/00_JIRA_AIAgent.json` into n8n, then configure Jira Software Cloud and Groq credentials in n8n. The exported workflow references n8n credential entries; configure credentials in your own n8n instance rather than embedding secrets in the export.

## Generated examples and safety

The `output/` directory contains sample QA deliverables. Examples are learning artifacts and should not be treated as verified requirements for another product. Review generated plans and test cases before execution.

Build output, local dependencies, Allure reports, and environment files are excluded through `.gitignore`.
