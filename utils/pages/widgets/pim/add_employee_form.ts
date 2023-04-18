import { Page, Locator, expect } from "@playwright/test";

type EmployeeData = {
    firstName: string,
    middleName: string,
    lastName: string,
    employeeId?: number,
}

export class AddEmployeeForm {
    readonly page: Page;
    readonly firstName: Locator;
    readonly middleName: Locator;
    readonly lastName: Locator;
    readonly employeeId: Locator;
    readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.locator('.orangehrm-employee-container input.orangehrm-firstname');
        this.middleName = page.locator('input.orangehrm-middlename');
        this.lastName = page.locator('input.orangehrm-lastname');
        this.employeeId = page.locator('.oxd-form-row > div:last-child input.oxd-input');
        this.saveBtn = page.locator('.orangehrm-card-container button[type="submit"]');
    }

    async fillFirstName(name: string) {
        await this.firstName.fill(name);
        await expect(this.firstName).toHaveValue(name);
    }

    async fillMiddleName(name: string) {
        await this.middleName.fill(name);
        await expect(this.middleName).toHaveValue(name);
    }

    async fillLastName(name: string) {
        await this.lastName.fill(name);
        await expect(this.lastName).toHaveValue(name);
    }

    async fillEmployeeId(employeeId: number) {
        await this.employeeId.fill(employeeId.toString());
        await expect(this.employeeId).toHaveValue(employeeId.toString());
    }

    async save() {
        await this.saveBtn.click();
        await expect(this.firstName).not.toBeVisible();
    }

    async addNewEmployee({ firstName, middleName, lastName, employeeId }: EmployeeData) {
        await this.fillFirstName(firstName);
        await this.fillMiddleName(middleName);
        await this.fillLastName(lastName);
        if (typeof employeeId === 'undefined') {
            employeeId = parseInt(Date.now().toString().substring(1, 10));
        }
        await this.fillEmployeeId(employeeId);
    
        await this.save();
    }
}