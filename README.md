# brislane-lending-platform

E2E + API quality automation for **Brislane Lend** (Project Keystone).

> ⚠️ **Inherited, partially working, and flaky.** This is a real starting point, not a clean template.
> It carries known technical debt on purpose. Your job (Phases 6–7) is to audit and refactor it.

## Stack
- Playwright + TypeScript (UI + API)
- @axe-core/playwright (accessibility — not yet integrated)
- GitHub Actions CI (currently **red**)

## Structure
```
src/pages/         Page Objects (weak — raw locators, duplicated selectors)
tests/loan/        Loan journey specs (some flaky, submit spec skipped)
tests/auth/        Login spec (assertion passes for the wrong reason)
api/               API specs (no status/contract assertions, expired hardcoded token)
fixtures/          Mostly missing — no shared auth fixture
utils/             Duplicate + unused helpers
test-data/         Seed data (one legacy script is deprecated)
.github/workflows/ CI pipeline (fails — browser install step is commented out)
```

## Known issues (the work)
- Hardcoded `waitForTimeout` waits throughout → flakiness
- Duplicate selectors across `LoginPage` / `PaymentsPage`
- Broken assertion in `tests/auth/login.spec.ts`
- `tests/loan/submit.spec.ts.skip` — skipped; intermittent **401 at submit**
- No shared auth fixture (every test logs in via UI)
- Weak Page Object design; dead code (`OldUploadPage.ts`, `utils/logger.ts`)
- Duplicate utilities (`utils/date.ts` vs `utils/dateHelper.ts`)
- CI is failing; no quality gates
- No DEV/QA/UAT env management (`.env.example` only)

## The open question
Submit failures climbed after the **AUTH-SVC 2.4.0** deploy (~8 Jun 2026). Suspected token-expiry
on the long application form — never proven. Cross-reference the data room before you trust any theory.

## Run
```bash
npm install
npx playwright install
cp .env.example .env.qa   # fill in real values (ask SRE)
npm test
```
