# eKYC onboarding — take-home assessment

Expo React Native app (TypeScript) for the frontend engineer take-home.
Assessment brief: [`docs/Task.md`](docs/Task.md) and [`docs/Guide.md`](docs/Guide.md).

## Prerequisites

- Node.js LTS
- `npx expo` (no global Expo CLI required)
- iOS Simulator, Android Emulator, or [Expo Go](https://expo.dev/go) on a device

## Setup

```bash
npm install
```

## Run the app

```bash
npm start
```

Then press `i` (iOS), `a` (Android), or scan the QR code with Expo Go.

```bash
npm run ios
npm run android
```

## Demo credentials

Use these mock login credentials:

- Email: `jane.doe@example.com`
- Password: `password`

## Tests

Test environment is configured with Jest (`jest-expo`) and React Native Testing Library.

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Typecheck and lint:

```bash
npx tsc --noEmit
npm run lint
```

## What was implemented

### Milestone 1

- Navigation split for auth/protected flows (`Login`, `Home`, `Onboarding`, `Settings`)
- 5-step onboarding flow with global draft state and step progress
- Theme store with light/dark mode and token-based UI styling
- Submit flow with loading/success/error UX
- Persistence:
  - Theme + onboarding draft/step in AsyncStorage
  - Session in SecureStore
- Shared UI components and validation helpers

### Milestone 2

- Auth/session lifecycle with:
  - token expiry awareness
  - proactive route guard behavior on expiry
  - refresh-once/retry-once for protected calls (`/me`, `/submit`)
  - logout + clear session UX when refresh fails
- Draft synchronization behavior:
  - onboarding draft preserved across logout/session expiry
  - draft cleared intentionally only via reset/success clear path
- Home status correctness after onboarding completion/return
- Confirm-before-clear onboarding action on Home

## Architecture notes

- State management: Zustand stores (`authStore`, `onboardingStore`, `themeStore`)
- API layer: mocked async API with deterministic one-shot failure flags for demo/tests
- Validation: centralized in `src/lib/validation.ts`
- Tests: unit + component/integration-style tests for session transitions and onboarding flows


