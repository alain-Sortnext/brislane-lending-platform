## Summary
Refactors the inherited Playwright framework to use explicit DEV/QA/UAT configuration, API-based authentication, encapsulated Page Objects, bounded transient retry logic, cross-browser projects and HTML/JUnit reporting.

## Changes
- Add validated `TEST_ENV=dev|qa|uat` configuration with per-environment URLs and synthetic account secrets; remove local dotenv dependency.
- Add worker-scoped API authentication fixture with configurable token path and token/cookie storage strategy.
- Encapsulate selectors inside Page Objects and replace hard-coded sleeps with web-first assertions.
- Enable the previously skipped loan submit regression spec under the standard `.spec.ts` extension.
- Add bounded retry helper and CI retry/diagnostic/report configuration.
- Add architecture and certification checklist documentation.
- CI runs typecheck for pull requests; E2E runs only by manual dispatch with a selected GitHub Environment.

## Security
No credentials or tokens are committed. Use synthetic test accounts and authorised non-production targets only. No production target is permitted by the environment selector.

## Validation status
The framework has not yet been certified against the live application. The real login endpoint/payload, token JSON path, browser storage/cookie mechanism and selectors need owner confirmation. The starter repository has no package lockfile, so CI currently uses `npm install`; generate and commit a lockfile from the approved registry before changing CI to `npm ci`.

## Review checklist
- [ ] `npm run typecheck` passes
- [ ] DEV then QA run passes with sanitized HTML/JUnit/trace evidence
- [ ] Auth expiry/refresh and submit idempotency verified
- [ ] QA/security/compliance approve the certification checklist
