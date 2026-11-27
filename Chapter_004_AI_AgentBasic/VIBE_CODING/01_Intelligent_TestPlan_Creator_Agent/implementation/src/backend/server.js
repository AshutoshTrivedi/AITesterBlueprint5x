import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, "../../../../../../.env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const issueKeyPattern = /^[A-Z][A-Z0-9_]*-[0-9]+$/i;
const missing = "Insufficient information to determine.";

function jiraFields(issue) {
  const fields = issue?.fields || {};
  const description = fields.description;
  const extractText = (value) => {
    if (!value) return missing;
    if (typeof value === "string") return value;
    if (value.content) return value.content.map((node) => extractText(node)).join("\n");
    if (value.text) return value.text;
    return missing;
  };
  return {
    key: issue.key,
    title: fields.summary || missing,
    description: extractText(description),
    issueType: fields.issuetype?.name || missing,
    status: fields.status?.name || missing,
    acceptanceCriteria: fields.customfield_acceptance_criteria
      ? extractText(fields.customfield_acceptance_criteria)
      : missing
  };
}

app.get("/api/config/status", (_request, response) => {
  response.json({
    jira: Boolean(process.env.JIRA_BASE_URL && process.env.JIRA_EMAIL && process.env.JIRA_TOKEN),
    groq: Boolean(process.env.GROQ_API_KEY)
  });
});

app.post("/api/test-plan", async (request, response) => {
  const issueId = String(request.body.issueId || "").trim().toUpperCase();
  if (!issueKeyPattern.test(issueId)) {
    response.status(400).json({ error: "Enter a valid Jira issue ID, for example QA-123." });
    return;
  }
  if (!process.env.JIRA_BASE_URL || !process.env.JIRA_EMAIL || !process.env.JIRA_TOKEN) {
    response.status(503).json({ error: "Jira configuration is missing." });
    return;
  }

  try {
    const baseUrl = process.env.JIRA_BASE_URL.replace(/\/$/, "");
    const authorization = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`).toString("base64");
    const jiraResponse = await fetch(
      `${baseUrl}/rest/api/3/issue/${encodeURIComponent(issueId)}?fields=summary,description,status,issuetype,customfield_acceptance_criteria`,
      { headers: { Authorization: `Basic ${authorization}`, Accept: "application/json" } }
    );
    if (!jiraResponse.ok) {
      const message = jiraResponse.status === 404
        ? "Jira issue was not found."
        : jiraResponse.status === 401 || jiraResponse.status === 403
          ? "Jira authentication or permission failed."
          : `Jira returned HTTP ${jiraResponse.status}.`;
      response.status(jiraResponse.status).json({ error: message });
      return;
    }

    const issue = jiraFields(await jiraResponse.json());
    let plan = `${buildTemplate(issue)}\n\nSource: ${baseUrl}/browse/${issue.key}`;

    if (process.env.GROQ_API_KEY) {
      try {
        const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            temperature: 0,
            messages: [
              { role: "system", content: "Create a test plan using only the supplied Jira data. Use the exact template structure and put proposals under Test Scenarios. Use the exact phrase Insufficient information to determine for unknown facts." },
              { role: "user", content: JSON.stringify(issue) }
            ]
          })
        });
        if (aiResponse.ok) {
          const ai = await aiResponse.json();
          if (ai.choices?.[0]?.message?.content) plan = ai.choices[0].message.content;
        }
      } catch {
        plan = `${buildTemplate(issue)}\n\nSource: ${baseUrl}/browse/${issue.key}\n\nAI generation unavailable; deterministic template used.`;
      }
    }

    response.json({ issue, plan });
  } catch {
    response.status(502).json({ error: "Unable to reach Jira or Groq." });
  }
});

app.post("/api/settings/test-jira", async (request, response) => {
  const baseUrl = String(request.body.baseUrl || process.env.JIRA_BASE_URL || "").replace(/\/$/, "");
  const email = String(request.body.email || process.env.JIRA_EMAIL || "");
  const token = String(request.body.token || process.env.JIRA_TOKEN || "");
  if (!baseUrl || !email || !token) {
    response.status(400).json({ error: "Jira configuration is incomplete." });
    return;
  }
  try {
    const result = await fetch(`${baseUrl}/rest/api/3/myself`, {
      headers: { Authorization: `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`, Accept: "application/json" }
    });
    response.status(result.ok ? 200 : result.status).json({ ok: result.ok });
  } catch {
    response.status(502).json({ error: "Unable to reach Jira.", ok: false });
  }
});

function buildTemplate(issue) {
  return `# Test Plan — ${issue.key}: ${issue.title}

> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.

## 1. Scope & Objectives
- **In scope:** ${issue.description}
- **Out of scope:** ${missing}
- **Objective:** ${missing}

## 2. Gaps & Questions for the author
| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 | Acceptance criteria | ${issue.acceptanceCriteria} | Please confirm the acceptance criteria. |

## 3. Test Scenarios
| ID | Priority | Type (pos/neg/boundary) | Scenario | Maps to (AC / gap) |
|----|----------|-------------------------|----------|--------------------|
| TS-1 | P0 | proposed | Verify the documented Jira requirement: ${issue.description} | ${issue.acceptanceCriteria} |

## 4. Test Data & Environment
- **Data:** ${missing}
- **Environment / flags:** ${missing}
- **Roles / permissions:** ${missing}

## 5. Risks & Assumptions
- **Assumptions made:** ${missing}
- **Risks:** ${missing}

## 6. Entry / Exit criteria
- **Entry:** ${missing}
- **Exit:** ${missing}

## 7. Resource Allocation
${missing}

## 8. Timelines, Sprint Details
${missing}

---
## HUMAN REVIEW GATE
- **I assumed:** ${missing}
- **I could not confirm:** ${missing}
- **Open questions blocking sign-off:** Please confirm environment, data, roles, entry/exit criteria, and resources.
- **Approve, or edit, before I write test cases / automation.**`;
}

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
