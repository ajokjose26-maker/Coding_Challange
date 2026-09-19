import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;
  readonly pimMenu: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardHeader = page.locator('h6:has-text("Dashboard")');
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutButton = page.locator('text=Logout');
    this.pimMenu = page.getByRole('link', { name: 'PIM' }).first();
  }

  async gotoPIM() {
    this.pimMenu.click();
    await this.page.waitForURL('**/pim/viewEmployeeList');
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutButton.click();
    await this.page.waitForURL('**/auth/login');
    await expect(this.page).toHaveURL(/\/auth\/login/);
  }

  async verifyDashboardLoaded() {
    await this.dashboardHeader.waitFor({ state: 'visible' });
  }
}
