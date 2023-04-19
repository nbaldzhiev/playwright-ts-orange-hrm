# TypeScript+Playwright UI Tests Of Demo App

A repository containing a Playwright (TypeScript) project with UI tests for a demo application - https://opensource-demo.orangehrmlive.com/. The goal of the repository is to play around and explore Playwright with TypeScript. The goal of this project **is not** to provide an extensive automated test plan of the app.

> **_NOTE:_** Running the tests in parallel often results in failures because the demo app returns 503 errors when being accessed multiple times simultaneously. Therefore, 1 worker (default for CI) works best. That's something I didn't know when I was picking on a demo app to automage against. Therefore, the results are not consistent and the app itself isn't stable, but that is okay considering the goals of this project.

## Installation

Make sure that NodeJS is installed and run:

    $ npm i

within the root folder of the repository.

### Pre-commit hook

Upon installing the dev dependencies, a pre-commit hook is installed as well. `lint-staged`, `husky`, `eslint`, and `prettier` are utilised to run 
static code checks upon making a `git commit`.

TODO: complete README
