# Test Plan — VWO-49: Assumed VWO Login and Dashboard Access

> **Status: DRAFT — pending human review.** VWO-49's ticket text was not available. This plan assumes the ticket concerns the VWO login/dashboard flow, based only on the existing VWO login materials in this workspace. The assumed scope and requirements below are not confirmed acceptance criteria.

## 1. Scope & Objectives
- **In scope (assumed):** Login with email and password; input validation and authentication errors; successful transition to the authenticated dashboard; password recovery; session persistence and expiry; baseline responsive and keyboard usability.
- **Out of scope unless VWO-49 confirms otherwise:** Changes to dashboard functionality after login; SSO, 2FA, theme selection, registration, analytics, and any new feature not described in the available materials.
- **Objective:** Validate the assumed critical login and dashboard-entry journey, including invalid-input handling and session boundaries, while recording unresolved requirements for author confirmation.

### Working requirement assumptions (not ticket-confirmed)
- **A1:** An active user can log in with valid credentials and reach the authenticated destination.
- **A2:** Missing, malformed, or invalid credentials do not authenticate; users receive usable feedback without sensitive account details.
- **A3:** A user can request password recovery through the supported flow.
- **A4:** Authenticated access is governed by session persistence and expiry rules.
- **A5:** The login flow remains usable on supported viewport sizes and with keyboard navigation.
- **A6:** Authentication traffic and session handling meet the product's security expectations.

## 2. Gaps & Questions for the author

### Requirement checklist review
| Checklist area | Status | Finding |
|---|---|---|
| User story / goal | ⚠️ | Inferred as login and dashboard access; VWO-49 story is unavailable. |
| Testable acceptance criteria | ❌ | No ticket acceptance criteria were available. |
| Happy path | ⚠️ | Inferred from existing workspace materials; destination and success signals need confirmation. |
| Negative / error paths | ⚠️ | Invalid credentials and malformed input are assumed; exact expected responses are unspecified. |
| Boundary / empty states | ⚠️ | Empty inputs are covered by assumption; length limits, whitespace, and other boundaries are undefined. |
| State transitions | ⚠️ | Login and session transitions are inferred; exact states and timeout policy are unspecified. |
| Test data | ⚠️ | Active, inactive, invalid, and recovery accounts are needed; no approved accounts or fixtures were supplied. |
| Environment / configuration | ❌ | Target environment, feature flags, and configuration are unknown. |
| Dependencies / integrations | ❌ | Identity provider, email delivery, and other dependencies are not identified. |
| Preconditions / setup | ❌ | Required account states and test setup are not specified. |
| Performance expectations | ❌ | No ticket-confirmed response-time or load targets. |
| Security / authorization | ⚠️ | Basic authentication and session checks are assumed; role matrix and security criteria are absent. |
| Accessibility | ⚠️ | Keyboard usability is assumed; required standard and assistive-technology coverage are unknown. |
| Localization | ❌ | Supported locales and expected localized behavior are unknown. |
| Audit / observability | ❌ | Logging and audit expectations are unknown. |
| Regression impact | ⚠️ | Existing login behavior is the assumed regression surface; affected components are unknown. |
| Backward compatibility / migration | ❌ | Not applicable or required has not been established. |
| Browser / responsive matrix | ⚠️ | Responsive usability is assumed; supported browsers, devices, and viewport sizes are unknown. |
| Rollback / feature flag | ❌ | No rollout, flag, or rollback requirements were provided. |
| Wording / terminology | ❌ | No ticket wording was available to assess. |
| Designs / mockups | ❌ | No design or prototype link was available. |

### Gaps & Questions for the author
| # | Area | Finding | Question to author |
|---|---|---|---|
| 1 | Ticket scope | VWO-49 details are unavailable; login/dashboard scope is inferred from existing workspace documents. | Does VWO-49 actually concern login and dashboard access? Please confirm the story and affected functionality. |
| 2 | Acceptance criteria | No explicit pass/fail criteria are available. | What are the exact acceptance criteria and expected success/error states? |
| 3 | Authentication | Credential rules and account states are unspecified. | Which account states, input constraints, and error-message behaviors must be supported? |
| 4 | Recovery | The password-recovery flow is not defined by the ticket. | Is recovery in scope, and what are the expected steps and confirmation behavior? |
| 5 | Session / permissions | Timeout, persistence, logout, and role expectations are unknown. | What are the session rules and user roles/permissions relevant to this change? |
| 6 | Quality requirements | Browser, accessibility, performance, localization, and security targets are absent. | Which quality standards, supported clients, and measurable targets apply? |
| 7 | Execution readiness | Environment, test data, dependencies, and sprint dates are unavailable. | Which test environment, accounts, integrations, and target sprint/release should QA use? |

## 3. Test Scenarios

