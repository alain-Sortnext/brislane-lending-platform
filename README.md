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

**What's broken in this repo (find them all):**
1. `waitForTimeout` hardcoded in multiple page objects
2. Duplicate selectors across LoginPage and PaymentsPage
3. Broken assertion in `tests/auth/login.spec.ts`
4. `tests/loan/submit.spec.ts.skip` — entire spec skipped
5. No auth fixture — every test logs in via UI
6. `src/pages/OldUploadPage.ts` — dead code
7. `utils/logger.ts` — imported nowhere
8. `utils/date.ts` AND `utils/dateHelper.ts` — duplicate utility
9. No environment management (DEV/QA/UAT)
10. `.github/workflows/ci.yml` — browser install step commented out
11. No retry logic configured

**Your branch:**
```bash
git checkout -b phase-6-framework-refactor
```

**storageState setup** (replaces UI login per test):

The repo includes `global-setup.ts` and `fixtures/auth.fixture.ts` — already built for you.

**Phase 6 task:** Wire them up:

1. Open `playwright.config.ts`
2. Uncomment this line:
```typescript
globalSetup: './global-setup.ts',
```
3. Now use the auth fixture in your tests instead of UI login:
```typescript
import { test, expect } from '../fixtures/auth.fixture';

test('authenticated request', async ({ authenticatedRequest }) => {
  const response = await authenticatedRequest.get('/customers');
  expect(response.status()).toBe(200);
});
```
4. Run `npx playwright test` — global-setup logs in once, saves `auth.json`, all tests use it

---

### Phase 7 — Automation Engineering

**What to automate:**
Use Playwright's API testing capabilities to automate the loan journey against the mock API:
```typescript
const response = await request.post(`${process.env.BASE_URL}/loans/applications`, {
  headers: { Authorization: `Bearer ${token}` },
  data: { customer_id: 'C1TEST001', loan_amount: 5000, loan_term_months: 24 }
});
```

**For accessibility testing** — run axe-core against the data room:
```typescript
await page.goto('https://alain-sortnext.github.io/brislane-lending-platform/');
await injectAxe(page);
await checkA11y(page);
```

**Cross-browser and viewport** — configure in `playwright.config.ts`:
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  { name: 'mobile',   use: { ...devices['Pixel 5'] } },
]
```

---

### Phase 8 — CI/CD & Quality Gates

**Step 1 — Enable GitHub Actions on your fork:**
1. Go to your fork on GitHub
2. Click the **Actions** tab
3. Click **I understand my workflows, go ahead and enable them**

**Step 2 — Fix the broken workflow:**

Open `.github/workflows/ci.yml`. You'll see this broken line:
```yaml
# BUG: browsers are never installed, so the run fails.
# - run: npx playwright install --with-deps
```

Your fixed workflow should look like this:
```yaml
name: CI

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npm test
        env:
          BASE_URL: https://brislane-lending-platform.vercel.app

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

**Step 3 — Define your quality gates:**

Add a quality gates section to your submission documenting these thresholds:

| Gate | Threshold | How enforced |
|------|-----------|-------------|
| Critical defects | 0 | Check Jira before deploy |
| Automated pass rate | > 95% | From Playwright HTML report |
| API failure rate | < 2% | From operational report CSV |

**Step 4 — Push and get your run URL:**
```bash
git add .github/workflows/ci.yml
git commit -m "fix: add missing browser install step to CI pipeline"
git push origin main
```

Then go to your fork → **Actions** tab → click the running workflow → copy the URL.

**Your workflow run URL** (evidence for submission):
```
https://github.com/YOUR-USERNAME/brislane-lending-platform/actions/runs/[number]
```

---

### Phase 9 — Release Dashboard

**quality-metrics.xlsx** — create a spreadsheet with these columns:

| Metric | Current Value | Target | RAG Status |
|--------|--------------|--------|------------|
| Automated pass rate | (from your Phase 7/8 run) | > 95% | 🔴/🟡/🟢 |
| Defect density | (defects ÷ features tested) | TBD | |
| Defect leakage | (prod defects ÷ total defects × 100) | < 10% | |
| Automation coverage | (automated ÷ total cases × 100) | Measured | |
| Defect reopen rate | (reopened ÷ closed × 100) | < 5% | |
| Open critical bugs | (count from Jira) | 0 | |
| Defects by severity | Crit: / High: / Med: / Low: | | |

**Publish your dashboard:**
- Power BI: Publish → Power BI Service → Get shareable link
- Google Sheets: Share → Anyone with link → Copy link

---

## Data Room
All data files and Tom's handover notes:
`https://alain-sortnext.github.io/brislane-lending-platform/`

## Live Mock API
`https://brislane-lending-platform.vercel.app`

## Support
If you are stuck, check the phase instructions in the simulation first, then the relevant section of this README.
