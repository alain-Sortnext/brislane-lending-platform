# Playwright Framework Architecture

## Design goals
1. One explicit non-production target per run: DEV, QA or UAT.
2. No local `.env` files or dotenv runtime loading; secrets are injected by the runner.
3. Page Objects own all UI selectors and expose behaviour-level methods only.
4. Authentication uses the API fixture, not repeated UI login.
5. Retries are bounded and restricted to transient transport/server failures.
6. CI produces HTML/JUnit results and failure diagnostics without automatically deploying or running against production.

## Components
- `config/environments.ts`: validates `TEST_ENV`, matching base URL, synthetic test credentials, HTTPS, auth response path and storage mode. Production is not an allowed value.
- `fixtures/auth.fixture.ts`: authenticates via the configured API and reuses a worker-scoped session. Supports bearer token in local/session storage or cookie-based auth when configured.
- `src/pages/*.ts`: Page Objects encapsulate selectors and UI interactions. Test specs should not use `page.locator`, `page.getByRole`, CSS selectors or fixed sleeps directly.
- `utils/retry.ts`: bounded exponential backoff for transient network/5xx failures only. Business assertions and non-transient 4xx responses are not retried.
- `playwright.config.ts`: CI-only retries, Chromium/Firefox/WebKit projects, HTML/JUnit reporting, traces/screenshots/video on failure.
- `.github/workflows/ci.yml`: PR typecheck gate; E2E runs only after explicit manual dispatch with a selected GitHub Environment.

## Configuration and secrets
Create GitHub Environments named `dev`, `qa`, and `uat`. In each environment configure:
- Variable: `<ENV>_BASE_URL`
- Secrets: `<ENV>_TEST_USER_EMAIL`, `<ENV>_TEST_USER_PASSWORD`
- Optional variables: `AUTH_LOGIN_PATH`, `AUTH_TOKEN_JSON_PATH`, `AUTH_TOKEN_STORAGE`, `AUTH_TOKEN_STORAGE_KEY`

Do not create or commit local .env files. Use synthetic test accounts only. Restrict who can trigger UAT runs and add environment protection/approvals where required. Never expose credentials or tokens in logs. Review trace/video artifacts for sensitive data before sharing.

## Authentication contract is an integration point
Defaults are illustrative until the application/API owner confirms the real login route, request payload, token JSON path, localStorage/sessionStorage key, cookie flags, CSRF requirements and token refresh semantics. Do not certify based on the defaults. For cookie mode, the login response must establish the expected cookie. If the application uses HttpOnly cookies, the fixture should rely on cookies rather than attempting to read a token from JavaScript storage.

## Reliability and observability
- Auth retries use bounded exponential backoff for transient transport/server failures only.
- Playwright retries are disabled locally and limited to two in CI.
- HTML and JUnit reports are emitted for each run; trace, screenshot and video are captured on failure.
- A test that passes only on retry is still a flakiness signal and must be investigated.
- Do not use fixed sleeps to wait for UI state; use locator/actionability and web-first assertions.

## Known pre-merge certification work
- Confirm real auth route/payload, response shape, cookie/storage and CSRF contracts.
- Verify all page selectors against the authorised application; selectors in this starter are inherited and may need adjustment.
- Add a dependency lockfile from the approved registry before switching CI to `npm ci`.
- Run `npm run typecheck` and the test suite against DEV, then QA; inspect sanitized artifacts.
- Verify expired-token handling, refresh/re-auth behavior, submit idempotency, SCA, role access, rate limiting and audit event integrity.
- Obtain QA, security and compliance sign-off before certification.
