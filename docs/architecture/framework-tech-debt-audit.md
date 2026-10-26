# Phase 6 — Inherited Framework Tech-Debt Audit

**Scope:** review of the starter repository at the start of Phase 6. Items below distinguish observed defects from certification work that still requires a real environment.

| # | Finding in inherited starter | Risk / impact | Remediation in this refactor | Status |
|---:|---|---|---|---|
| 1 | Fixed `waitForTimeout` calls in LoginPage, ApplicationPage, PaymentsPage, OldUploadPage and an identity test | Timing-dependent flakiness; slower suites; waits do not prove the UI is ready | Removed fixed waits from maintained page objects and the identity test; use web-first assertions | Addressed in maintained paths |
| 2 | LoginPage and PaymentsPage duplicate username/password/login-submit selectors | Selector drift and accidental coupling between unrelated journeys | Each Page Object now owns private selectors for its own behavior; payment code no longer copies login selectors | Addressed |
| 3 | `tests/auth/login.spec.ts` asserted only that a stale `h1` existed | False-positive login coverage | Replaced with an authenticated API assertion using the shared auth fixture | Addressed; real auth contract still needs validation |
| 4 | `tests/loan/submit.spec.ts.skip` disabled the long-running submit regression | High-risk loan-submit behavior had no active UI regression test | Replaced the skipped extension with an active `submit.spec.ts` regression using Page Object methods | Test restored; not yet run against QA |
| 5 | Auth fixture/global setup used a hardcoded demo account and wrote bearer token to an auth file; config did not wire it | Secret exposure risk, inconsistent sessions, UI/API auth mismatch | Removed hardcoded global setup and local auth file; added worker-scoped API auth using environment-injected synthetic credentials and configurable token/cookie strategy | Framework implemented; endpoint/storage contract unverified |
| 6 | No explicit DEV/QA/UAT environment validation | Wrong target or missing settings could silently route tests to a default endpoint | Added explicit `TEST_ENV`, per-environment app/API URLs, required credentials, HTTPS validation and no production option | Addressed in config; actual GitHub Environment values still need provisioning |
| 7 | `src/pages/BasePage.ts` exposed its Page publicly and tests accessed raw locators | Tests coupled to selectors and implementation details | Page is protected in the base class; selectors are private in Page Objects; specs call behavior methods | Addressed for maintained specs |
| 8 | `src/pages/OldUploadPage.ts` contained a stale selector and fixed wait | Dead code could be reused and reintroduce flaky behavior | Deleted after reference check of maintained test paths | Addressed |
| 9 | `utils/logger.ts` had no maintained use; `utils/date.ts` and `utils/dateHelper.ts` duplicated date behavior | Unused code and ambiguous utility ownership | Deleted unused logger and duplicate date helper; `utils/date.ts` exports `today` and a backward-compatible `getToday` alias | Addressed |
| 10 | CI omitted browser installation, lacked reports/quality diagnostics, and used broad default test discovery | Red CI runs and poor failure evidence | Added browser installation, TypeScript check, explicit manual E2E dispatch, environment selection, HTML/JUnit artifacts and failure diagnostics | Addressed; E2E still awaits authorised environment run |
| 11 | No bounded transient retry policy or explicit CI/local retry distinction | Network blips and UI timing failures were handled inconsistently | Added bounded exponential backoff for transient auth failures; Playwright retries are 0 locally and 2 in CI | Addressed |

## Certification caveats

- Static TypeScript validation has passed on an earlier PR head; after the latest follow-up refactor, rerun the check before accepting it.
- The auth endpoint, request payload, token JSON path, storage key/cookie flags and CSRF requirements are configurable placeholders until confirmed by the API owner.
- The page selectors are inherited from the starter and must be verified against the authorised application.
- No lockfile was present in the starter. CI currently uses `npm install`; create and commit a lockfile using the approved registry before switching to `npm ci`.
- No claim is made that E2E, token-expiry recovery, submit idempotency, SCA, role checks or audit-event checks have passed until there is run evidence from authorised non-production environments.

## Evidence gate

The latest available successful CI run before this follow-up is linked from the PR history. It was a **TypeScript check**, not an E2E certification run. A successful typecheck must not be presented as proof that the browser suite passed.
