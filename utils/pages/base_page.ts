import { Page, Locator, expect } from "@playwright/test";
import { SideMenu } from "./widgets/side_menu";

export class BasePage {
    readonly page: Page;
    readonly sideMenu: SideMenu;
    readonly topBarBreadcrumb: Locator;
    readonly topBarUserFullName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sideMenu = new SideMenu(page);
        this.topBarBreadcrumb = page.locator('.oxd-topbar-header-title h6');
        this.topBarUserFullName = page.locator('p.oxd-userdropdown-name');
    }
}