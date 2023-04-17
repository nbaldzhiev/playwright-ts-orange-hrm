import { Page, Locator, expect } from "@playwright/test";

type LoginCredentials = {
    username?: string,
    password?: string,
}

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

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
        await expect(this.passwordInput).not.toBeEmpty();
    }

    async clickLoginBtn() {
        await this.loginBtn.click();
    }

    async login(
        { username = process.env.LOGIN_USERNAME!, password = process.env.LOGIN_PASSWORD! }: LoginCredentials = {}
    ) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginBtn();
        await expect(this.loginBtn).not.toBeVisible();
    }

    get assertThat() {
        return new LoginPageAssertions(this);
    }
}

class LoginPageAssertions {
    readonly page: LoginPage;

    constructor(loginPage: LoginPage) {
        this.page = loginPage;
    }

    async allElementsExist() {
        for (
            const loc
            of 
            [this.page.usernameInput, this.page.passwordInput, this.page.loginBtn, this.page.forgotPasswordLink]
        ) {
            await expect(loc).toBeVisible();
        }
    }

    async invalidCredentialsMsgExists() {
        const msg: string = 'Invalid credentials';
        await expect(this.page.invalidCredentialsMsg).toHaveText(msg);
    }

    async numOfRequiredMsgsIsCorrect(expectedNumber: number) {
        await expect(this.page.requiredErrorMsg).toHaveCount(expectedNumber);
    }
}