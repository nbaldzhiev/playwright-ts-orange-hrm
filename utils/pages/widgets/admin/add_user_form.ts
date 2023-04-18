import { Page, Locator, expect } from "@playwright/test";

type UserData = {
    userRole: string,
    employeeName: string,
    status: string,
    username: string,
}

export class AddUserForm {
    readonly page: Page;
    readonly parentSelector: string = '.orangehrm-card-container';
    readonly userRoleDdown: Locator;
    readonly employeeNameInput: Locator;
    readonly statusDdown: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        const ddown = `${this.parentSelector} div[class="oxd-form-row"] .oxd-grid-2 > .oxd-grid-item`;
        this.userRoleDdown = page.locator(`${ddown}:first-child .oxd-select-wrapper`);
        this.employeeNameInput = page.locator(`${this.parentSelector} input[placeholder*="for hints"]`);
        this.statusDdown = page.locator(`${ddown}:nth-child(3) .oxd-select-text-input`);
        this.usernameInput = page.locator(`${this.parentSelector} input.oxd-input:not([type="password"])`);
        this.saveBtn = page.locator(`${this.parentSelector} button[type="submit"]`);
    }

    async selectUserRole(userRole: string) {
        await this.userRoleDdown.click();
        await this.page.locator('[role="listbox"] > [role="option"] span').getByText(userRole).click();
    }

    async fillEmployeeName(name: string) {
        await this.employeeNameInput.fill(name);
    }

    async selectStatus(status: string) {
        await this.statusDdown.click();
        await this.page.locator('[role="listbox"] > [role="option"] span').getByText(status).click();
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async save() {
        await this.saveBtn.click();
        await expect(this.saveBtn).not.toBeVisible();
    }

    async addNewUser({ userRole, employeeName, status, username }: UserData) {
        await this.selectUserRole(userRole);
        await this.fillEmployeeName(employeeName);
        await this.selectStatus(status);
        await this.fillUsername(username);
    
        await this.save();
    }
}