import { test } from './fixture-test';

test.describe('PIM View', () => {

  test.beforeEach(async ({ authAppUI }) => {
    await authAppUI.adminPage.sideMenu.openPIMView();
  });

  test('Should be able to add a new employee', async ({ authAppUI }) => {
    await authAppUI.pimPage.clickOnAddEmployeeBtn();
    const employeeId = parseInt(Date.now().toString().substring(1, 10));
    await authAppUI.pimPage.addEmployeeForm.addNewEmployee(
      { firstName: 'dummy', middleName: 'bot', lastName: 'user', employeeId: employeeId }
    )

    await authAppUI.adminPage.sideMenu.openPIMView();
    await authAppUI.pimPage.filterEmployeesByEmployeeId(employeeId);
    await authAppUI.pimPage.recordsTable.assertThat.numberOfRowsIsCorrect(1);
    await authAppUI.pimPage.recordsTable.assertThat.employeeFirstMiddleNamesAreCorrect({ names: 'dummy bot' });
    await authAppUI.pimPage.recordsTable.assertThat.employeeLastNameIsCorrect({ name: 'user' });
    await authAppUI.pimPage.recordsTable.assertThat.employeeIdIsCorrect({ employeeId: employeeId });
  });

});