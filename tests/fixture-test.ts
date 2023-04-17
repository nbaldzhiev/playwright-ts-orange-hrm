import { test as base } from '@playwright/test';
import { LoginPage } from '../utils/pages/login';

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto('/');
    await use(loginPage);
  },
});
export { expect } from '@playwright/test';