import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 100000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  retries: 1,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  outputDir: 'test-videos',
  use: {
    baseURL: process.env.ORANGEHRM_BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    actionTimeout: 100000,
    navigationTimeout: 100000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on',
    headless: true,
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 1200 },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        video: 'on',
      },
    },
  ],
});
