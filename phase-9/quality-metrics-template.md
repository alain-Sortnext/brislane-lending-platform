# Quality Metrics — Project Keystone
## Brislane PLC Release Board — 27 August 2026

Use this template to calculate your 7 metrics before building your dashboard.

---

## How to calculate each metric

### 1. Automated Test Pass Rate
```
Pass Rate = (Tests Passed / Total Tests Run) × 100
```
Source: Your Phase 7/8 Playwright HTML report | Target: > 95%

### 2. Defect Density
```
Defect Density = Total Defects / Features Tested
```
Source: Jira defect count ÷ 6 features (Login, Registration, Loan App, Submit, Payments, Notifications)

### 3. Defect Leakage
```
Leakage = (Production Defects / Total Defects) × 100
```
Source: TOKEN_EXP was in production = 1 escaped defect | Target: < 10%

### 4. Automation Coverage
```
Coverage = (Automated Tests / Total Jira Test Cases) × 100
```
Source: Your automated spec count ÷ Jira test cases (min 60)

### 5. Defect Reopen Rate
```
Reopen Rate = (Reopened / Closed) × 100
```
Source: Jira defect history | Target: < 5%

### 6. Defects by Severity
Count from your Jira:
- Critical: TOKEN_EXP issue, missing audit event, skipped submit spec
- High: Broken CI, hardcoded waits, no auth fixture
- Medium: Duplicate selectors, broken assertion
- Low: Dead code, unused logger, duplicate utils

### 7. Open Critical Bugs
Count of Critical defects still open in Jira | Target: 0

---

## Your Metrics Table

| Metric | Current Value | Target | RAG |
|--------|--------------|--------|-----|
| Automated pass rate | | > 95% | |
| Defect density | | TBD | |
| Defect leakage | | < 10% | |
| Automation coverage | | Measured | |
| Defect reopen rate | | < 5% | |
| Open critical bugs | | 0 | |
| Defects by severity | Crit: / High: / Med: / Low: | | |

---

## Dashboard Options

### Google Sheets (free, all platforms)
1. Copy metrics table above into a new Google Sheet
2. Add RAG colour coding (red/amber/green backgrounds)
3. Add bar chart showing defects by severity
4. Share → Anyone with the link → Copy link → paste in submission

### Power BI Desktop (free, Windows only)
1. Save metrics to quality-metrics.xlsx
2. Power BI Desktop → Get Data → Excel → build cards
3. Publish → Power BI Service → Get shareable link

---

## Go/No-Go — The 4 Stakeholders

| Stakeholder | Position | Your Evidence-Based Response |
|-------------|----------|------------------------------|
| Marcus Reed (Product) | Ship now | Shipping extends the £300k/month loss — submit still failing at 40.8% |
| Priya Nair (Engineering) | Known issues acceptable | Root cause proven but not fixed — TTL change needed |
| David Mensah (Compliance) | Risk too high | Agreed — token integrity gap evidenced, fix is specific and fast |
| Lena Fischer (Customer Success) | Complaints rising | Root cause proven, 3-5 day fix lower risk than shipping the known failure |

## Recommended Decision: NO-GO (conditional)
Conditions: (1) JWT TTL extended, (2) Postman re-test confirms 200, (3) CI passes >95%

---

## Key Figures for STAR Answers

| Figure | Value |
|--------|-------|
| Completion rate drop | 82.0% → 64.1% |
| TOKEN_EXP root cause | 40.8% of submit failures |
| Pre/post contrast | 5.9% → 40.8% |
| Deploy date | AUTH-SVC 2.4.0 on 2026-06-08 |
| Cost of gap | £300,000+/month |
| Framework tech debt | 11 items found and fixed |
| Stakeholders | Marcus Reed, Priya Nair, David Mensah, Lena Fischer |
