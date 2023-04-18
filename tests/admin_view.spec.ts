import { test } from './fixture-test';

test.describe('Admin View', () => {

  test.beforeEach(async ({ authAppUI }) => {
    await authAppUI.adminPage.sideMenu.openAdminView();
  });

  test('Should be able to add a new user', async ({ authAppUI }) => {
    await authAppUI.adminPage.clickOnAddUserBtn();
    const epoch = Date.now();
    await authAppUI.adminPage.addUserForm.addNewUser(
      { userRole: 'Admin', employeeName: 'Dummy Employee', status: 'Enabled', username: `dummy-employee-${epoch}` }
    )
  });

});