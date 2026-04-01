Take-Home Assessment Guide
Frontend Engineer
Overview
You’ll complete a take-home assessment that evaluates your ability to build produ
Expo Reac
t Native.
c
tion-quality mo
b
ile UI using
What to expec
t:
●
●
●
●
●
●
Duration: 75 minutes target (120 minutes maximum recording length)
Platform: Expo React Native
Language: TypeScript (preferred)
Goal: Demonstrate professional mobile engineering skills: state management, session management,
theming, and UI correctness
AI tools: Allowed (ChatGPT/Copilot/etc.), but you must validate outputs and ensure tests pass
Deadline: 7 days from receiving this assessment
Assessment Format
This is a take-home assessment that you will complete independently. You must record your screen and provide
verbal commentary while you work, then submit the recording along with your code.
Delivera
b
les (all three required):
1. Screen recording with verbal commentary (max 120 minutes)
2. Transcript of your commentary
3. GitHub repository link
Follow-up: After submission, there will be a follow-up interview to discuss your solution.
Recording Requirements
Before You Start
Ensure you have:
●
●
●
●
●
●
●
●
[ ] Screen recording software installed (OBS, Loom, QuickTime, or similar)
[ ] Microphone working and tested
[ ] Suﬃcient disk space for a 2-hour recording
[ ] A quiet environment for clear audio
[ ] Your IDE ready
[ ] Node.js L TS installed
[ ] Expo CLI available (or npx expo)
[ ] Able to run on at least one target (iOS Simulator, Android Emulator, or Expo Go)
Recording Guidelines
1. Record your entire s
c
reen showing your IDE and simulator/emulator
2. Provide continuous ver
b
al commentary explaining:
○
Your thought process and decision-making
○
Why you chose specific approaches
○
Trade-oﬀs you considered
○
What you’re testing and why
○
Any assumptions you’re making
3. Do not edit the recording - we want to see the authentic process
4. Aim to complete within 75 minutes - the 120-minute limit is a maximum, not a target
What to Explain in Your Commentary
●
●
●
●
●
●
●
Your understanding of the requirements
How you’re breaking down the problem
State management decisions (what is global vs local and why)
Design decisions (component structure, theming approach)
Why you’re writing specific tests
How you handle errors and edge cases
Trade-oﬀs between diﬀerent approaches
Important: This is a mo
simulated.
ile app exer
b
cise. You do not need to build a backend. Any “API” calls will be mocked or
Su
bmission Instru
c
tions
Upon completion, submit the following via email:
1. Sc
reen Recording
●
●
●
●
Upload to a file sharing service (Google Drive, Dropbox, Loom, etc.)
Ensure the link is accessible (not restricted)
Format: MP4, MOV, or WebM preferred
Maximum duration: 120 minutes
2. Trans
c
ript
●
●
●
Generate a transcript of your verbal commentary
Submit as a PDF, TXT, or Markdown file
Include timestamps if possible
3. GitHu
b
Repository
●
●
●
●
●
Create a GitHub repository (public or private)
If private, share access with the evaluator (you’ll receive their GitHub username)
Include a README with:
○
○
○
Setup instructions
How to run the app
How to run the tests
Ensure the app runs and tests pass
Meaningful commit history showing your progress
4. App Demo (at end of recording)
At the end of your recording, please demonstrate:
●
●
●
The running app on simulator/emulator
Complete user flow: Login → Onboarding steps → Theme toggle → Submit
(If implemented) Session expiry handling
Tools for Recording and Trans
c
ription
Free Recording Options
●
●
●
●
OBS Studio (Windows/Mac/Linux) - Free, open source
QuickTime Player (Mac) - Built-in screen recording
Loom - Free tier available, easy sharing
X
b
ox Game Bar (Windows) - Built-in recording
Trans
c
ription Options
●
●
●
●
Otter.ai - Free tier: 600 minutes/month
YouTu
b
e - Upload as unlisted, use auto-captions, download transcript
Des
c
ript - Free tier available
Rev.
com - Paid but accurate
What We’re Evaluating
We assess professional frontend/mobile engineering capabilities:
1. Code Quality & Produ
c
tion Readiness
●
●
●
●
Clean, readable, maintainable code
Appropriate separation of concerns (UI, state, data access)
Robust error handling and edge-case thinking
Sensible logging (avoid logging PII)
2. Tec
hnical Implementation
●
●
●
●
Correct state management (global + local state synchronization)
Correct session management (login, expiry, refresh, route guarding)
Theming architecture (light/dark, tokenized styles)
Navigation patterns (stack flow, protected routes)
3. Pro
b
lem-Solving & Communication
●
●
●
Breaks down complex requirements and prioritizes well
Makes reasonable assumptions, documents them, and moves forward
Communicates trade-oﬀs clearly via recording commentary
4. Testing Approac
h
●
●
●
At least a small set of meaningful tests
Tests focus on correctness of tricky logic (session lifecycle, reducers/stores, state transitions)
Clear test names and reliable assertions
Produ
c
tion-Ready Mo
b
ile Principles
Your solution should be produ
c
tion-minded, not just “it works on my device”
.
Core Expec
tations
1. State correc
tness: UI must not show stale or inconsistent state
2. Session safety: secure handling of tokens; logout on expiry; correct guarded navigation
3. UX resilience: loading, error, retry, empty states
4. Theming: consistent styling, no scattered magic colors, easy to extend
5. Maintaina
b
ility: organized modules, clear naming, minimal prop-drilling
Anti-Patterns to Avoid
●
●
●
●
●
Global state used for everything (no local state where appropriate)
Hardcoded colors and duplicated styles everywhere
Silent failures (no user feedback on errors)
“Fixing” issues by re-rendering everything (performance blind spots)
Logging sensitive user data (PII)
Prioritization
Priority 1: Core user flow works end-to-end
Priority 2: Correct state + session lifecycle behavior (no inconsistent UI)
Priority 3: Production-ready refinements (tests, accessibility touches, better architecture)
Rememb
er: A clean partial solution is better than a rushed “everything” with bugs.
Preparation
Su
ccess Mindset
1. Quality over quantity: we value correctness and clarity
2. Process matters: we evaluate how you work, not just the final output
3. Make assumptions explicitly: then implement
4. Completeness is not expec
ted: most candidates won’t finish everything
5. Communication is Key: Your verbal explanations are as important as the code
Before Recording
●
●
●
●
Read through the Problem Statement completely
Plan your approach mentally before starting the recording
Have documentation accessible
Test your recording setup with a short test recording
Recommended Reading (Optional)
●
React state management patterns (Context/Reducer, Redux Toolkit, Zustand)
●
●
●
React Navigation basics (stacks, auth flows)
Expo + React Native persistence options (AsyncStorage vs SecureStore)
Testing with Jest and @testing-library/react-n