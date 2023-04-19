/** This module contains a page object model for the Login page */
import { Page, Locator, expect } from '@playwright/test';

type LoginCredentials = {
    username?: string;
    password?: string;
};

/** This class defines an abstraction of the Login page */
export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly forgotPasswordLink: Locator;
    readonly invalidCredentialsMsg: Locator;
    readonly requiredErrorMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('input[placeholder="Username"]');
        this.passwordInput = page.locator('input[placeholder="Password"]');
        this.loginBtn = page.locator('button[type="submit"]');
        this.forgotPasswordLink = page.locator('div.orangehrm-login-forgot > p');
        this.invalidCredentialsMsg = page.locator('p.oxd-alert-content-text');
        this.requiredErrorMsg = page.locator('span.oxd-input-field-error-message');
    }

    /**
     * Fills in the username input
     * @param {string} username The username to log in as
     */
    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
    }

    /**
     * Fills in the password input
     * @param {string} password The password to log in with
     */
    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
        await expect(this.passwordInput).not.toBeEmpty();
    }

    /** Clicks the Login button */
    async clickLoginBtn() {
        await this.loginBtn.click();
    }

    /**
     * Fills in the username and password fields, and clicks on the login button to perform a login
     * @param {object} LoginCredentials
     * @param {string} LoginCredentials.username The username to log in as
     * @param {string} LoginCredentials.password The password to log in with
     */
    async login({
        username = process.env.LOGIN_USERNAME!,
        password = process.env.LOGIN_PASSWORD!,
    }: LoginCredentials = {}) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginBtn();
        await expect(this.loginBtn).toBeHidden();
    }

    /**
     * Returns a LoginPageAssertions object as an interface to invoking assertions on the page
     * @returns {LoginPageAssertions}
     */
    get assertThat(): LoginPageAssertions {
        return new LoginPageAssertions(this);
    }
}

/** This class defines assertions on the Login page */
class LoginPageAssertions {
    readonly page: LoginPage;

    constructor(loginPage: LoginPage) {
        this.page = loginPage;
    }

    /** Asserts that all elements on the Login page exist and are visible */
    async allElementsExist() {
        for (const loc of [
            this.page.usernameInput,
            this.page.passwordInput,
            this.page.loginBtn,
            this.page.forgotPasswordLink,
        ]) {
            await expect(loc).toBeVisible();
        }
    }

    /** Asserts that the invalid credentials error message exists */
    async invalidCredentialsMsgExists() {
        const msg = 'Invalid credentials';
        await expect(this.page.invalidCredentialsMsg).toHaveText(msg);
    }

    /**
     * Asserts that the number of 'Required' error messages is correct
     * @param {number} expectedNumber The expected number of error messages
     */
    async numOfRequiredMsgsIsCorrect(expectedNumber: number) {
        await expect(this.page.requiredErrorMsg).toHaveCount(expectedNumber);
    }
}
