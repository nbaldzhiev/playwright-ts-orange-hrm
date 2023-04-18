/** This module contains an abstraction of the Add User form present on the admin page */
import { Page, Locator, expect } from "@playwright/test";

type UserData = {
    userRole: string,
    employeeName: string,
    status: string,
    username: string,
}

/** This module defines an abstraction of the Add User form present on the admin page */
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

    /**
     * Selects a given role from the User Role dropdown
     * @param {string} userRole The user role to select
     */
    async selectUserRole(userRole: string) {
        await this.userRoleDdown.click();
        await this.page.locator('[role="listbox"] > [role="option"] span').getByText(userRole).click();
    }

    /**
     * Fills in the employee name input
     * @param {string} name The name to fill in
     */
    async fillEmployeeName(name: string) {
        await this.employeeNameInput.fill(name);
    }

    /**
     * Selects a given status from the Status dropdown
     * @param {string} status The status to select
     */
    async selectStatus(status: string) {
        await this.statusDdown.click();
        await this.page.locator('[role="listbox"] > [role="option"] span').getByText(status).click();
    }

    /**
     * Fills in the username input
     * @param {string} username The name to fill in
     */
    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    /** Clicks on the Save button */
    async save() {
        await this.saveBtn.click();
        await expect(this.saveBtn).not.toBeVisible();
    }

    /**
     * Adds a new user by filling in all required fields and saving
     * @param {object} UserData
     * @param {string} UserData.userRole The user role to select
     * @param {string} UserData.employeeName The name of the employee to fill in
     * @param {string} UserData.status The status to select
     * @param {string} UserData.username The username to fill in
     */
    async addNewUser({ userRole, employeeName, status, username }: UserData) {
        await this.selectUserRole(userRole);
        await this.fillEmployeeName(employeeName);
        await this.selectStatus(status);
        await this.fillUsername(username);
    
        await this.save();
    }
}