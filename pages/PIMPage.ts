import { Page, Locator } from '@playwright/test';

export class PIMPage {
  readonly page: Page;
  readonly addEmployeeButton: Locator;
  readonly employeeListHeader: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly employeeTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addEmployeeButton = page.getByRole('button', { name: ' Add' });
    this.employeeListHeader = page.locator('h5:has-text("Employee List")');
    this.searchInput = page.locator('input[placeholder="Type for hints..."]');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.employeeTable = page.locator('.oxd-table');
  }

  async gotoAddEmployee() {
    await this.addEmployeeButton.click();
    await this.page.waitForURL('**/pim/addEmployee');
  }

  async searchEmployee(employeeName: string) {
    await this.searchInput.fill(employeeName);
    await this.searchButton.click();
    await this.employeeTable.waitFor({ state: 'visible' });
  }

  async verifyEmployeeVisible(employeeName: string) {
    await this.page.getByText(employeeName, { exact: false }).waitFor({ state: 'visible' });
  }
}
