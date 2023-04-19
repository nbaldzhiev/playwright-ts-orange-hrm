/** This module contains an abstraction of a records table which is present in multiple places of the test app */
import { Page, Locator, expect } from '@playwright/test';

/** This class defines an abstraction of a single row item in the records table */
class RowItem {
    readonly parentSelector: string = '.oxd-table-row';
    readonly username: Locator;
    readonly userRole: Locator;
    readonly employeeName: Locator;
    readonly status: Locator;
    readonly deleteBtn: Locator;

    constructor(row: Locator) {
        this.username = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(2)`);
        this.userRole = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(3)`);
        this.employeeName = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(4)`);
        this.status = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(5)`);
        this.deleteBtn = row.locator(`${this.parentSelector} > .oxd-table-cell:last-child button i.bi-trash`);
    }
}

/** This class defines an abstraction of a records table in the test app */
export class AdminRecordsTable {
    readonly page: Page;
    readonly parentSelector: string = 'div.orangehrm-paper-container';
    readonly addBtn: Locator;
    readonly recordsFoundMsg: Locator;
    readonly tableRow: Locator;

    constructor(page: Page) {
        this.page;
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
     * Returns a RecordsTableAssertions object as an interface to invoking assertions within the page
     * @returns {RecordsTableAssertions}
     */
    get assertThat(): RecordsTableAssertions {
        return new RecordsTableAssertions(this);
    }
}

/** This class defines assertions within a records table */
class RecordsTableAssertions {
    readonly table: AdminRecordsTable;

    constructor(table: AdminRecordsTable) {
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
     * @param {string} obj.firstName The expected first name of the employee
     * @param {string} obj.lastName The expected last name of the employee
     * @param {number} obj.employeeIndex 1-based index identifying the employee row in the table, 1 being the top one
     */
    async employeeNameIsCorrect({
        firstName,
        lastName,
        employeeIndex = 1,
    }: {
        firstName: string;
        lastName: string;
        employeeIndex?: number;
    }) {
        const expectedName = `${firstName} ${lastName}`;
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.employeeName).toHaveText(expectedName);
    }

    /**
     * Asserts that the employee's user role is correct
     * @param {object} obj
     * @param {string} obj.userRole The expected user role of the employee
     * @param {number} obj.employeeIndex 1-based index identifying the employee row in the table, 1 being the top one
     */
    async employeeUserRoleIsCorrect({ userRole, employeeIndex = 1 }: { userRole: string; employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.userRole).toHaveText(userRole);
    }

    /**
     * Asserts that the employee's username is correct
     * @param {object} obj
     * @param {string} obj.username The expected username of the employee
     * @param {number} obj.employeeIndex 1-based index identifying the employee row in the table, 1 being the top one
     */
    async employeeUsernameIsCorrect({ username, employeeIndex = 1 }: { username: string; employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.username).toHaveText(username);
    }

    /**
     * Asserts that the employee's status is correct
     * @param {object} obj
     * @param {string} obj.status The expected status of the employee
     * @param {number} obj.employeeIndex 1-based index identifying the employee row in the table, 1 being the top one
     */
    async employeeStatusIsCorrect({ status, employeeIndex = 1 }: { status: string; employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.status).toHaveText(status);
    }
}
