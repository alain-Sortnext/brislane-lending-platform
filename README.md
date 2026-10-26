# Brislane Lending Platform — Starter Repo

> **Project Keystone** — Senior Quality Engineer simulation starter framework.
> This repo contains deliberate tech debt. Your job is to find it, fix it, and build on top of it.

---

## Quick Start — Do This First

### Step 1 — Fork this repo
1. Click **Fork** (top right on GitHub)
2. Click **Create fork**
3. You now have your own copy at `https://github.com/YOUR-USERNAME/brislane-lending-platform`

> ⚠️ **Fork, don't clone the original.** You need your own fork to raise Pull Requests (Phase 6), commit automation (Phase 7), and trigger GitHub Actions (Phase 8).

### Step 2 — Clone your fork
```bash
git clone https://github.com/YOUR-USERNAME/brislane-lending-platform.git
cd brislane-lending-platform
```

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Install Playwright browsers
```bash
npx playwright install
```

### Step 5 — Enable GitHub Actions on your fork
1. Go to your fork on GitHub
2. Click the **Actions** tab
3. Click **I understand my workflows, go ahead and enable them**

---

## Repo Structure

```
brislane-lending-platform/
├── .github/
│   └── workflows/
│       └── ci.yml              # ⚠️ BROKEN — fix in Phase 8
├── api/
│   └── postman_collection.json # Phase 3 — import this into Postman
├── database/
│   ├── schema.sql              # Phase 4 — run this first in Neon
│   ├── seed.sql                # Phase 4 — run this second
│   └── validation_queries.sql  # Phase 4 — use these for your submission
├── fixtures/
│   └── auth.fixture.ts         # ⚠️ MISSING — add in Phase 6
├── mock-api/
│   └── server.js               # Live mock API (deployed on Vercel)
├── src/
│   └── pages/                  # Page Objects — ⚠️ tech debt to fix in Phase 6
├── tests/
│   ├── auth/
│   └── loan/
├── utils/                      # ⚠️ duplicate utils — fix in Phase 6
├── .env.example                # Environment variable template
└── index.html                  # Data room (GitHub Pages)
```

---

## Phase-by-Phase Guide

### Phase 1 — Onboarding & Tool Setup

**All tools needed for this simulation:**

