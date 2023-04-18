/** This module contains a page object model for the PIM page */
import { BasePage } from "./base_page";
import { RecordsTable } from "./widgets/common/records_table";
import { AddEmployeeForm } from "./widgets/pim/add_employee_form";
import { Page, Locator, expect } from "@playwright/test";


/** This class defines an abstraction of the PIM page */
export class PIMPage extends BasePage {
    readonly page: Page;
    readonly recordsTable: RecordsTable;
    readonly addEmployeeForm: AddEmployeeForm;
    readonly employeeInfoIdInput: Locator;
    readonly employeeInfoSearchBtn: Locator;
    readonly loader: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.recordsTable = new RecordsTable(this.page);
        this.addEmployeeForm = new AddEmployeeForm(this.page);
        this.loader = page.locator('.oxd-loading-spinner-container');
        this.employeeInfoIdInput = page.locator('.oxd-grid-4 > .oxd-grid-item:nth-child(2) input');
        this.employeeInfoSearchBtn = page.locator('.oxd-form-actions button[type="submit"]');
    }

    /**
     * Clicks on the 'Add' button for opening up the Add new employee form
     */
    async clickOnAddEmployeeBtn() {
        await this.recordsTable.addBtn.click();
        await expect(this.recordsTable.addBtn).not.toBeVisible();
    }

    /**
     * Filters the PIM table by employee ID
     * @param {number} employeeId The ID of the employee to filter by
     */
    async filterEmployeesByEmployeeId(employeeId: number) {
        await this.employeeInfoIdInput.fill(employeeId.toString());
        await this.employeeInfoSearchBtn.click();
        await expect(this.loader).toBeVisible();
        await expect(this.loader).not.toBeVisible();
    }

    /**
     * Returns a PIMPageAssertions object as an interface to invoking assertions on the page
     * @returns {PIMPageAssertions}
     */
    get assertThat(): PIMPageAssertions {
        return new PIMPageAssertions(this);
    }
}

/** This class defines assertions on the PIM page */
class PIMPageAssertions {
    readonly page: PIMPage;

    constructor(pimPage: PIMPage) {
        this.page = pimPage;
    }

}