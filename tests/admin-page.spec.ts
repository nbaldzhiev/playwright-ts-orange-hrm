import { test } from './fixture-test';
import { Page } from '@playwright/test';
import { AppUI } from '../utils/pages/app';

test.describe('Admin Page', () => {
    const empId: number = parseInt(Date.now().toString().substring(1, 10));
    const empFirstName = 'dummy';
    const empMiddleName = 'bot';
    const empLastName = empId.toString();
    const empPassword = 'ABCabc123!';

    test.beforeAll(async ({ browser }) => {
        // Create one employee to be used throughout the admin tests
        const page: Page = await browser.newPage();
        const appUI: AppUI = new AppUI(page);
        await page.goto('/');
        await appUI.loginPage.login();
        await appUI.adminPage.sideMenu.assertThat.allMenuItemsAreVisible();
        await appUI.pimPage.sideMenu.openPIMPage();
        await appUI.pimPage.clickOnAddEmployeeBtn();
        await appUI.pimPage.addEmployeeForm.addNewEmployee({
            firstName: empFirstName,
            middleName: empMiddleName,
            lastName: empLastName,
            employeeId: empId,
        });
        await page.close();
    });

    test.beforeEach(async ({ authAppUI }) => {
        await authAppUI.adminPage.sideMenu.openAdminPage();
    });

    test.afterAll(async ({ browser }) => {
        // Delete all employees created after all tests have finished. This operation is much better performed via the
        // API, but this demo app doesn't have any documentation about authorization/usage of the API, so it doesn't seem
        // properly exposed
        const page: Page = await browser.newPage();
        const appUI: AppUI = new AppUI(page);
        await page.goto('/');
        await appUI.loginPage.login();
        await appUI.adminPage.sideMenu.openPIMPage();
        await appUI.pimPage.deleteEmployeeAndAssertDeletion(empId);
    });

    test('Should be able to add a new user', async ({ authAppUI }) => {
        const empUsername = `dummy-employee-${empId}`;
        const userRole = 'Admin';
        const status = 'Enabled';

        await authAppUI.adminPage.clickOnAddUserBtn();
        await authAppUI.adminPage.addUserForm.addNewUser({
            userRole: userRole,
            employeeName: `${empFirstName} ${empMiddleName} ${empLastName}`,
            status: status,
            username: empUsername,
            password: empPassword,
            confirmPassword: empPassword,
        });
        await authAppUI.adminPage.systemUsersFilter.filterUsersByUsername(empUsername);
        await authAppUI.adminPage.recordsTable.assertThat.numberOfRowsIsCorrect(1);
        await authAppUI.adminPage.recordsTable.assertThat.employeeNameIsCorrect({
            firstName: empFirstName,
            lastName: empLastName,
        });
        await authAppUI.adminPage.recordsTable.assertThat.employeeUsernameIsCorrect({ username: empUsername });
        await authAppUI.adminPage.recordsTable.assertThat.employeeUserRoleIsCorrect({ userRole: userRole });
        await authAppUI.adminPage.recordsTable.assertThat.employeeStatusIsCorrect({ status: status });
    });
});
