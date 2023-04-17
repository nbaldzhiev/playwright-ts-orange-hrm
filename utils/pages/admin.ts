import { BasePage } from "./base_page";
import { Page, Locator } from "@playwright/test";

class SystemUsersFilter {
    readonly parentSelector: string = 'div.oxd-table-filter';
    readonly usernameInput: Locator;
    readonly userRoleDdown: Locator;
    readonly employeeNameInput: Locator;
    readonly statusDdown: Locator;

    constructor(page: Page) {
        this.usernameInput = page.locator(`${this.parentSelector} input.oxd-input`);
        this.userRoleDdown = page.locator(`${this.parentSelector} div > div.oxd-grid-item:nth-child(2)`);
        this.employeeNameInput = page.locator(`${this.parentSelector} input[placeholder*="for hints"]`);
        this.statusDdown = page.locator(`${this.parentSelector} div > div.oxd-grid-item:nth-child(4)`);
    }
}

export class AdminPage extends BasePage {
    readonly systemUsersFilter: SystemUsersFilter;

    constructor(page: Page) {
        super(page);
        this.systemUsersFilter = new SystemUsersFilter(this.page);
    }
}