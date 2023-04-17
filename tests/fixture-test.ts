import { test as base } from '@playwright/test';
import { AppUI } from '../utils/pages/app';

type MyFixtures = {
  appUI: AppUI;
};

export const test = base.extend<MyFixtures>({
  appUI: async ({ page }, use) => {
    const appUI = new AppUI(page);
    await page.goto('/');
    await use(appUI);
  },
});
export { expect } from '@playwright/test';