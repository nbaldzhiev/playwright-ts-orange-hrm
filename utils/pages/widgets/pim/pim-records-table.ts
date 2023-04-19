/** This module contains an abstraction of the records table on the PIM page */
import { Page, Locator, expect } from '@playwright/test';

/** This class defines an abstraction of a single row item in the records table */
class RowItem {
    readonly parentSelector: string = '.oxd-table-row--clickable';
    readonly employeeId: Locator;
    readonly firstMiddleNames: Locator;
    readonly lastName: Locator;
    readonly deleteBtn: Locator;

    constructor(row: Locator) {
        this.employeeId = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(2)`);
        this.firstMiddleNames = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(3)`);
        this.lastName = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(4)`);
        this.deleteBtn = row.locator(`${this.parentSelector} > .oxd-table-cell:last-child button i.bi-trash`);
    }
}

/** This class defines an abstraction of the records table on the PIM page */
export class PimRecordsTable {
    readonly page: Page;
    readonly parentSelector: string = 'div.orangehrm-paper-container';
    readonly addBtn: Locator;
    readonly recordsFoundMsg: Locator;
    readonly tableRow: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addBtn = page.locator(`${this.parentSelector} .orangehrm-header-container button`);
        this.recordsFoundMsg = page.locator(`${this.parentSelector} .orangehrm-horizontal-padding span`);
        this.tableRow = page.locator(`${this.parentSelector} .oxd-table-body > .oxd-table-card`);
    }

    /**
     * Gets and returns a row by its index in the list of rows
     * @param {number} rowIndex 1-based index identifying the row in the table, 1 being the top one
     * @returns {RowItem}
     */
    getRowByIndex(rowIndex: number): RowItem {
        return new RowItem(this.tableRow.nth(rowIndex - 1));
    }

    /**
     * Deletes a row by its index in the list of rows
     * @param {number} rowIndex 1-based index identifying the row in the table, 1 being the top one
     */
    async deleteRowByIndex(rowIndex: number) {
        await this.getRowByIndex(rowIndex).deleteBtn.click();
        await this.page.locator('[role="dialog"] button.oxd-button--label-danger').click();
        await expect(this.page.locator('[role="dialog"] button.oxd-button--label-danger')).toBeHidden();
    }

    /**
     * Returns a RecordsTableAssertions object as an interface to invoking assertions within the page
     * @returns {RecordsTableAssertions}
     */
    get assertThat(): RecordsTableAssertions {
        return new RecordsTableAssertions(this);
    }
}

/** This class defines assertions within a records table */
class RecordsTableAssertions {
    readonly table: PimRecordsTable;

    constructor(table: PimRecordsTable) {
        this.table = table;
    }

    /**
     * Asserts that the number of rows in the table is correct
     * @param {number} expectedNumber The expected number of rows
     */
    async numberOfRowsIsCorrect(expectedNumber: number) {
        await expect(this.table.tableRow).toHaveCount(expectedNumber);
    }

    /**
     * Asserts that the employee's first and middle names are correct
     * @param {object} obj
     * @param {string} obj.names The expected first and middle names of the employee as a string
     * @param {number} obj.employeeIndex 1-based index identifying the employee row in the table, 1 being the top one
     */
    async employeeFirstMiddleNamesAreCorrect({ names, employeeIndex = 1 }: { names: string; employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.firstMiddleNames).toHaveText(names);
    }

    /**
     * Asserts that the employee's last name is correct
     * @param {object} obj
     * @param {string} obj.name The expected last name of the employee
     * @param {number} obj.employeeIndex 1-based index identifying the employee row in the table, 1 being the top one
     */
    async employeeLastNameIsCorrect({ name, employeeIndex = 1 }: { name: string; employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.lastName).toHaveText(name);
    }

    /**
     * Asserts that the employee's ID is correct
     * @param {object} obj
     * @param {number} obj.employeeId The expected ID of the employee
     * @param {number} obj.employeeIndex 1-based index identifying the employee row in the table, 1 being the top one
     */
    async employeeIdIsCorrect({ employeeId, employeeIndex = 1 }: { employeeId: number; employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.employeeId).toHaveText(employeeId.toString());
    }
}
