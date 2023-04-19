/** This module contains a page object model for the PIM page */
import { BasePage } from "./base-page";
import { PimRecordsTable } from "./widgets/pim/pim-records-table";
import { AddEmployeeForm } from "./widgets/pim/add-employee-form";
import { Page, Locator, expect } from "@playwright/test";


/** This class defines an abstraction of the PIM page */
export class PIMPage extends BasePage {
    readonly page: Page;
    readonly recordsTable: PimRecordsTable;
    readonly addEmployeeForm: AddEmployeeForm;
    readonly employeeInfoIdInput: Locator;
    readonly employeeInfoSearchBtn: Locator;
    readonly loader: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.recordsTable = new PimRecordsTable(this.page);
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
     * Deletes a given employee from the records table and asserts that the record has been deleted
     * @param {number} employeeId The ID of the employee to be deleted
     */
    async deleteEmployeeAndAssertDeletion(employeeId: number) {
      await this.filterEmployeesByEmployeeId(employeeId);
      await this.recordsTable.assertThat.numberOfRowsIsCorrect(1);
      await this.recordsTable.deleteRowByIndex(1);
      await this.filterEmployeesByEmployeeId(employeeId);
      await this.recordsTable.assertThat.numberOfRowsIsCorrect(0);
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