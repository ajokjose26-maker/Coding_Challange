# AI Implementation Guidelines

This project follows the QA automation assessment instructions and uses the OrangeHRM demo site as the live system under test.

## Rules followed

- TypeScript + Playwright test runner
- Page Object Model with reusable page classes
- JSON-driven employee payloads
- HTML reporting via Playwright
- Video and screenshots on failure
- Real UI actions against the OrangeHRM demo app
- API validation when a stable endpoint is available

## Important limitation

OrangeHRM's public demo does not provide a stable official employee mutation API that can be safely relied on for assessment-grade CRUD validation. The framework therefore performs the actual create, update, and delete steps in the browser UI and uses a read-only API check when the application exposes a supported employee listing endpoint.

This keeps the implementation honest and avoids inventing fake OrangeHRM APIs.
