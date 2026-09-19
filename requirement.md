#  AI Implementation Guidelines

## 1. Objective

Build a complete, professional UI automation framework for the following QA Automation Technical Assessment.

The solution must demonstrate:

- UI automation
- End-to-end functional testing
- Page Object Model (POM)
- Data-driven testing
- API validation
- Reusable utilities
- Meaningful assertions
- Clean coding practices
- HTML reporting
- Video recording
- Performance testing
- Proper project structure
- README documentation

The final project should be realistic enough to submit as a technical assessment.

---

# 2. Application Under Test

Use the OrangeHRM demo application:

https://opensource-demo.orangehrmlive.com/

Credentials:

- Username: `Admin`
- Password: `admin123`

Primary workflow:

**Login → Add Employee → Edit Employee → API Validation → Delete Employee → Logout**

---

# 3. Preferred Technology Stack

Use the following stack unless there is a strong technical reason to change it:

- Language: TypeScript
- Automation: Playwright
- Test Runner: Playwright Test
- Design Pattern: Page Object Model
- API Testing: Playwright APIRequestContext
- Test Data: JSON
- Reporting: Playwright HTML Report
- Video: Playwright video recording
- Package Manager: npm

Do NOT use Selenium if Playwright + TypeScript can satisfy the requirements.

---

# 4. Important Implementation Rule

Do not create a fake implementation just to satisfy the assessment.

The automation must actually interact with the OrangeHRM website.

The following must be real where supported:

- Login
- Navigation
- Employee creation
- Employee search
- Employee editing
- Employee deletion
- Logout
- UI assertions
- API requests

If the OrangeHRM public demo does not expose a stable/public API endpoint for a particular employee operation, do NOT invent an OrangeHRM API.

Instead:

1. Clearly document the limitation.
2. Identify the actual API behavior available from the application.
3. Use Playwright APIRequestContext or another appropriate API mechanism where technically possible.
4. If a public API must be used as a substitute, clearly separate it from the OrangeHRM UI test and document that it is a simulated API validation.
5. Never falsely claim that a third-party API represents the OrangeHRM employee database.

---

# 5. Project Structure

Create a professional structure similar to:

```text
orangehrm-automation/
│
├── tests/
│   └── employee-lifecycle.spec.ts
│
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── PIMPage.ts
│   ├── AddEmployeePage.ts
│   └── EmployeeDetailsPage.ts
│
├── fixtures/
│   └── test-fixtures.ts
│
├── test-data/
│   ├── employee.json
│   └── profile_image.jfif
│
├── utils/
│   ├── testDataUtils.ts
│   ├── apiUtils.ts
│   ├── fileUtils.ts
│   └── testHelpers.ts
│
├── api/
│   └── employeeApi.ts
├── performance/
│   └── orangehrm-smoke.js
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── README.md
├── .gitignore
└── AI_GUIDELINES.md
```

---

# 6. Implementation Status

The framework implements the primary workflow in one ordered Playwright test:

**Login → Add Employee → Edit Employee → API Validation → Delete Employee → Logout**

Implemented capabilities include:

- Real OrangeHRM UI login, navigation, employee creation, profile-image upload, editing, searching, deletion, and logout.
- Page Object Model classes under `pages/`.
- JSON-driven employee data under `test-data/`.
- Reusable workflow helpers under `utils/testHelpers.ts`.
- Playwright HTML reporting.
- Video recording for every test, stored in `test-videos/` and linked from the HTML report.
- k6 read-only performance smoke testing for the OrangeHRM login page.
- Explicit assertions for page state, employee details, API response fields, and logout navigation.

## API limitation

The OrangeHRM public demo exposes a read-oriented employee endpoint, but stable public mutation endpoints are not available for this assessment. The framework does not claim that a third-party response represents the OrangeHRM employee database.

The test named `API Validation - simulated public API` uses JSONPlaceholder through Playwright `APIRequestContext` as a clearly labeled API contract simulation. OrangeHRM employee create, edit, and delete operations remain real UI actions.

## Execution

```bash
npm install
npx playwright install chromium
npx playwright test
npx playwright show-report
```

Performance testing can be run separately with k6:

```bash
npm run performance
```

The k6 scenario uses read-only login-page requests and does not represent a production capacity benchmark.

---

# 7. Evaluator Quick Guide

| What to review | Location |
|---|---|
| Main end-to-end workflow | `tests/employee-lifecycle.spec.ts` |
| Login and logout page actions | `pages/LoginPage.ts`, `pages/DashboardPage.ts` |
| Employee creation and image upload | `pages/AddEmployeePage.ts` |
| Employee search, edit, and delete actions | `pages/EmployeeDetailsPage.ts`, `pages/PIMPage.ts` |
| Reusable test setup and workflow helpers | `utils/testHelpers.ts` |
| Data-driven employee values | `test-data/employee.json` |
| Profile image used by the UI test | `test-data/profile_image.jfif` |
| API clients and API validation | `api/employeeApi.ts` |
| Playwright timeout, video, report, and browser settings | `playwright.config.ts` |

To review the complete assessment flow, run `npx playwright test`. The HTML report is available with `npx playwright show-report`; each test includes a recorded video under the report attachments and in `test-videos/`.