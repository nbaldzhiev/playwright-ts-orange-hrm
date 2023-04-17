import { AdminPage } from "./admin";
import { LoginPage } from "./login";
import { Page } from "@playwright/test";

export class AppUI {
    readonly loginPage: LoginPage;
    readonly adminPage: AdminPage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.adminPage = new AdminPage(page);
    }
}