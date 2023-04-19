import { expect, test } from './fixture-test';
import { Page } from '@playwright/test';
import { AppUI } from '../utils/pages/app';

test.describe('PIM Page', () => {

  let createdEmployeeIds: number[] = [];
  const userFirstName: string = 'dummy';
  const userMiddleName: string = 'bot';

  test.beforeEach(async ({ authAppUI }) => {
    // Open the PIM page before each test
    await authAppUI.adminPage.sideMenu.openPIMPage();
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
    for (const id of createdEmployeeIds) {
      await appUI.pimPage.deleteEmployeeAndAssertDeletion(id);
    }
  })

  test('Should be able to add a new employee', async ({ authAppUI }) => {
    const employeeId: number = parseInt(Date.now().toString().substring(1, 10));
    const userLastName: string = employeeId.toString();

    await authAppUI.pimPage.clickOnAddEmployeeBtn();
    await authAppUI.pimPage.addEmployeeForm.addNewEmployee(
      { firstName: userFirstName, middleName: userMiddleName, lastName: userLastName, employeeId: employeeId }
    )
    await expect(authAppUI.page).toHaveURL(/\/empNumber\/[0-9]+$/);

    await authAppUI.adminPage.sideMenu.openPIMPage();
    await authAppUI.pimPage.filterEmployeesByEmployeeId(employeeId);
    await authAppUI.pimPage.recordsTable.assertThat.numberOfRowsIsCorrect(1);
    await authAppUI.pimPage.recordsTable.assertThat.employeeFirstMiddleNamesAreCorrect(
      { names: `${userFirstName} ${userMiddleName}` }
    );
    await authAppUI.pimPage.recordsTable.assertThat.employeeLastNameIsCorrect({ name: userLastName });
    await authAppUI.pimPage.recordsTable.assertThat.employeeIdIsCorrect({ employeeId: employeeId });

    createdEmployeeIds.push(employeeId);
  });

});