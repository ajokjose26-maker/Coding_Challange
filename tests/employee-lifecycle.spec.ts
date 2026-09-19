import { test, expect } from '../fixtures/test-fixtures';
import { getEmployeePayload, getUpdatedEmployeePayload } from '../utils/testDataUtils';
import { addEmployee, createUniqueEmployeeData, loginToDashboard } from '../utils/testHelpers';
import { EmployeeApi, SimulatedEmployeeApi } from '../api/employeeApi';

const employeeTemplate = getEmployeePayload();
const updatedEmployee = getUpdatedEmployeePayload();

test.describe.configure({ timeout: 100_000 });

test.describe('OrangeHRM employee lifecycle', () => {
  test('Login → Add Employee → Edit Employee → API Validation → Delete Employee → Logout', async ({
    loginPage,
    dashboardPage,
    page,
    pimPage,
    addEmployeePage,
    employeeDetailsPage,
    request,
  }) => {
    const employee = createUniqueEmployeeData(employeeTemplate);

    // Step 1: Login to the OrangeHRM application.
    await loginToDashboard(loginPage);
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.gotoPIM();

    // Step 2: Add the employee through the UI, including the profile image.
    await addEmployee({ dashboardPage, pimPage, addEmployeePage, employeeDetailsPage }, employee);
    await expect(addEmployeePage.page).toHaveURL(/\/pim\/viewPersonalDetails\//);

    // Step 3: Search for the employee and update the job title through the UI.
    await dashboardPage.gotoPIM();
    await employeeDetailsPage.searchForEmployee(employee.firstName, employee.employeeId);
    await employeeDetailsPage.updateJobTitle(updatedEmployee.jobTitle ?? employee.jobTitle);

    // Step 4: Validate the employee payload through the clearly labeled simulated public API.
    const employeeApi = new SimulatedEmployeeApi(request);
    const apiEmployee = await employeeApi.createEmployee(employee);
    const apiEmployeeId = apiEmployee.employeeId;
    const apiFirstName = apiEmployee.firstName;
    const apiLastName = apiEmployee.lastName;
    const apiJobTitle = apiEmployee.jobTitle;
    const apiResourceId = apiEmployee.id;
    expect(apiResourceId, 'Simulated API should return a resource ID').toBeTruthy();
    expect(apiEmployeeId, 'API employee ID should match the submitted payload').toBe(employee.employeeId);
    expect(apiFirstName, 'API first name should match the submitted payload').toBe(employee.firstName);
    expect(apiLastName, 'API last name should match the submitted payload').toBe(employee.lastName);
    expect(apiJobTitle, 'API job title should match the submitted payload').toBe(employee.jobTitle);

    // Step 5: Delete the same employee through the UI.
    await dashboardPage.gotoPIM();
    await employeeDetailsPage.searchForEmployee(employee.firstName, employee.employeeId);
    await employeeDetailsPage.deleteEmployee();
    const orangeHrmApi = new EmployeeApi(page.request);
    const employeePresentAfterDelete = await orangeHrmApi.isEmployeePresent(employee.employeeId);
    expect(employeePresentAfterDelete, 'Deleted employee should not be returned by the OrangeHRM API').toBeFalsy();

    // Step 6: Logout and invalidate the UI session.
    await dashboardPage.logout();
  });
});
