import { BasePage } from "./base_page";
import { SystemUsersFilter } from "./widgets/admin/system_users_filter";
import { RecordsTable } from "./widgets/common/records_table";
import { AddUserForm } from "./widgets/admin/add_user_form";
import { Page, Locator, expect } from "@playwright/test";


export class AdminPage extends BasePage {
    readonly systemUsersFilter: SystemUsersFilter;
    readonly recordsTable: RecordsTable;
    readonly addUserForm: AddUserForm;

    constructor(page: Page) {
        super(page);
        this.systemUsersFilter = new SystemUsersFilter(this.page);
        this.recordsTable = new RecordsTable(this.page);
        this.addUserForm = new AddUserForm(this.page);
    }

    async clickOnAddUserBtn() {
        await this.recordsTable.addBtn.click();
        await expect(this.recordsTable.addBtn).not.toBeVisible();
    }

    get assertThat(): AdminPageAssertions {
        return new AdminPageAssertions(this);
    }
}

class AdminPageAssertions {
    readonly page: AdminPage;

    constructor(adminPage: AdminPage) {
        this.page = adminPage;
    }

    async systemUsersFilterIsLoaded() {
        const filter: SystemUsersFilter = this.page.systemUsersFilter;
        const items: Locator[] = [
            filter.usernameInput, filter.userRoleDdown, filter.employeeNameInput, filter.statusDdown, filter.searchBtn
        ];
        for (const item of items) {
            await expect(item).toBeVisible();
        }
    }
}