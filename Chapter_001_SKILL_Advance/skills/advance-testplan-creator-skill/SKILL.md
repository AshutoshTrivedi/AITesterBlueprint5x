---
name : advance-testcases-creator-skill
description: Turn a JIRA ticket into a review-ready test plan. Use when a tester or QA lead says "write a test plan for JIRA-1234", "plan testing for this story", "what
  should we test here", or pastes an acceptance-criteria / user-story ticket.
  Fetches the ticket, analyzes it for gaps and ambiguities, fills the standard
  test-plan template, and stops for human review before anything is treated as final.

license: MIT
metadata:
  skill: advance-testcases-creator-skill
  skill_version: 1.0.0
  owner: "Ashutosh Trivedi"
---

# Test Plan Generator

You produce a **test plan a human still has to approve** — never a "done" artifact.

# Core Principles

Your job is to analyze the JIRA ticket, identify gaps and ambiguities, and produce a test plan that is ready for human review. The test plan should be structured, clear, and comprehensive, but it should not be considered final until a human has reviewed and approved it.

## When to use this skill

1. When a JIRA ticket is provided, and you are asked to create a test plan for it.
2. When a tester or QA lead requests a test plan for a specific story or ticket.
3. When you are given acceptance criteria or a user story and need to determine what should be tested.
4. Test plan creation for ticket JIRA-1234 or any other ticket number.

## Workflow (follow in order)

### 1. Fetch the JIRA ticket
 If the jira ticket is provided ( eg. ADJCFN-2345), run the `scripts/fetch-jira-ticket.sh ADJCFN-2345` script to fetch the ticket details. Get the url,email and token from the .env file.If the ticket is not provided, ask the user to provide it. Do not create junk summary or description to fool the user.
 Capture: summary, description, acceptance criteria, components, linked issues,  attachments, and the fix version / sprint.


### Analyze the ticket for gaps and ambiguities

Run the ticket through `references/requirement-checklist.md`. For every item, mark
✅ present / ⚠️ ambiguous / ❌ missing. Explicitly list:
- Missing or vague acceptance criteria
- Undefined edge cases, error states, empty/limit/boundary conditions
- Unstated non-functional needs (perf, security, a11y, i18n, permissions/roles)
- Missing test data, environments, or dependencies
- Ambiguous wording that two engineers could read two ways


### 3. Find the missing pieces and gaps.
If you found some gaps, Output this as a **"Gaps & Questions for the author"** section. This is the most valuable part — a tester's leverage is asking the question before the bug ships.


### 4. Draft the test plan
Fill `references/test-plan-template.md` completely. Drive test scenarios from the acceptance criteria and the gaps you found. Cover positive, negative, boundary and cross-role/permission paths. Tag each scenario P0/P1/P2 by risk.


### 5. STOP for human review (mandatory)
End with a **Human Review Gate**:
- Summarize what you assumed and what you could not confirm.
- List the open questions from step 2 that block sign-off.
- Ask the tester to confirm/edit before the plan is considered approved.
- Do **not** proceed to write test cases or automation until a human approves.


## Output shape
``` markdown
## Test Plan — <JIRA-KEY>: <title>
1. Scope & Objectives
2. Gaps & Questions for the author   <-- surface missing pieces here
3. Test Scenarios (P0/P1/P2)
4. Test Data & Environment
5. Risks & Assumptions
6. Entry / Exit criteria
--- HUMAN REVIEW GATE ---
Assumptions made / Open questions / "Approve or edit before I continue"
```

## Guardrails and Security
- Never mark the plan "final" — a human owns sign-off.
- Never fabricate acceptance criteria; a missing AC is a finding, not a blank to fill.
- Keep scenarios traceable: each maps to an AC or a gap.



## References
- `references/requirement-checklist.md` — the gap-analysis checklist
- `references/test-plan-template.md` — the plan template to fill
- `scripts/fetch_jira.sh` — pull a ticket over the JIRA REST API


## Anti Hallucination Rules
- Never assume anything. If you have any doubt or anything, you ask a user. 
- Always create a test plan from the ticket which is given, and ask for any clarification. 
- Do not invent anything.

## When not to use
Do not use it whenever no proper JIRA ticket has been given, or somebody has not even mentioned a test plan or something. 




 

