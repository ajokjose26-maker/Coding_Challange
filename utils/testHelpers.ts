import type { AppFixtures } from '../fixtures/test-fixtures';
import type { EmployeeData } from './testDataUtils';
import * as path from 'node:path';

const profileImagePath = path.resolve(__dirname, '../test-data/profile_image.jfif');

export function createUniqueEmployeeData(employeeTemplate: EmployeeData): EmployeeData {
  return {
    ...employeeTemplate,
    firstName: `${employeeTemplate.firstName}`,
    employeeId: `${employeeTemplate.employeeId}`,
  };
}

export async function loginToDashboard(loginPage: AppFixtures['loginPage']): Promise<void> {
  await loginPage.goto();
  await loginPage.verifyLoginPageLoaded();
  await loginPage.login(
    process.env.ORANGEHRM_USERNAME || 'Admin',
    process.env.ORANGEHRM_PASSWORD || 'admin123',
  );
}


export async function addEmployee(
  pageObjects: Pick<AppFixtures, 'dashboardPage' | 'pimPage' | 'addEmployeePage' | 'employeeDetailsPage'>,
  employee: EmployeeData,
): Promise<void> {
  await pageObjects.pimPage.gotoAddEmployee();
  const fillEmployeeForm = async () => {
    await pageObjects.addEmployeePage.fillEmployeeDetails(
      employee.firstName,
      employee.middleName,
      employee.lastName,
      employee.employeeId,
    );
    await pageObjects.addEmployeePage.uploadProfileImage(profileImagePath);
  };

  await fillEmployeeForm();
  const employeeCreated = await pageObjects.addEmployeePage.saveEmployee();

  if (!employeeCreated) {
    await pageObjects.dashboardPage.gotoPIM();
    await pageObjects.employeeDetailsPage.searchForEmployee(employee.firstName, employee.employeeId);
    await pageObjects.employeeDetailsPage.deleteEmployee();
    await pageObjects.pimPage.gotoAddEmployee();
    await fillEmployeeForm();
    await pageObjects.addEmployeePage.saveEmployee();
  }

  await pageObjects.addEmployeePage.verifyEmployeeCreated();
}


export async function verifyEmployeeDetails(
  employeeDetailsPage: AppFixtures['employeeDetailsPage'],
  expectedEmployee: EmployeeData,
): Promise<void> {
  await employeeDetailsPage.verifyPersonalDetailsLoaded();
  await employeeDetailsPage.verifyEmployeeName(
    expectedEmployee.firstName,
    expectedEmployee.lastName,
  );
  await employeeDetailsPage.verifyEmployeeId(expectedEmployee.employeeId);
}