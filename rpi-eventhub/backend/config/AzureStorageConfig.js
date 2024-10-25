const { ShareServiceClient, StorageSharedKeyCredential } = require("@azure/storage-file-share");
require('dotenv').config({ path: '.env' });

// Use environment variables or secret management for storage credentials
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

const credentials = new StorageSharedKeyCredential(account, accountKey);
const serviceClient = new ShareServiceClient(
    `https://${account}.file.core.windows.net`,
    credentials
);

module.exports = serviceClient;