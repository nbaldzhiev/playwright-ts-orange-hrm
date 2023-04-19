/** This module contains an abstraction of the System Users filter widget present on the Admin page */
import { Page, Locator, expect } from '@playwright/test';

/** This class defines an abstraction of the system users filter widget present on the Admin page */
export class SystemUsersFilter {
    readonly parentSelector: string = 'div.oxd-table-filter';
    readonly usernameInput: Locator;
    readonly userRoleDdown: Locator;
    readonly employeeNameInput: Locator;
    readonly statusDdown: Locator;
    readonly searchBtn: Locator;
    readonly loader: Locator;

    constructor(page: Page) {
        this.usernameInput = page.locator(`${this.parentSelector} input.oxd-input`);
        this.userRoleDdown = page.locator(`${this.parentSelector} div > div.oxd-grid-item:nth-child(2)`);
        this.employeeNameInput = page.locator(`${this.parentSelector} input[placeholder*="for hints"]`);
        this.statusDdown = page.locator(`${this.parentSelector} div > div.oxd-grid-item:nth-child(4)`);
        this.searchBtn = page.locator(`${this.parentSelector} button[type="submit"]`);
        this.loader = page.locator('.oxd-loading-spinner-container');
    }

    /**
     * Fills the username input and clicks on the save button to filter by username
     * @param {string} username The username to filter by
     */
    async filterUsersByUsername(username: string) {
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
        await this.searchBtn.click();
        await expect(this.loader).toBeVisible();
        await expect(this.loader).toBeHidden();
    }
}
