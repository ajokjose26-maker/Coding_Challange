# OrangeHRM Automation Framework

This project implements a professional end-to-end UI automation framework for the OrangeHRM demo application. It follows the QA Automation Technical Assessment requirements and uses Playwright with TypeScript and the Page Object Model (POM).

## Features

- Login, navigation, and employee workflow automation
- Real UI execution against the OrangeHRM demo website
- Page Object Model design
- JSON-based test data
- API validation using Playwright APIRequestContext
- Profile image upload from test data
- HTML reporting and failure artifacts
- Video recording for every test and screenshots on failure
- Clear project structure and documentation

## Project structure

```text
orangehrm-automation/
├── api/
│   └── employeeApi.ts
├── fixtures/
│   └── test-fixtures.ts
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── PIMPage.ts
│   ├── AddEmployeePage.ts
│   └── EmployeeDetailsPage.ts
├── test-data/
│   ├── employee.json
│   └── profile_image.jfif
├── tests/
│   └── employee-lifecycle.spec.ts
├── utils/
│   ├── apiUtils.ts
│   ├── fileUtils.ts
│   ├── testDataUtils.ts
│   └── testHelpers.ts
├── .gitignore
├── AI_GUIDELINES.md
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

## Prerequisites

- Node.js 18+
- npm
- Browser runtime installed via Playwright

## Setup Instructions

```bash
npm install
npx playwright install chromium
```

For local configuration, copy `.env.example` to `.env` and update the values if needed. Real `.env` files are ignored by Git.

## Framework Structure

- `tests/`: End-to-end Playwright scenarios.
- `pages/`: Page Object Model classes for OrangeHRM screens.
- `fixtures/`: Shared Playwright fixtures that construct page objects.
- `api/`: OrangeHRM API client and clearly labeled simulated API client.
- `utils/`: Test data readers and reusable workflow helpers.
- `test-data/`: JSON employee data and profile image used by the UI test.
- `playwright.config.ts`: Browser, timeout, reporter, video, and output configuration.
- `azure-pipelines.yml`: Azure CI setup and artifact publishing.

## How to Run Tests

```bash
npm test
```

Run the lifecycle test with a visible browser:

```bash
npm run test:headed
```

Run only the lifecycle test:

```bash
npx playwright test tests/employee-lifecycle.spec.ts
```

## Generate HTML report

```bash
npm run report
```

Azure Pipelines is configured in `azure-pipelines.yml`. It installs Node.js and Chromium, type-checks the project, runs the tests, and publishes the JUnit results, HTML report, videos, and traces as pipeline artifacts.

To type-check the project without running tests:

```bash
npm run typecheck
```

## Dependencies Used

- `@playwright/test`: Browser automation, test runner, assertions, API requests, HTML reporting, and video recording.
- `TypeScript`: Static typing and compilation checks.
- `dotenv`: Loads local `.env` configuration values.
- `@types/node`: Node.js type definitions for TypeScript utilities and file handling.

Test videos are recorded for every test and attached to the HTML report. Video files are also stored under `test-videos/` as `.webm` artifacts.

## Assessment notes

The main lifecycle test runs these steps in order:

```text
Login -> Add Employee -> Edit Employee -> API Validation -> Delete Employee -> Logout
```

The OrangeHRM UI actions are real. The API step uses the separately named `API Validation - simulated public API` flow with JSONPlaceholder because the public OrangeHRM demo does not provide stable employee mutation API support. This simulated response does not represent the OrangeHRM employee database. The OrangeHRM API client remains available for read-only endpoint inspection.
