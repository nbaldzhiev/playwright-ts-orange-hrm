import { test } from './fixture-test';

test.describe('Login', () => {
    test('Should not be able to log in with incorrect credentials', async ({ appUI }) => {
        await appUI.loginPage.login({ username: `idontexist-${Date.now()}`, password: 'idontexist' });
        await appUI.loginPage.assertThat.invalidCredentialsMsgExists();
        await appUI.loginPage.assertThat.allElementsExist();
    });

    test('Should not be able to login without credentials', async ({ appUI }) => {
        await appUI.loginPage.clickLoginBtn();
        await appUI.loginPage.assertThat.numOfRequiredMsgsIsCorrect(2);
        await appUI.loginPage.assertThat.allElementsExist();
    });

    test('Should be able to login with valid credentials', async ({ appUI }) => {
        await appUI.loginPage.login();
        await appUI.adminPage.sideMenu.assertThat.allMenuItemsAreVisible();
    });
});
