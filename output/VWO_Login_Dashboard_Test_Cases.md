# VWO Login Dashboard Test Cases

## Document Scope
This document contains test cases derived from the VWO login dashboard PRD. The cases cover the core login and access requirements described in the document: authentication, validation, password recovery, session handling, security, accessibility, and performance.

## Test Case Format
Each test case includes:
- Test Case ID
- Title
- Description
- Preconditions
- Test Data
- Test Steps
- Expected Result
- Priority

---

## TC-01: Successful Login with Valid Credentials
**Description:** Verify that a user can log in successfully using a valid email address and password.  
**Preconditions:** User account exists and is active; login page is accessible via app.vwo.com; HTTPS is active.  
**Test Data:** Valid email: `user@example.com`; valid password: `ValidPassword@123`  
**Steps:**
1. Open the VWO login page.
2. Enter the valid email address in the email field.
3. Enter the valid password in the password field.
4. Click the login button.
5. Wait for the authentication response.

**Expected Result:**
- User is successfully authenticated.
- The system transitions to the next authenticated state or main dashboard after successful login.
- No invalid credential error is displayed.
- Loading indicator appears during processing and clears after success.

**Priority:** P0

---

## TC-02: Login Fails with Invalid Password
**Description:** Verify that an incorrect password is rejected with a clear error message.  
**Preconditions:** User exists but password is incorrect; login page is open.  
**Test Data:** Valid email: `user@example.com`; invalid password: `WrongPassword@123`  
**Steps:**
1. Open the VWO login page.
2. Enter the valid email address.
3. Enter an incorrect password.
4. Click the login button.

**Expected Result:**
- Authentication fails.
- The user remains on the login page or relevant error state.
- A clear, actionable error message is displayed for invalid credentials.
- Sensitive account details are not exposed in the error message.

**Priority:** P0

---

## TC-03: Email Format Validation
**Description:** Validate that the login form rejects an invalid email format using field validation.  
**Preconditions:** Login page is open.  
**Test Data:** Invalid email: `user@` or `user.example.com`  
**Steps:**
1. Open the VWO login page.
2. Enter an invalid email format in the email field.
3. Leave the field or trigger blur validation.
4. Enter a valid password.
5. Click the login button.

**Expected Result:**
- The form shows an email validation error on invalid input.
- The user is not allowed to proceed with invalid email data.
- The error message is clear and actionable.

**Priority:** P0

---

## TC-04: Empty Fields Submission
**Description:** Verify that empty email and password values are prevented from submission.  
**Preconditions:** Login page is open.  
**Test Data:** Empty email field; empty password field  
**Steps:**
1. Open the VWO login page.
2. Leave the email field blank.
3. Leave the password field blank.
4. Click the login button.

**Expected Result:**
- Form submission is blocked.
- Validation errors are shown for the missing required fields.
- The user is not authenticated.

**Priority:** P0

---

## TC-05: Forgot Password with Valid Email
**Description:** Verify the password reset workflow for a valid registered email address.  
**Preconditions:** User is on the login page; valid account email is known.  
**Test Data:** Valid email: `user@example.com`  
**Steps:**
1. Open the login page.
2. Click the Forgot Password link.
3. Enter a valid email address associated with an account.
4. Submit the request.

**Expected Result:**
- The reset request is accepted.
- A secure recovery flow is initiated.
- The user receives the expected recovery confirmation or next-step instruction.
- The system does not display sensitive account data.

**Priority:** P0

---

## TC-06: Forgot Password with Invalid Email
**Description:** Verify that an invalid or unregistered email is handled safely during the reset flow.  
**Preconditions:** User is on the Forgot Password page.  
**Test Data:** Invalid email: `invalid@example.com` or malformed email  
**Steps:**
1. Open the login page.
2. Select Forgot Password.
3. Enter an invalid or unregistered email address.
4. Submit the request.

**Expected Result:**
- The system rejects the request appropriately.
- The user receives a clear message.
- No sensitive account information is disclosed.
- The workflow remains secure and consistent.

**Priority:** P1

---

## TC-07: Remember Me Session Persistence
**Description:** Verify that the Remember Me option persists the session as defined in the PRD.  
**Preconditions:** User has valid credentials; login page is open.  
**Test Data:** Valid email/password; Remember Me enabled  
**Steps:**
1. Open the login page.
2. Enter valid credentials.
3. Select the Remember Me option.
4. Sign in.
5. Close and reopen the browser or session context.

**Expected Result:**
- The session remains available based on the configured remember-me behavior.
- The user can access the authenticated area without re-entering credentials
- The system behaves consistently with secure session handling expectations.

**Priority:** P1

---

