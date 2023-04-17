import { Page, Locator, expect } from "@playwright/test";

const PARENT: string = 'aside.oxd-sidepanel';

export class SideMenu {
    // adding just a few of the sidemenu items as it's just for demo purposes
    readonly page: Page;
    readonly logoLink: Locator;
    readonly searchInput: Locator;
    readonly linkList: Locator;
    readonly adminLink: Locator;
    readonly pimLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoLink = page.locator(`${PARENT} a.oxd-brand`);
        this.searchInput = page.locator(`${PARENT} input.oxd-input`);
        this.linkList = page.locator(`${PARENT} ul.oxd-main-menu > li`)
        this.adminLink = page.locator(`${PARENT} a[href*="admin"]`);
        this.pimLink = page.locator(`${PARENT} a[href*="viewPimModule"]`);
    }

    async openAdminView() {
        await this.adminLink.click();
        await expect(this.page).toHaveURL('/.*\/admin\/.*/');
        await expect(this.adminLink).toHaveClass('active');
    }

    async openPIMView() {
        await this.pimLink.click();
        await expect(this.page).toHaveURL('/.*\/pim\/viewEmployeeList/');
        await expect(this.pimLink).toHaveClass('active');
    }

    async filterBySearchInput(inputText: string) {
        await this.searchInput.fill(inputText);
        await expect(this.linkList).toHaveCount(1);
    }

    get assertThat(): SideMenuAssertions {
        return new SideMenuAssertions(this);
    }
}

class SideMenuAssertions {
    readonly widget: SideMenu;

    constructor(sideMenu: SideMenu) {
        this.widget = sideMenu;
    }

    async allMenuItemsAreVisible() {
        const items: Locator[] = [
            this.widget.logoLink, this.widget.searchInput, this.widget.adminLink, this.widget.pimLink
        ];
        for (const item of items) {
            await expect(item).toBeVisible();
        }
    }

}