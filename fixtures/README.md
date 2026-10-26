# Authentication fixture

Use `test` and `expect` from `fixtures/auth.fixture.ts` for authenticated tests. The fixture obtains a session through the configured auth API and reuses it within a worker; tests do not log in through the UI. The login route, token response path, and token storage mechanism are configurable because the real application contract must be confirmed before certification.

Set `TEST_ENV=dev|qa|uat`, the matching `<ENV>_BASE_URL`, `<ENV>_TEST_USER_EMAIL` and `<ENV>_TEST_USER_PASSWORD`. Supply credentials via an approved secret manager or GitHub Environment secrets. Never commit tokens, auth state, local `.env` files, or customer PII.
