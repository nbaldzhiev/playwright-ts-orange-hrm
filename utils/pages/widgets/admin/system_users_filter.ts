/** This module contains an abstraction of the System Users filter widget present on the Admin page */
import { Page, Locator } from "@playwright/test";

/** This class defines an abstraction of the system users filter widget present on the Admin page */
export class SystemUsersFilter {
    readonly parentSelector: string = 'div.oxd-table-filter';
    readonly usernameInput: Locator;
    readonly userRoleDdown: Locator;
    readonly employeeNameInput: Locator;
    readonly statusDdown: Locator;
    readonly searchBtn: Locator;

    constructor(page: Page) {
        this.usernameInput = page.locator(`${this.parentSelector} input.oxd-input`);
        this.userRoleDdown = page.locator(`${this.parentSelector} div > div.oxd-grid-item:nth-child(2)`);
        this.employeeNameInput = page.locator(`${this.parentSelector} input[placeholder*="for hints"]`);
        this.statusDdown = page.locator(`${this.parentSelector} div > div.oxd-grid-item:nth-child(4)`);
        this.searchBtn = page.locator(`${this.parentSelector} button[type="submit"]`);
    }
}