import { expect, test } from './fixture-test';

test.describe('PIM Page', () => {

  let createdEmployeeIds: number[] = [];

  test.beforeEach(async ({ authAppUI }) => {
    await authAppUI.adminPage.sideMenu.openPIMPage();
  });

  test.afterAll(async ({ authAppUI }) => {
    // Delete all employees created. This operation is much better performed via the API, but this demo app
    // doesn't have any documentation about authorization/usage of the API, so it doesn't seem properly exposed
    await authAppUI.adminPage.sideMenu.openPIMPage();
    for (const id of createdEmployeeIds) {
      await authAppUI.pimPage.filterEmployeesByEmployeeId(id);
      await authAppUI.pimPage.recordsTable.assertThat.numberOfRowsIsCorrect(1);
      await authAppUI.pimPage.recordsTable.deleteRowByIndex(1);
      await authAppUI.pimPage.filterEmployeesByEmployeeId(id);
      await authAppUI.pimPage.recordsTable.assertThat.numberOfRowsIsCorrect(0);
    }
  })

  test('Should be able to add a new employee', async ({ authAppUI }) => {
    const employeeId = parseInt(Date.now().toString().substring(1, 10));

    await authAppUI.pimPage.clickOnAddEmployeeBtn();
    await authAppUI.pimPage.addEmployeeForm.addNewEmployee(
      { firstName: 'dummy', middleName: 'bot', lastName: 'user', employeeId: employeeId }
    )
    await expect(authAppUI.page).toHaveURL(/\/empNumber\/[0-9]+$/);

    await authAppUI.adminPage.sideMenu.openPIMPage();
    await authAppUI.pimPage.filterEmployeesByEmployeeId(employeeId);
    await authAppUI.pimPage.recordsTable.assertThat.numberOfRowsIsCorrect(1);
    await authAppUI.pimPage.recordsTable.assertThat.employeeFirstMiddleNamesAreCorrect({ names: 'dummy bot' });
    await authAppUI.pimPage.recordsTable.assertThat.employeeLastNameIsCorrect({ name: 'user' });
    await authAppUI.pimPage.recordsTable.assertThat.employeeIdIsCorrect({ employeeId: employeeId });

    createdEmployeeIds.push(employeeId);
  });

});