| ID | Priority | Type | Scenario | Maps to |
|---|---|---|---|---|
| TS-01 | P0 | Positive | Submit valid credentials for an active account and verify successful authentication and the expected authenticated destination. | A1 |
| TS-02 | P0 | Negative | Submit a valid account identifier with an incorrect password; verify access is denied and feedback does not reveal sensitive account details. | A2, A6 |
| TS-03 | P0 | Negative / boundary | Submit with both fields empty, then with only one field empty; verify submission is blocked or rejected with clear field feedback. | A2; confirm exact behavior |
| TS-04 | P1 | Negative / boundary | Enter malformed email values, leading/trailing whitespace, and values at the documented length boundaries; verify validation matches confirmed rules. | A2; input limits need confirmation |
| TS-05 | P1 | Negative | Attempt authentication for an inactive, locked, or otherwise unavailable account if those states exist; verify the specified safe outcome. | A2; account states need confirmation |
| TS-06 | P0 | Positive | Start password recovery for a valid test account and verify the configured confirmation and next step. | A3 |
| TS-07 | P1 | Negative | Submit malformed or unregistered addresses in password recovery; verify safe, consistent handling and no unintended account disclosure. | A3, A6 |
| TS-08 | P0 | Positive / boundary | Authenticate, continue using the session, and then access the application after the configured expiry boundary; verify persistence and expiry behavior. | A4; timeout policy needs confirmation |
| TS-09 | P0 | Negative | After logout or session expiry, revisit an authenticated destination; verify reauthentication is required and protected content is not shown. | A4, A6 |
| TS-10 | P1 | Negative | In the approved test environment, perform repeated failed sign-in attempts within the agreed limit; verify the defined protective response and recovery path. | A6; limits and lockout policy need confirmation |
| TS-11 | P1 | Positive | Complete the login flow at agreed desktop and mobile viewport sizes; verify controls remain visible, readable, and operable. | A5; device matrix needs confirmation |
| TS-12 | P1 | Positive / accessibility | Complete the login flow using keyboard-only navigation; verify logical focus order, visible focus, and operable controls. | A5; accessibility standard needs confirmation |
| TS-13 | P1 | Regression | Verify the existing login-to-dashboard journey and password visibility/toggle or other existing controls (if present) remain functional after the change. | A1–A5; regression scope to confirm |

## 4. Test Data & Environment
- **Data:** Approved QA accounts for active and, if supported, inactive/locked states; valid and invalid credential pairs; malformed and boundary-length identifiers; recovery addresses with access to the test mail flow. Use synthetic or approved test data only.
- **Environment / flags:** A non-production VWO environment with the VWO-49 build deployed. Confirm relevant feature flags, identity/recovery integrations, and safe rate-limit configuration before execution.
- **Roles / permissions:** At minimum, an ordinary authenticated test account. Add role-specific accounts only if the ticket confirms role-based behavior.
- **Client matrix:** To be agreed with the ticket owner; include representative desktop and mobile browsers if responsive behavior is in scope.

## 5. Risks & Assumptions
- **Assumptions made:** VWO-49 is treated as a login/dashboard-access change because the workspace contains existing VWO login plan and test-case documents. A1–A6 are planning assumptions, not claims about the Jira ticket. Existing workspace references to a two-second load target, SSO, and 2FA are not treated as VWO-49 requirements.
- **Risks:** The actual ticket may concern a different feature; using this draft without confirming scope could miss required coverage. Missing expected outcomes, test environment, and policy thresholds prevent execution-ready pass/fail criteria.

## 6. Entry / Exit criteria
- **Entry:**
  - Ticket scope and acceptance criteria are confirmed by the author.
  - QA build/environment and required flags are available.
  - Approved test accounts and recovery integration are ready.
  - Expected session, validation, and protection policies are documented.
- **Exit:**
  - All confirmed P0 and P1 scenarios are executed with results recorded.
  - No unresolved critical defects affect confirmed acceptance criteria.
  - Deviations, blocked scenarios, and residual risks are reported.
  - QA owner and product/ticket owner review the results and approve disposition.

## 7. Resource Allocation
- **QA:** One tester for scenario refinement, execution, and defect reporting; add accessibility or security specialists if the ticket owner confirms those requirements.
- **Dependencies:** Product/ticket owner for requirement clarification; environment owner for test setup and account provisioning.

## 8. Timelines, Sprint Details
- **Sprint / release:** Not available; confirm with the ticket owner.
- **Estimate:** Schedule after scope, environment, test data, and acceptance criteria are confirmed. No dates are assumed in this draft.

---
## HUMAN REVIEW GATE
- **I assumed:** VWO-49 is about the VWO login and dashboard-entry flow, based on the existing workspace materials. The assumed requirements A1–A6 are provisional planning inputs only.
- **I could not confirm:** The ticket title/description, acceptance criteria, release context, exact behaviors, quality targets, test environment, or test data.
- **Open questions blocking sign-off:** Confirm whether login/dashboard is the correct scope and answer the author questions in Section 2.
- **Approve or edit this draft before it is treated as an approved plan or used to write test cases / automation.**
