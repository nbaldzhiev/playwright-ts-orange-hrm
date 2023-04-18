import { Page, Locator, expect } from "@playwright/test";

class RowItem {
    readonly parentSelector: string = '.oxd-table-row--clickable';
    readonly employeeId: Locator;
    readonly firstMiddleNames: Locator;
    readonly lastName: Locator;

    constructor(row: Locator) {
        this.employeeId = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(2)`);
        this.firstMiddleNames = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(3)`);
        this.lastName = row.locator(`${this.parentSelector} > .oxd-table-cell:nth-child(4)`);
    }
}

export class RecordsTable {
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

    getRowByIndex(rowIndex: number): RowItem {
        return new RowItem(this.tableRow.nth(rowIndex - 1))
    }

    get assertThat(): RecordsTableAssertions {
        return new RecordsTableAssertions(this);
    }
}

class RecordsTableAssertions {
    readonly table: RecordsTable;

    constructor(table: RecordsTable) {
        this.table = table;
    }

    async numberOfRowsIsCorrect(expectedNumber: number) {
        await expect(this.table.tableRow).toHaveCount(expectedNumber);
    }

    async employeeFirstMiddleNamesAreCorrect({ names, employeeIndex = 1 }: { names: string, employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.firstMiddleNames).toHaveText(names);
    }

    async employeeLastNameIsCorrect({ name, employeeIndex = 1 }: { name: string, employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.lastName).toHaveText(name);
    }

    async employeeIdIsCorrect({ employeeId, employeeIndex = 1 }: { employeeId: number, employeeIndex?: number }) {
        const row = this.table.getRowByIndex(employeeIndex);
        await expect(row.employeeId).toHaveText(employeeId.toString());
    }
}