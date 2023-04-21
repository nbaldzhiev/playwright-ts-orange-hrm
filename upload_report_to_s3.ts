import * as AWS from 'aws-sdk';
import * as fs from 'fs';

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

console.log(`>>>> S3 Report URL: ${websiteUrl} + ${rootDir} <<<<`);
