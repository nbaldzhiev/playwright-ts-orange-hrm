import { test, expect } from './fixture-test';

test.describe('Login', () => {

  test('Should not be able to log in with incorrect credentials', async ({ loginPage }) => {
    await loginPage.login({ username: `idontexist-${Date.now()}`, password: 'idontexist' });
    await loginPage.assertThat.invalidCredentialsMsgExists();
    await loginPage.assertThat.allElementsExist();
  });

  test('Should not be able to login without credentials', async ({ loginPage }) => {
    await loginPage.clickLoginBtn();
    await loginPage.assertThat.numOfRequiredMsgsIsCorrect(2);
    await loginPage.assertThat.allElementsExist();
  });

});