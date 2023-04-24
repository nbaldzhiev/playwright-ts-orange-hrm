import * as AWS from 'aws-sdk';
import * as SlackWebApi from '@slack/web-api';
import * as fs from 'fs';

// Upload to S3
const s3: AWS.S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const bucketName: string = process.env.S3_BUCKET_NAME!;
const websiteUrl = `http://${bucketName}.s3-website.eu-central-1.amazonaws.com/`;
const reportDir = './playwright-report/';

const uploadCallback = (err: any, data: any) => {
    if (err) {
        console.log('Error', err);
    }
    if (data) {
        console.log('Upload Success', data.Location);
    }
};

const rootDir = new Date().toISOString() + '/';

// TODO: Improve the uploading of the report directory, such as by making it recursive, as now it's implemented in a
// pretty dummy way, knowing the structure in advance.

// Upload the main directory
s3.upload({ Bucket: bucketName, Body: '', Key: rootDir }, uploadCallback);

// Upload the index file
s3.upload(
    {
        Bucket: bucketName,
        Body: fs.createReadStream(reportDir + 'index.html'),
        Key: rootDir + 'index.html',
        ContentType: 'text/html',
    },
    uploadCallback,
);

// Upload the report/data directory
s3.upload({ Bucket: bucketName, Body: '', Key: rootDir + 'data/' }, uploadCallback);

// Upload the report/data files
fs.readdirSync(reportDir + 'data').forEach((file) => {
    s3.upload(
        {
            Bucket: bucketName,
            Body: fs.createReadStream(reportDir + 'data/' + file),
            Key: rootDir + `data/${file}`,
        },
        uploadCallback,
    );
});

// Upload the report/trace directory
s3.upload({ Bucket: bucketName, Body: '', Key: rootDir + 'trace/' }, uploadCallback);
fs.readdirSync(reportDir + 'trace').forEach((file) => {
    // Don't upload the assets folder
    if (file !== 'assets') {
        s3.upload(
            {
                Bucket: bucketName,
                Body: fs.createReadStream(reportDir + 'trace/' + file),
                Key: rootDir + `trace/${file}`,
            },
            uploadCallback,
        );
    }
});

// Upload the report/trace/assets directory
s3.upload({ Bucket: bucketName, Body: '', Key: rootDir + 'trace/assets' }, uploadCallback);
fs.readdirSync(reportDir + 'trace/assets').forEach((file) => {
    s3.upload(
        {
            Bucket: bucketName,
            Body: fs.createReadStream(reportDir + 'trace/assets/' + file),
            Key: rootDir + `trace/assets/${file}`,
        },
        uploadCallback,
    );
});

console.log(`>>>>>>>> S3 Report URL: ${websiteUrl}${rootDir} <<<<<<<<`);

// Notify slack
const s3Url = `${websiteUrl}${rootDir}`;
const repoName = 'playwright-ts-orange-hrm';
const ghActionsRunID = process.env.GITHUB_RUN_ID;
const ghActionsRunUrl = `https://github.com/${repoName}/actions/runs/${ghActionsRunID}`;
const qaSlackGroupId = process.env.SLACK_QA_GROUP_ID;
const slackBotToken = process.env.SLACK_BOT_TOKEN!;
const slackChannelNameAll = process.env.SLACK_CHANNEL_NAME_ALL!;
const slackChannelNameFails = process.env.SLACK_CHANNEL_NAME_FAILS!;

type parsedResults = {
    passed: number;
    failed: number;
    skipped: number;
    noTestsFound: boolean;
    duration?: string;
};

/**
 * Parses the Playwright output provided as the content of a file
 * @param {string} filename The filename of the file which contains the redirected Playwright output
 */