## TC-08: Session Timeout Handling
**Description:** Verify that an expired or timed-out session triggers the correct sign-out or reauthentication flow.  
**Preconditions:** User is already authenticated; session timeout is configured.  
**Test Data:** Active authenticated session; timeout period configured by the system  
**Steps:**
1. Log in successfully.
2. Wait for the configured timeout period.
3. Attempt to access an authenticated page or continue using the session.

**Expected Result:**
- The system logs the user out or requires reauthentication after timeout.
- The user is clearly informed that the session has expired.
- No unauthorized access is granted after session expiry.

**Priority:** P0

---

## TC-09: Brute Force / Rate Limiting Protection
**Description:** Verify that repeated failed login attempts are controlled by rate limiting or protection measures.  
**Preconditions:** Login page is open; a user account is valid.  
**Test Data:** Valid email: `user@example.com`; repeated invalid password attempts  
**Steps:**
1. Open the login page.
2. Enter the valid email address.
3. Enter an incorrect password repeatedly in consecutive attempts.
4. Continue until multiple failed login attempts are triggered.

**Expected Result:**
- The system enforces rate limiting or lockout behavior as defined by the security requirements.
- The user sees a clear message about repeated failed attempts.
- The system protects against brute-force access attempts.

**Priority:** P0

---

## TC-10: Accessibility and Keyboard Navigation
**Description:** Verify that the login page supports keyboard navigation and screen-reader-friendly interaction.  
**Preconditions:** Login page is loaded; accessibility tools or keyboard navigation are available.  
**Test Data:** Valid user details if login flow is tested after accessibility checks  
**Steps:**
1. Open the login page.
2. Use the Tab key to navigate through the email field, password field, Remember Me checkbox, and login button.
3. Use Enter to trigger actions.
4. Inspect form labels, focus order, and screen-reader semantics if supported.

**Expected Result:**
- All interactive elements are reachable by keyboard.
- Focus order is logical and visible.
- Labels and controls are usable with assistive technologies.
- No keyboard trap or inaccessible control is present.

**Priority:** P0

---

## TC-11: Responsive Mobile Layout Validation
**Description:** Verify that the login flow remains usable and visually correct on mobile devices and smaller screen widths.  
**Preconditions:** Browser developer tools or mobile device is available.  
**Test Data:** Standard valid user credentials  
**Steps:**
1. Open the login page on a mobile viewport or mobile device.
2. Confirm the email field, password field, and login button are visible and correctly aligned.
3. Attempt login using valid credentials.
4. Check touch-friendly interaction and usability.

**Expected Result:**
- The page is responsive and usable on mobile devices.
- Inputs are touch-friendly and remain readable.
- The login flow works without layout breakage.

**Priority:** P0

---

## TC-12: Login Page Load Performance
**Description:** Verify that the login page loads within the PRD performance target on standard connections.  
**Preconditions:** Network conditions are available for performance validation; page is loaded in a browser.  
**Test Data:** Standard connection profile  
**Steps:**
1. Open the login page from a normal browser session.
2. Record page load time.
3. Repeat the measurement under standard conditions.

**Expected Result:**
- The page loads within 2 seconds on standard connections.
- The login interface appears without significant delay.
- The page remains responsive and stable during access.

**Priority:** P0

---

## TC-13: Optional 2FA Support Validation
**Description:** Verify that optional two-factor authentication, when enabled, works correctly for secure login.  
**Preconditions:** User account is configured for 2FA; secure environment is available.  
**Test Data:** Valid login credentials and second-factor challenge  
**Steps:**
1. Open the login page.
2. Enter valid email and password.
3. Trigger the 2FA flow if configured.
4. Complete the secondary authentication step.

**Expected Result:**
- The user is authenticated only after successful second-factor verification.
- The flow supports enhanced security requirements described in the PRD.
- Errors for failed second-factor attempts are clear and secure.

**Priority:** P1

---

## TC-14: SSO Login Readiness Validation
**Description:** Verify that enterprise SSO paths are accessible and consistent when configured.  
**Preconditions:** SSO configuration is available in the environment.  
**Test Data:** Enterprise user account and SSO identity provider configuration  
**Steps:**
1. Open the applicable enterprise login path.
2. Initiate login using SSO or identity provider sign-in.
3. Complete the enterprise authentication flow.

**Expected Result:**
- The user can log in using the supported enterprise SSO mechanism.
- The login flow is consistent with the enterprise requirements in the PRD.
- No broken redirect or authentication failure occurs in the configured environment.

**Priority:** P1

---

## Summary
These test cases directly map to the major requirements in the VWO Login Dashboard PRD and cover functional, security, accessibility, responsive design, and performance validation. They can be used for execution planning and defect validation during QA testing.
