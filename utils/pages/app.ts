/** This module contains an abstraction of the UI part of the test app */
import { AdminPage } from "./admin";
import { PIMPage } from "./pim";
import { LoginPage } from "./login";
import { Page } from "@playwright/test";

/** This class defines an abstraction of the UI of the test app */
export class AppUI {
    readonly page: Page;
    readonly loginPage: LoginPage;
    readonly adminPage: AdminPage;
    readonly pimPage: PIMPage;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.adminPage = new AdminPage(page);
        this.pimPage = new PIMPage(page);
    }
}