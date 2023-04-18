import { AdminPage } from "./admin";
import { PIMPage } from "./pim";
import { LoginPage } from "./login";
import { Page } from "@playwright/test";

export class AppUI {
    readonly loginPage: LoginPage;
    readonly adminPage: AdminPage;
    readonly pimPage: PIMPage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.adminPage = new AdminPage(page);
        this.pimPage = new PIMPage(page);
    }
}