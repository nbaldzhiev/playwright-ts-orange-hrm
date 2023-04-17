import { test, expect } from './fixture-test';

test.describe('Login', () => {

  test('Should not be able to log in with incorrect credentials', async ({ loginPage }) => {
    await loginPage.login({ username: `idontexist-${Date.now()}`, password: 'idontexist' });
    await loginPage.assertThat.invalidCredentialsMsgExists();
    await loginPage.assertThat.allElementsExist();
  });


});