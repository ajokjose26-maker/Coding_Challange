import { Page, Locator, expect } from '@playwright/test';

export class AddEmployeePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly profileImageInput: Locator;
  readonly employeeIdError: Locator;
  readonly saveButton: Locator;
  readonly createLoginDetailsToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('input.oxd-input.oxd-input--active').nth(3);
    this.profileImageInput = page.locator('input[type="file"]');
    this.employeeIdError = page.getByText('Employee Id already exists', { exact: true });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.createLoginDetailsToggle = page.locator('input[type="checkbox"]').first();
  }

  async fillEmployeeDetails(firstName: string, middleName: string, lastName: string, employeeId: string) {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.middleNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.employeeIdInput).toBeVisible();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdInput.fill(employeeId);
  }

  async uploadProfileImage(filePath: string) {
    await expect(this.profileImageInput).toHaveCount(1);
    await this.profileImageInput.setInputFiles(filePath);
  }

  async saveEmployee(): Promise<boolean> {
    await this.saveButton.click();

    const result = await Promise.race([
      this.page.waitForURL(/\/pim\/viewPersonalDetails/, {
        waitUntil: 'domcontentloaded',
        timeout: 100000,
      }).then(() => true),
      this.employeeIdError.waitFor({ state: 'visible', timeout: 100000 }).then(() => false),
    ]);

    return result;
  }

  async verifyEmployeeCreated() {
    await this.page.locator('h6:has-text("Personal Details")').waitFor({ state: 'visible' });
  }
}
