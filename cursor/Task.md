Take-Home Assessment
Frontend Engineer
Overview
Duration: 75 minutes (120 minutes maximum recording length)
Approac
h: Test-Driven Development (TDD) - Preferred
Platform: Expo React Native
Language: TypeScript (preferred)
Stru
c
ture: This exercise has 3 progressive milestones. Complete them in order:
●
●
●
Milestone 1: Core UX + baseline state (45–50 minutes) - Average candidates should complete this
Milestone 2: Session management + synchronization (20–25 minutes) - Good candidates complete M1 +
partial/complete M2
Milestone 3: Advanced feature (bonus) - Only if time permits (pick ONE)
Realistic expec
tation: Most candidates complete Milestone 1 + part of Milestone 2. That’s success!
Su
bmission Delivera
b
les
When you complete this assessment, you must submit via email:
1. Sc
reen Recording (max 120 minutes)
●
●
●
●
Your full screen visible at all times
Continuous verbal commentary explaining your work
Do not edit the recording
Include an app demo at the end showing the running app
2. Trans
c
ript
●
●
Text transcript of your verbal commentary
Use tools like Otter.ai, YouTube auto-captions, or Descript
3. GitHu
b
Repository
●
●
●
●
Your own GitHub repository with the completed code
Include a README with setup and run instructions
Ensure app runs and tests pass
Meaningful commit history
Note: There will be a follow-up interview to discuss your submission.
Background
eKYC (electronic Know Your Customer) is the process of verifying a customer’s identity remotely. You will build a
mo
ile on
b
b
oarding app that collects verification information and submits it to a (mocked) backend.
This exercise intentionally focuses on mobile engineering fundamentals:
●
●
●
●
Glo
b
al state + local state sync
hronization
Session lifec
y
cle (login, expiry, refresh, guarded routes)
UI theming (light/dark, token-based)
Resilient UX (loading/error/retry, persisted drafts)
Produ
c
Build a Mo
t Requirements (What You’re Building)
ile eKYC On
oarding App with:
b
b
Required Sc
reens
1. Login
○
○
2. Home
○
○
3. On
b
○
○
○
○
○
4. Settings
○
Email + password (simple validation)
Calls mocked login API
Shows user name (from /me) and onboarding status
Entry point to start/resume onboarding
oarding (multi-step)
Step 1: Profile (name, DOB, nationality)
Step 2: Document (document type + number; image is a placeholder)
Step 3: Selfie (placeholder capture)
Step 4: Address (address line + city + country)
Step 5: Review & Submit
Theme toggle (light/dark)
Navigation Expec
tations
●
●
●
Unauthenticated users can only access Login
Authenticated users can access Home / On
b
oarding / Settings
When the session expires, user must be sent back to Login (route guard), with a clear message
Data Models (Suggested)
You may adjust names/shape, but keep the intent.
User
JSON
{
"id": "USR-001"
,
"email": "jane.doe@example.com"
,
"fullName": "Jane Doe"
}
Session
JSON
{
"accessToken": "access_abc"
,
"refreshToken": "refresh_def"
,
"expiresAt": "2026-01-16T10:30:00.000Z"
}
On
b
oarding Draft
JSON
{
"profile": {
"fullName": "Jane Doe"
,
"dateOfBirth": "1990-05-15"
,
"nationality": "US"
},
"document": {
"documentType": "PASSPORT"
,
"documentNumber": "P12345678"
},
"selfie": {
"hasSelfie": false
},
"address": {
"addressLine1": "123 Main St"
,
"city": "Springfield"
"country": "US"
,
},
"consents": {
"termsAccepted": false
}
}
Su
bmission Result
JSON
{
"submissionId": "SUB-123"
,
"status": "RECEIVED" | "FAILED"
}
Mocked API Contrac
There is no real
ts
b
ackend. You must simulate network calls (promises + delays) and realistic failures.
1) Login
Func
Su
tion: apiLogin(email, password)
ccess:
JSON
{
"user": { "id": "USR-001"
"Jane Doe" },
"session": { "accessToken": "access_abc"
"expiresAt": "
...
" }
,
"email": "jane.doe@example.com"
"fullName":
,
,
"refreshToken": "refresh_def"
,
}
Failure cases:
●
●
Invalid credentials → 401-like error
Random transient failure → 500-like error (optional)
2) Refresh Session
Func
tion: apiRefresh(refreshToken)
Su
ccess: returns a new session with a later expiresAt
Failure:
●
Invalid refresh token → 401-like error (must logout)
3) Get Current User
Func
tion: apiMe(accessToken)
Rules:
●
●
If access token is expired → 401-like error
Otherwise returns user
bmit On
oarding
b
tion: apiSubmit(accessToken, draft)
4) Su
Func
Rules:
●
●
●
Validate draft server-side (simulate). If missing required fields → 400-like error with field hints.
If access token expired → 401-like error (should attempt refresh once, then retry submit)
Optional: simulate 500-like error with retry UI
Glo
b
al State Requirements (Key Assessment Foc
us)
Your app must have multiple glo
b
al states that interact:
1. Auth/Session state
○
status: logged_out | logging_in | logged_in | refreshing | expired
○
user + session
2. Theme state
○
theme: light | dark
○
token-based theme values (colors/spacing) applied across app
3. On
b
oarding state
○
draft (the onboarding draft)
○
currentStep / progress
○
submission state: idle | submitting | success | error
4. Request/Network state (can be minimal)
○
Centralize “in-flight” flags and error surfaces for key requests (login, me, submit)
Sync
hronization Requirements (Glo
al ↔ Local)
b
This is the hardest part of the exercise.
●
●
●
Form screens may keep local input state, but the draft must stay in sync
with global onboarding state.
Draft updates must not be lost during:
○
○
○
○
theme change
navigation between steps
app restart (if you persist the draft)
session expiry / logout (draft should be preserved unless you intentionally clear it)
Submitting should only clear the draft on su
ccessful submission.
Persistence Requirements
Persist at least:
●
●
Theme (so it survives restart)
On
b
oarding draft + c
urrent step (so the user can resume)
Session persistence is optional:
●
●
If you persist it, use secure storage and handle expiry correctly.
If you don’t persist it, that’s acceptable—just be consistent.
UI Theme Requirements
●
●
●
Implement light/dark themes using a theme o
bjec
t (tokens), not scattered colors.
Theme changes must apply across all screens immediately.
Components should consume theme via a clear mechanism (context, hook, or design system wrapper).
MILESTONE 1: Core UX + Baseline State (45–50
minutes)
Target: Average candidates should complete this milestone.
Goal
Deliver a runnable app with the main navigation flow, onboarding draft state, and app-wide theming.
Requirements
1.1 Navigation + Sc
reens
●
●
●
●
✅ Login screen (basic validation + mocked login)
✅ Home screen (shows user name and onboarding status)
✅ Onboarding flow with 5 steps (can be one screen with stepper OR separate screens)
✅ Settings screen with theme toggle
1.2 On
b
oarding Draft State
●
●
●
●
✅ Global onboarding store/reducer
✅ Can edit fields across steps
✅ Can move next/back
✅ Review screen shows the final draft
1.3 Theming
●
●
●
✅ Theme store (light/dark)
✅ Token-based styles applied across app
✅ Settings toggles theme and UI updates immediately
1.4 Su
bmit (Mock)
●
●
●
✅ “Submit” triggers mocked API call
✅ Show loading state + disable submit while submitting
✅ Show success or error state
Su
ccess Criteria for Milestone 1
●
●
●
●
●
[ ] App runs reliably
[ ] Navigation works end-to-end
[ ] Draft updates persist while navigating
[ ] Theme toggle aﬀects the whole UI
[ ] Submit flow shows loading/success/error
Suggested Tests for Milestone 1
●
●
test_onboardingDraft_updates_and_progresses_steps
test_themeToggle_updates_theme_state
MILESTONE 2: Session Management +
Sync
hronization (20–25 minutes)
Target: Good candidates complete Milestone 1 + complete or meaningfully start this milestone.
Goal
Add real session lifecycle behavior and ensure state stays correct under expiry/refresh and request failures.
Requirements
2.1 Session Lifec
y
cle
●
●
●
✅ Auth store includes token expiry awareness
✅ If token expired → show “Session expired” UX and redirect to Login (guard routes)
✅ Implement refresh flow:
○
○
○
On 401-like errors from /me or /submit, attempt apiRefresh() once
If refresh succeeds → retry original request once
If refresh fails → logout + redirect to Login
2.2 Sync
hronization Under Session Changes
●
●
●
✅ Draft is preserved across logout/session expiry (unless you intentionally clear it and explain why)
✅ In-flight submit handles expiry correctly (refresh then retry)
✅ Home screen reflects correct onboarding status after returning from onboarding
2.3 Basic Testing (Must Have)
Write at least:
●
●
✅ Unit tests for your auth/session reducer/store logic (expiry → logout; refresh → retry path)
✅ One higher-level test (component or flow) OR a focused integration-style test for submit retry behavior
Su
ccess Criteria for Milestone 2
Must
complete to claim Milestone 2 completion:
●
●
●
[ ] Session expiry handled with route guarding
[ ] Refresh-then-retry behavior works (once)
[ ] Tests cover key session transitions
Nice to have:
●
●
[ ] Avoids duplicated retry logic via a small API wrapper
[ ] Clear error messages surfaced to the user
MILESTONE 3: Advanced Feature (Bonus - Pick ONE)
Only attempt this if Milestone 1 is done and Milestone 2 is solid.
Pick ONE:
Option A: Oﬄine Queue + Optimistic UI
●
●
●
Queue submit attempts when “oﬄine” (simulate oﬄine toggle)
Show queued state on Home
Auto-retry when back online
Option B: Deep Link Resume + Rehydration
●
●
Support a deep link like myapp://onboarding/review
Correctly restore and navigate to the requested step
Option C: A
ccessi
b
ility + Redu
ced Motion
●
●
●
Improve accessibility labels/hints
Ensure text scales reasonably (dynamic type)
Provide reduced motion handling for transitions/animations (basic)
Option D: Performance Boundaries
●
●
Identify at least one real re-render problem
Fix it with memoization/selectors and explain why it works
Time Management Guidance (75 minutes)
First 5 minutes:
●
●
●
Read requirements carefully
Decide your state approach and file structure
Ask clarifying questions
Minutes 5–55 (Milestone 1):
●
●
●
Build the skeleton quickly (nav + screens)
Implement onboarding store + theme store
Keep the app runnable at all times
Minutes 55–75 (Milestone 2):
●
●
Implement expiry + refresh-then-retry
Add tests for session transitions and one risky flow
Only if extra time:
●
Pick ONE Milestone 3 option
Variation: WITH LLM Agent (This Interview)
AI tools are allowed. We will evaluate:
●
●
●
●
How you prompt (clarity and constraints)
Whether you review AI output critically
Whether you test and fix issues
Whether you can explain the final code
Rule: “AI helped write it” is not an excuse for broken behavior.
Summary
What you’re
b
uilding: Mobile eKYC onboarding app with session lifecycle + theming + multi-step draft flow.
Key
c
hallenges:
●
●
●
●
Expec
Synchronizing global and local state correctly
Handling session expiry/refresh and retrying requests safely
Building consistent theming across the UI
Shipping a resilient user experience with basic testing
ted
completion: Milestone 1 + meaningful pr