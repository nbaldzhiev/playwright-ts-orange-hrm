import { BasePage } from "./base_page";
import { RecordsTable } from "./widgets/common/records_table";
import { AddEmployeeForm } from "./widgets/pim/add_employee_form";
import { Page, Locator, expect } from "@playwright/test";


export class PIMPage extends BasePage {
    readonly page: Page;
    readonly recordsTable: RecordsTable;
    readonly addEmployeeForm: AddEmployeeForm;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.recordsTable = new RecordsTable(this.page);
        this.addEmployeeForm = new AddEmployeeForm(this.page);
    }

    async clickOnAddEmployeeBtn() {
        await this.recordsTable.addBtn.click();
        await expect(this.recordsTable.addBtn).not.toBeVisible();
    }

    async filterEmployeesByEmployeeId(employeeId: number) {
        await this.page.locator('.oxd-grid-4 > .oxd-grid-item:nth-child(2) input').fill(employeeId.toString());
        await this.page.locator('.oxd-form-actions button[type="submit"]').click();
    }

    get assertThat(): PIMPageAssertions {
        return new PIMPageAssertions(this);
    }
}

class PIMPageAssertions {
    readonly page: PIMPage;

    constructor(pimPage: PIMPage) {
        this.page = pimPage;
    }

}