import { Page, Locator, expect } from '@playwright/test';

export class EmployeeDetailsPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly employeeNameHeading: Locator;
  readonly jobTitledropDown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.jobTitledropDown = page.getByText('-- Select --').first();
    this.saveButton = page.getByRole('button', { name: 'Save' }).last();
    this.deleteButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(4);
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
    this.employeeNameHeading = page.locator('h6:has-text("Personal Details")');
  }

  async editEmployeeDetails() {
    const editButton = this.page.getByRole('button').filter({ hasText: /^$/ }).nth(3);
    const jobEditButton = this.page.getByRole('link', { name: 'Job' });
    await expect(editButton).toBeVisible();
    await editButton.click();
    await expect(jobEditButton).toBeVisible();
    await jobEditButton.click();
  }


  async updateJobTitle(jobTitle: string) {
    const jobStatusDropDown = this.page.locator('.oxd-input-group')
    .filter({has: this.page.locator('.oxd-label').getByText('Job Title', { exact: true }),
    })
    .locator('.oxd-select-text');
    await this.editEmployeeDetails();
    await expect(this.jobTitledropDown).toBeVisible();
    await this.jobTitledropDown.click();
    await this.page.getByRole('option', { name: jobTitle, exact: true }).click();
    await expect(jobStatusDropDown).toBeVisible();
    await jobStatusDropDown.click();
    const employmentStatusDropdown = this.page.locator('.oxd-input-group').filter({has: this.page.locator('.oxd-label').getByText('Employment Status', { exact: true }),
    })
    .locator('.oxd-select-text');
    await expect(employmentStatusDropdown).toBeVisible();
    await employmentStatusDropdown.click();
    await this.selectDropdownOption('Full-Time Permanent');
    await this.saveButton.click();
    await this.page.getByText('Successfully Updated').waitFor({ state: 'visible' });
  }

  async selectDropdownOption(optionText: string) {
    await this.page.getByRole('option', { name: optionText, exact: true }).click();
  }

  async deleteEmployee() {
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
    await this.page.waitForURL(/\/pim\/(viewEmployeeList|viewPimModule)/, {
      waitUntil: 'domcontentloaded',
      timeout: 100000,
    });
    await expect(this.page).toHaveURL(/\/pim\/(viewEmployeeList|viewPimModule)/);
  }

  async verifyPersonalDetailsLoaded() {
    await this.employeeNameHeading.waitFor({ state: 'visible' });
  }

  async verifyEmployeeName(firstName: string, lastName: string) {
    const fullName = `${firstName} ${lastName}`;
    await this.page.getByText(fullName, { exact: false }).waitFor({ state: 'visible' });
  }

  async verifyEmployeeId(employeeId: string) {
    await this.page.getByText(employeeId, { exact: true }).waitFor({ state: 'visible' });
  }

  async searchForEmployee(firstName: string, employeeId: string) {
    const searchNameInput = this.page.locator('input[placeholder="Type for hints..."]').first();
    const searchIdInput = this.page.getByRole('textbox').nth(2);
    const searchButton = this.page.getByRole('button', { name: 'Search' });
    const employeeTable = this.page.locator('.orangehrm-container');
    const employeeNameCell = this.page.getByRole('cell', { name: firstName }).first()
    await searchNameInput.fill(`${firstName}`);
    await searchIdInput.fill(`${employeeId}`);
    await searchButton.click();
    await this.page.waitForTimeout(1000); // Wait for the search results to load
    await expect(employeeTable).toBeVisible();
    await expect(employeeNameCell).toBeVisible();
  
  }
}
