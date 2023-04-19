/** This module contains an abstraction of the Add User form present on the admin page */
import { Page, Locator, expect } from '@playwright/test';

type UserData = {
    userRole: string;
    employeeName: string;
    status: string;
    username: string;
    password: string;
    confirmPassword: string;
};

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
    readonly popupListOption: Locator;
    readonly requiredErrorMsg: Locator;
    readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        const ddown = `${this.parentSelector} div[class="oxd-form-row"] .oxd-grid-2 > .oxd-grid-item`;
        this.userRoleDdown = page.locator(`${ddown}:first-child .oxd-select-wrapper`);
        this.employeeNameInput = page.locator(`${this.parentSelector} input[placeholder*="for hints"]`);
        this.statusDdown = page.locator(`${ddown}:nth-child(3) .oxd-select-text-input`);
        this.usernameInput = page.locator(`${this.parentSelector} input.oxd-input:not([type="password"])`);
        this.passwordInput = page.locator(`${this.parentSelector} div.user-password-cell input`);
        this.confirmPasswordInput = page.locator(
            `${this.parentSelector} .user-password-row div.oxd-grid-item:not([class*="user-password-cell"]) input`,
        );
        this.popupListOption = page.locator('[role="listbox"] > [role="option"] span');
        this.requiredErrorMsg = page.locator('span.oxd-input-field-error-message');
        this.saveBtn = page.locator(`${this.parentSelector} button[type="submit"]`);
    }

    /**
     * Selects a given role from the User Role dropdown
     * @param {string} userRole The user role to select
     */
    async selectUserRole(userRole: string) {
        await this.userRoleDdown.click();
        await this.popupListOption.getByText(userRole).click();
        await expect(this.userRoleDdown).toHaveText(userRole);
    }

    /**
     * Selects an employee by typing their name in the Employee Name input and selecting from the dropdown
     * @param {string} name The name to select
     */
    async selectEmployeeName(name: string) {
        await this.employeeNameInput.fill(name);
        await this.popupListOption.getByText(name).click();
        await expect(this.employeeNameInput).toHaveValue(name);
    }

    /**
     * Selects a given status from the Status dropdown
     * @param {string} status The status to select
     */
    async selectStatus(status: string) {
        await this.statusDdown.click();
        await this.popupListOption.getByText(status).click();
        await expect(this.statusDdown).toHaveText(status);
    }

    /**
     * Fills in the username input
     * @param {string} username The name to fill in
     */
    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
    }

    /**
     * Fills in the password input
     * @param {string} password The password to fill in
     */
    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
        await expect(this.usernameInput).not.toBeEmpty();
    }

    /**
     * Fills in the confirm password input
     * @param {string} password The password to fill in
     */
    async fillConfirmPassword(password: string) {
        await this.confirmPasswordInput.fill(password);
        await expect(this.confirmPasswordInput).not.toBeEmpty();
    }

    /** Clicks on the Save button */
    async save() {
        await this.saveBtn.click();
        await expect(this.saveBtn).toBeVisible();
    }

    /**
     * Adds a new user by filling in all required fields and saving
     * @param {object} UserData
     * @param {string} UserData.userRole The user role to select
     * @param {string} UserData.employeeName The name of the employee to fill in
     * @param {string} UserData.status The status to select
     * @param {string} UserData.username The username to fill in
     * @param {string} UserData.password The password to fill in
     * @param {string} UserData.confirmPassword The confirm  username to fill in
     */
    async addNewUser({ userRole, employeeName, status, username, password, confirmPassword }: UserData) {
        await this.selectUserRole(userRole);
        await this.selectEmployeeName(employeeName);
        await this.selectStatus(status);
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.fillConfirmPassword(confirmPassword);
        await expect(this.requiredErrorMsg).toBeHidden();
        // For some reason, a small wait is needed here because the button otherwise just doesn't get clicked
        await this.page.waitForTimeout(800);
        await this.save();
    }
}