function parsePlaywrightOutput(filename: string) {
    const playwrightOutput_ = fs.readFileSync(filename, 'utf8');
    // https://github.com/microsoft/playwright/issues/20400
    const ansiRegex = new RegExp(
        // eslint-disable-next-line
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
        'g',
    );
    const playwrightOutput = playwrightOutput_.replace(ansiRegex, '');

    const statuses = ['passed', 'failed', 'skipped'];
    const parsedResults: parsedResults = {} as parsedResults;

    if (playwrightOutput.match(/.*Error: No tests found.*/)) {
        parsedResults.noTestsFound = true;
    } else {
        for (const status of statuses) {
            const regExp = new RegExp(`.*([0-9]+) ${status}.*`);
            const res: RegExpMatchArray | null = playwrightOutput.match(regExp);
            if (res) {
                parsedResults[status] = parseInt(res[1]);
            }
        }
        // Duration is only displayed when there are passed tests when reporter is html
        if (parsedResults[statuses[0]]) {
            parsedResults['duration'] = playwrightOutput.match(/.*\((([0-9]+)\.([0-9]+)[s|m])\).*/)![1];
        }
    }

    return parsedResults;
}

/**
 * Constucts the Slack message to send to the results channels
 * @param {String} parsedResults The parsed results of the Cypress output. The value of this parameter is expected to
 * be the return value of function parseCypressOutput.
 */
function constructSlackMessage(parsedResults: parsedResults) {
    let slackMessage = '---------- *TEST RESULTS* ----------\n';
    let mentionQaGroup = false;

    // If no tests were selected, i.e. no tests ran
    if (parsedResults.noTestsFound) {
        slackMessage += ':interrobang: No tests were selected. Was that intended?\n';
        mentionQaGroup = true;
    } else {
        for (const [status, numOfTests] of Object.entries(parsedResults)) {
            if (status === 'passed') {
                slackMessage += `:large_green_circle: *${numOfTests} PASSED*\n`;
            } else if (status === 'failed') {
                slackMessage += `:red_circle: *${numOfTests} FAILED*\n`;
                if (numOfTests) {
                    mentionQaGroup = true;
                }
            } else if (status === 'skipped') {
                slackMessage += `:double_vertical_bar: *${numOfTests} SKIPPED*\n`;
            }
        }
    }

    slackMessage += mentionQaGroup
        ? `\n* :x: FAILURE - There were test failures or no tests!* :x: <@${qaSlackGroupId}>\n`
        : `\n* :white_check_mark: SUCCESS - No unexpected failures/errors!* :white_check_mark:\n`;

    if (parsedResults.passed) {
        slackMessage += `\nTests elapsed time: *${parsedResults.duration}*.\n`;
    }
    slackMessage += `<${ghActionsRunUrl}|Run URL (ID: ${ghActionsRunID})>`;
    slackMessage += `<${s3Url}|HTML Report>`;

    return slackMessage;
}

/**
 * Posts the Slack message with the formatted content to the corresponding slack channels
 * @param {String} slackMessage The formatted slack message to send. The value of this parameter is expected to
 * be the return value of function constructSlackMessage.
 * @param {String} slackBotToken The token of the Slack bot app which would send the message
 * @param {String} slackChannel The name of the Slack channel, which contains all test results
 * @param {String} slackFailuresChannel The name of the Slack channel, which contains only test results with failures
 */
function postMessage({
    slackMessage,
    slackBotToken,
    slackChannel,
    slackFailuresChannel,
}: {
    slackMessage: string;
    slackBotToken: string;
    slackChannel: string;
    slackFailuresChannel: string;
}) {
    const client = new SlackWebApi.WebClient(slackBotToken);
    (async () => {
        await client.chat.postMessage({
            text: slackMessage,
            channel: slackChannel,
        });
    })();
    // If a subteam is being mentioned, then there were failures
    if (slackMessage.includes('<@U')) {
        (async () => {
            await client.chat.postMessage({
                text: slackMessage,
                channel: slackFailuresChannel,
            });
        })();
    }
}

postMessage({
    slackMessage: constructSlackMessage(parsePlaywrightOutput(process.argv.slice(-1)[0])),
    slackBotToken: slackBotToken,
    slackChannel: slackChannelNameAll,
    slackFailuresChannel: slackChannelNameFails,
});
