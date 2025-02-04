const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');
const serviceClient = require('../config/AzureStorageConfig');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cron = require('node-cron');


// Configure daily rotation for log files
const transport = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '../logs', 'events_change-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d', // Keep logs for 14 days
});

const logger = winston.createLogger({
    level: 'info',
    transports: [transport],
});


async function uploadLogFile(filePath, shareName, directoryName) {
    const fileName = path.basename(filePath);

    // Get a reference to the share
    const shareClient = serviceClient.getShareClient(shareName);

    // Create the share if it doesn't exist
    await shareClient.createIfNotExists();

    // Get a reference to the directory
    const directoryClient = shareClient.getDirectoryClient(directoryName);

    // Create the directory if it doesn't exist
    await directoryClient.createIfNotExists();

    // Get a reference to the file
    const fileClient = directoryClient.getFileClient(fileName);

    // Upload the file
    const data = fs.readFileSync(filePath);
    await fileClient.create(data.length);
    await fileClient.uploadRange(data, 0, data.length);

    console.log(`File ${fileName} uploaded to Azure File Share successfully.`);
}


// Schedule a task to upload the log file to Azure File Share every day
async function uploadLogFileToAzure() {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateString = yesterday.toISOString().split('T')[0];
        const logFileName = `events_change-${dateString}.log`;
        const filePath = path.join(__dirname, '../logs', logFileName);

        const shareName = 'rpieventhub-logs'; // The name of azure share
        const directoryName = 'events_change'; // the name of azure share directory

        if (fs.existsSync(filePath)) {
            await uploadLogFile(filePath, shareName, directoryName);
        } else {
            console.log(`Log file ${logFileName} does not exist.`);
        }
    } catch (err) {
        console.error(`Error uploading log file: ${err.message}`);
    }
}

// date is the date of the log file to read in the format 'YYYY-MM-DD'
async function readLogFile(shareName, directoryName, date) {
    try {
        // Get the file share client
        const shareClient = serviceClient.getShareClient(shareName);

        // Get the directory client
        const directoryClient = shareClient.getDirectoryClient(directoryName);

        // Get the file client
        const fileClient = directoryClient.getFileClient(`events_change-${date}.log`);

        // Download the file content
        const downloadResponse = await fileClient.download();

        // Read the content of the file from the stream
        return await streamToString(downloadResponse.readableStreamBody);
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
    }
}

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}


// Schedule the task to run at 1 AM every day
cron.schedule('0 1 * * *', uploadLogFileToAzure);

module.exports = { logger, uploadLogFileToAzure, readLogFile };