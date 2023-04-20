# (WIP) TypeScript+Playwright UI Tests Of Demo App

A repository containing a Playwright (TypeScript) project with UI tests for a demo application - https://opensource-demo.orangehrmlive.com/. The goal of the repository is to play around and explore Playwright with TypeScript. The goal of this project **is not** to provide an extensive automated test plan of the app.

> **_NOTE:_** Tests don't run in parallel and use only 1 worker because the demo app ends up returning 503 errors when being accessed multiple times simultaneously. That's something I wasn't aware of when I was deciding on a demo app to automage against, but that is okay considering the goals of this project.

## Installation

Make sure that NodeJS is installed and run:

    $ npm i

within the root folder of the repository.

### Pre-commit hook

Upon installing the dev dependencies, a pre-commit hook is installed as well. `lint-staged`, `husky`, `eslint`, and `prettier` are utilised to run 
static code checks upon making a `git commit`.

## Running tests

You can run the tests either locally or via GitHub Actions.

### Locally

After installing, run

    $ LOGIN_USERNAME=<username> LOGIN_PASSWORD=<password> npx playwright test

### GitHub Actions (CI)

Two workflows are present:

* [run-all-test-specs.yml](https://github.com/nbaldzhiev/playwright-ts-orange-hrm/blob/main/.github/workflows/run-all-test-specs.yml) - Runs all test specs upon manual trigger (`workflow_dispatch`);
* [run-test-specs.yml](https://github.com/nbaldzhiev/playwright-ts-orange-hrm/blob/main/.github/workflows/run-test-specs.yml) - Runs specific test specs depending on a workflow input provided by the user upon manual trigger (`workflow_dispatch)`.

Both workflows have a Playwright HTML report always uploaded as an artifact. TODO: Upload this report to a S3 bucket with enabled static website hosting.
