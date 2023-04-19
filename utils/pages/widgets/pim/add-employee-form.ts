/** This module contains an abstraction of the Add Employee Form on the PIM page */
import { Page, Locator, expect } from '@playwright/test';

type EmployeeData = {
    firstName: string;
    middleName: string;
    lastName: string;
    employeeId?: number;
};

/** This class defines an abstraction of the Add Employee Form on the PIM page */
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

    /**
     * Fills in the first name input
     * @param {string} name The name to fill in
     */
    async fillFirstName(name: string) {
        await this.firstName.fill(name);
        await expect(this.firstName).toHaveValue(name);
    }

    /**
     * Fills in the middle name input
     * @param {string} name The name to fill in
     */
    async fillMiddleName(name: string) {
        await this.middleName.fill(name);
        await expect(this.middleName).toHaveValue(name);
    }

    /**
     * Fills in the last name input
     * @param {string} name The name to fill in
     */
    async fillLastName(name: string) {
        await this.lastName.fill(name);
        await expect(this.lastName).toHaveValue(name);
    }

    /**
     * Fills in the employee ID input
     * @param {string} employeeId The ID to fill in
     */
    async fillEmployeeId(employeeId: number) {
        await this.employeeId.fill(employeeId.toString());
        await expect(this.employeeId).toHaveValue(employeeId.toString());
    }

    /** Clicks on the Save button */
    async save() {
        await this.saveBtn.click();
        await expect(this.firstName).toBeHidden();
    }

    /**
     * Adds a new employee by filling all necessary fields in the form
     * @param {object} EmployeeData
     * @param {string} EmployeeData.firstName The first name of the employee
     * @param {string} EmployeeData.middleName The middle name of the employee
     * @param {string} EmployeeData.lastName The last name of the employee
     * @param {number} EmployeeData.employeeId The ID of the employee
     */
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
