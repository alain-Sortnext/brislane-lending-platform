# Framework Certification Checklist

- [ ] GitHub Environments `dev`, `qa`, `uat` configured with URLs as variables and synthetic credentials as secrets.
- [ ] No local dotenv loading; no committed .env files, credentials, JWTs, auth state or customer PII.
- [ ] API owner confirms login route/payload, token response path, storage/cookie model, CSRF requirements and refresh behavior.
- [ ] Auth fixture validated for successful login, invalid credentials, expired token, missing token and cookie-based sessions where applicable.
- [ ] All selectors live inside Page Objects; test specs use only behaviour-level methods and web-first assertions.
- [ ] Fixed sleeps removed from tests and Page Objects.
- [ ] Submission flow tested for expiry/recovery and duplicate-submit/idempotency behavior.
- [ ] Dependency lockfile generated from approved registry and committed before enabling `npm ci`.
- [ ] `npm run typecheck` passes.
- [ ] DEV and QA E2E runs complete; HTML/JUnit and failure artifacts reviewed and sanitized.
- [ ] CI only executes E2E on explicit environment dispatch; UAT approval configured.
- [ ] SCA, roles/authorisation, rate limiting and immutable audit-event regression checks are linked to test coverage.
- [ ] QA lead and security/compliance owners approve the certification evidence.

**Gate:** Do not call the framework certified until mandatory items are evidenced or formally waived by the accountable owner.
