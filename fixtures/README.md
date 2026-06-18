# Fixtures

NOT DOCUMENTED / mostly missing.

There is no shared authentication fixture. Every test logs in through the UI from scratch,
which is slow and — relevantly — means tokens are minted fresh per test, so the submit
token-expiry problem doesn't reproduce reliably in automation. Building a proper
storageState / auth fixture is a Phase 6 job.