| Tool | Purpose | Setup |
|------|---------|-------|
| Jira Cloud | Test cases + defects | [atlassian.com/software/jira/free](https://www.atlassian.com/software/jira/free) |
| GitHub | Version control + CI/CD | [github.com/signup](https://github.com/signup) |
| Playwright | Automation framework | `npm install` + `npx playwright install` |
| Postman | API testing | [postman.com/downloads](https://www.postman.com/downloads/) |
| Neon | PostgreSQL database | [neon.tech](https://neon.tech) |
| Miro | RCA board | [miro.com/signup](https://miro.com/signup/) |
| Power BI / Google Sheets | Release dashboard | [powerbi.microsoft.com](https://powerbi.microsoft.com) |

**Data room** (all data files + Tom's handover notes):
`https://alain-sortnext.github.io/brislane-lending-platform/`

---

### Phase 2 — Test Strategy & Test Design

**Jira project setup:**
1. Create a Jira Cloud project named `Brislane PLC — Keystone`
2. Note your project key (e.g. `BRK`, `BRIS`) — you need it for all issue references
3. Create minimum 60 test cases across these types: functional, negative, boundary, integration, accessibility, exploratory, regression
4. Export as CSV if needed for evidence

**Key data to inform your risk matrix:**
- Loan completion rate dropped from 82.0% → 64.1% at Week 9 (from brislane_primary_data.csv)
- Submit stage is where applications are lost (filter `status=CR_DEC` vs `status=SUBMITTED`)
- Support tickets spike from Week 9 onwards with session/logout mentions

**Release criteria to use (from company brief):**
- Loan completion rate ≥ 90%
- Automated test pass rate > 95%
- Open critical defects = 0
- API failure rate < 2%
- Defect leakage < 10%

---

### Phase 3 — API Testing (Postman)

**Import the collection:**
```
https://raw.githubusercontent.com/alain-Sortnext/brislane-lending-platform/main/api/postman_collection.json
```
Or drag `api/postman_collection.json` from your cloned repo into Postman.

**Live API base URL** (already set in collection):
```
https://brislane-lending-platform.vercel.app
```

**Steps:**
1. Import the collection into Postman
2. Run **🔐 1. POST Login** first — saves your token automatically
3. Run the 5 contract tests in order
4. Run the 5 security tests (SEC-1 to SEC-5)
5. Open `brislane_operational_report.csv` from the data room
6. Filter for `endpoint = /loans/submit`, weeks from `2026-06-08` onwards
7. Calculate: `sum(token_exp) / sum(fail_total)` — this is your key finding

---

### Phase 4 — Database Testing (Neon PostgreSQL)

**Setup (free, no credit card):**
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a project named `brislane-qa`
3. Open the **SQL Editor** in your Neon dashboard
4. Run `database/schema.sql` — creates all 5 tables
5. Run `database/seed.sql` — populates test data
6. Run `database/validation_queries.sql` — your Phase 4 submission queries

**What to look for:**
- `LA-TEST-00005` has a **missing audit event** (regulatory gap — this is intentional)
- `LA-TEST-00004` has a **missing fraud check** (async lag — also intentional)

**Recommended SQL clients:**
- Neon SQL Editor (in browser — easiest)
- [TablePlus](https://tableplus.com) (free tier, Mac/Windows)
- [DBeaver](https://dbeaver.io) (free, all platforms)
- `psql` in terminal

---

### Phase 5 — Defect Discovery, RCA & Performance Investigation

**What to log as Jira defects (minimum 15):**

You need defects from ALL phases — not just Phase 5. Go back through your previous work and log everything you found:

| Source | What to log | Suggested severity |
|--------|-------------|-------------------|
| Phase 3 Postman | TOKEN_EXP causing 40.8% of submit failures | Critical |
| Phase 3 Postman | Rate limiting not enforced on /loans/submit | High |
| Phase 3 Postman | Session timeout behaviour not documented | Medium |
| Phase 4 Database | LA-TEST-00005 missing funded audit event (FCA regulatory gap) | Critical |
| Phase 4 Database | LA-TEST-00004 missing fraud check (async lag) | High |
| Phase 6 Framework | waitForTimeout hardcoded in LoginPage.ts | High |
| Phase 6 Framework | Duplicate selectors across LoginPage and PaymentsPage | Medium |
| Phase 6 Framework | Broken assertion in login.spec.ts | High |
| Phase 6 Framework | submit.spec.ts.skip — entire journey skipped | Critical |
| Phase 6 Framework | No auth fixture — UI re-login per test | High |
| Phase 6 Framework | OldUploadPage.ts dead code | Low |
| Phase 6 Framework | logger.ts unused import | Low |
| Phase 6 Framework | date.ts and dateHelper.ts duplicate | Low |
| Phase 6 Framework | CI browser install step commented out | High |
| Phase 7 Accessibility | Any WCAG violations found by axe-core | Medium/High |

**For the RCA report — the evidence chain:**
1. Open `brislane_primary_data.csv` → completion drops Week 9 at SUBMIT stage
2. Open `brislane_secondary_data.csv` → filter submission tickets → look for "logged out" / "session" in descriptions
3. Open `brislane_operational_report.csv` → filter `endpoint=/loans/submit`, weeks from `2026-06-08` → calculate `sum(token_exp)/sum(fail_total)` = ~40.8%
4. Note the `deploy_ref` column for Week 9 → AUTH-SVC 2.4.0 on 2026-06-08

**For the Miro RCA board:**
Create a board named `Brislane RCA — Keystone` with these sections:
- Surface Symptom → Funnel data showing 64.1% completion
- Misleading indicator → VALID_422 (17%) — NOT the root cause
- Evidence chain → API log TOKEN_EXP 40.8% post-deploy
- Deploy correlation → AUTH-SVC 2.4.0 on 2026-06-08
- Root cause conclusion → one sentence
- Fix recommendation → extend JWT TTL or add token refresh

**For DevTools performance investigation:**
1. Open Chrome
2. Go to `https://alain-sortnext.github.io/brislane-lending-platform/`
3. Open DevTools → Network tab
4. Reload the page and observe waterfall
5. Note: TTFB, total load time, any large resources
6. Screenshot the waterfall and include in your submission

---

### Phase 6 — Framework Engineering (Playwright)

The framework refactor is prepared on `feature/playwright-framework-refactor`.

**Architecture and certification docs**
- `docs/architecture/playwright-framework.md`
- `docs/architecture/framework-certification-checklist.md`
- `docs/architecture/framework-refactor-pr.md`

**Configuration**
- Set `TEST_ENV=dev|qa|uat`.
- Set the selected environment's `<ENV>_BASE_URL` (web app URL), `<ENV>_API_BASE_URL` (optional separate API URL), `<ENV>_TEST_USER_EMAIL`, and `<ENV>_TEST_USER_PASSWORD`.
- Provide credentials through approved environment secrets. Local `.env` files are not used.
- Confirm `AUTH_LOGIN_PATH`, `AUTH_TOKEN_JSON_PATH`, `AUTH_TOKEN_STORAGE`, and `AUTH_TOKEN_STORAGE_KEY` with the API/application owners before execution.

**Framework rules**
- Use the API auth fixture rather than repeated UI login.
- Keep selectors inside `src/pages/`; test specs should call behaviour methods rather than use raw locators.
- Use web-first assertions rather than fixed sleeps.
- Run `npm run typecheck` before executing tests.
- Use only synthetic data and authorised non-production targets.

**Certification caveat:** Login route/payload, token storage and page selectors are integration points and must be confirmed. A lockfile is still needed for reproducible `npm ci`. The framework is not certified until DEV/QA runs and the checklist evidence are reviewed.

---

### Phase 7 — Automation Engineering

**Run the API journey tests:**
```bash
npx playwright test --project=qa-api-chromium
```
Replace `qa` with the selected `TEST_ENV` prefix (`dev`, `qa`, or `uat`). Browser UI suites are named `<environment>-chromium`, `<environment>-firefox`, and `<environment>-webkit`.

**View the HTML report:**
```bash
npx playwright show-report
```

Run only against authorised non-production targets with synthetic data. The login contract and selectors must be verified before interpreting an E2E run as certification evidence.

---

### Phase 8 — CI/CD & Quality Gates

The updated workflow is `.github/workflows/ci.yml`.

- Pull requests run dependency installation and TypeScript checks only; they do not need access to test credentials.
- End-to-end tests run only via **Actions → Playwright quality gate → Run workflow**, after selecting `dev`, `qa`, or `uat`.
- Configure GitHub Environments with the matching `<ENV>_BASE_URL` and optional `<ENV>_API_BASE_URL` variables, synthetic test account secrets, and auth-contract variables.
- Reports, JUnit results, and failure diagnostics are uploaded as workflow artifacts.
- The repository has no lockfile yet; workflow currently uses `npm install`. Generate and commit a lockfile using the approved dependency registry before changing to `npm ci`.

Do not run against production or use real customer data. A green static check is not evidence that the E2E suite passes; execute the manual environment workflow and inspect its artifacts.

---

### Phase 9 — Release Board & Quality Leadership

**Full guide:** See `phase-9/quality-metrics-template.md` in this repo.

**Step 1 — Calculate your 7 metrics:**
Open `phase-9/quality-metrics-template.md` — it shows exactly how to calculate each metric from your simulation work.

**Step 2 — Build your dashboard:**
- Google Sheets (free, all platforms): copy metrics table → add RAG colours → Share → Anyone with link
- Power BI Desktop (free, Windows): import xlsx → build cards → Publish to Power BI Service

**Step 3 — Write your Go/No-Go recommendation:**
- Recommended decision: **NO-GO (conditional)**
- Primary evidence: 64.1% completion (target 90%), TOKEN_EXP 40.8% of submit failures
- Conditions: JWT TTL extended + Postman re-test passes + CI > 95%
- Address all 4 stakeholders by name: Marcus Reed, Priya Nair, David Mensah, Lena Fischer

**Step 4 — Answer 6 STAR interview questions:**
Every answer must cite at least one Brislane figure. Key figures are in `phase-9/quality-metrics-template.md`

**Your dashboard URL** (evidence for submission):
- Google Sheets: `https://docs.google.com/spreadsheets/d/[id]/edit?usp=sharing`
- Power BI: `https://app.powerbi.com/...`

---

## Data Room
All data files and Tom's handover notes:
`https://alain-sortnext.github.io/brislane-lending-platform/`

## Live Mock API
`https://brislane-lending-platform.vercel.app`

## Support
If you are stuck, check the phase instructions in the simulation first, then the relevant section of this README.

