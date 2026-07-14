# Playwright Framework Architecture

## Project
Brislane Lending Platform – Project Keystone

## Refactoring Summary

This framework was refactored to improve maintainability, stability, and scalability for Sprint 3 automation.

### Key Improvements

- Implemented Page Object Model (POM) to encapsulate locators and actions.
- Introduced shared authentication using Playwright storageState.
- Configured separate DEV, QA, and UAT environments using Playwright projects.
- Removed hardcoded waits and replaced them with Playwright auto-waiting.
- Removed unused page objects and duplicate utility functions.
- Added retry logic for CI execution only.
- Improved reporting using HTML and List reporters.
- Prepared the framework for reliable CI/CD execution.

## Framework Principles

- No raw locators in tests.
- Authentication handled through fixtures.
- Environment configuration managed through environment variables.
- Retry only in CI.
- Reusable Page Objects.
- Maintainable automation architecture.