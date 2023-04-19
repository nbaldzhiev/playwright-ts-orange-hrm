import { test as base } from '@playwright/test';
import { AppUI } from '../utils/pages/app';

type MyFixtures = {
    appUI: AppUI;
    authAppUI: AppUI;
};

export const test = base.extend<MyFixtures>({
    appUI: async ({ page }, use) => {
        const appUI = new AppUI(page);
        await page.goto('/');
        await use(appUI);
    },
    authAppUI: async ({ page }, use) => {
        const authAppUI = new AppUI(page);
        await page.goto('/');
        await authAppUI.loginPage.login();
        await authAppUI.adminPage.sideMenu.assertThat.allMenuItemsAreVisible();
        await use(authAppUI);
    },
});
export { expect } from '@playwright/test';
