A repository containing a Playwright (TypeScript) project with UI tests for a demo application - https://opensource-demo.orangehrmlive.com/. The goal of the repository is to play around and explore Playwright with TypeScript. The goal of this project is not to provide an extensive automated test plan of the app.

NOTE: Running the tests often results in failures because the demo app returns 503 errors when being accessed multiple times simultaneously, which is the case when running multiple spec files with Playwright. That's something I didn't know when I was picking on a demo app to automage against. Therefore, the results are not consistent and the app itself isn't stable, but that is okay considering the goals of this project.

TODO: complete README after adding a pre-commit hook, new github actions workflows and eventually results sent to a S3 bucket with enabled static hosting.
