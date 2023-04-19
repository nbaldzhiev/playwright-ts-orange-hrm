/** This module contains an abstraction of the left side menu when logged in the test app */
import { Page, Locator, expect } from '@playwright/test';

const PARENT = 'aside.oxd-sidepanel';

/** This class defines an abstraction of the left side menu when logged in the test app */
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
        this.linkList = page.locator(`${PARENT} ul.oxd-main-menu > li`);
        this.adminLink = page.locator(`${PARENT} a[href*="admin"]`);
        this.pimLink = page.locator(`${PARENT} a[href*="viewPimModule"]`);
    }

    /** Opens the Admin page by clicking on the Admin link in the side menu */
    async openAdminPage() {
        await this.adminLink.click();
        await expect(this.page).toHaveURL(/.*admin\/viewSystemUsers.*/);
        await expect(this.adminLink).toHaveClass(/active/);
    }

    /** Open ths PIM page by clicking on the PIM link in the side menu  */
    async openPIMPage() {
        await this.pimLink.click();
        await expect(this.page).toHaveURL(/.*\/pim\/viewEmployeeList/);
        await expect(this.pimLink).toHaveClass(/active/);
    }

    /**
     * Filters the side menu by using the search input
     * @param {string} inputText The text to search by
     */
    async filterBySearchInput(inputText: string) {
        await this.searchInput.fill(inputText);
        await expect(this.linkList).toHaveCount(1);
    }

    /**
     * Returns a SideMenuAssertions object as an interface to invoking assertions within the menu
     * @returns {SideMenuAssertions}
     */
    get assertThat(): SideMenuAssertions {
        return new SideMenuAssertions(this);
    }
}

/** This class defines assertions within the side menu */
class SideMenuAssertions {
    readonly widget: SideMenu;

    constructor(sideMenu: SideMenu) {
        this.widget = sideMenu;
    }

    /** Asserts that all items in the menu are present and visible */
    async allMenuItemsAreVisible() {
        const items: Locator[] = [
            this.widget.logoLink,
            this.widget.searchInput,
            this.widget.adminLink,
            this.widget.pimLink,
        ];
        for (const item of items) {
            await expect(item).toBeVisible();
        }
    }
}
