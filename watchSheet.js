const fs = require('fs');
const path = require('path');
const { google } = require('googleapis')
require('dotenv').config();

const SHEET_ID = '1yLOt-6REcHH5Sbjl4E_YyDutU665Vrg0xLwmrrcsXWg'
const WEBHOOK_URL = 'https://flyerfootprints.onrender.com/webhook'

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error('Environment variable GOOGLE_SERVICE_ACCOUNT is not set.');
}

const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const channelFile = path.resolve(__dirname, 'channels.json');
console.log('Channel file path:', channelFile);

const saveChannelData = (channelData) => {
    try {
        const existingChannels = fs.existsSync(channelFile)
            ? JSON.parse(fs.readFileSync(channelFile))
            : [];
        existingChannels.push(channelData);
        fs.writeFileSync(channelFile, JSON.stringify(existingChannels, null, 2));
        console.log('Channel data saved to channels.json.');
    } catch (error) {
        console.error('Error saving channel data:', error);
    }
};

const watchSheet = async () => {
    const drive = google.drive({ version: 'v3', auth: await auth.getClient() });

    try {
        const response = await drive.files.watch({
            fileId: SHEET_ID,
            requestBody: {
                id: `flyerfootprints-webhook-${Date.now()}`,
                type: 'web_hook',
                address: WEBHOOK_URL
            }
        });

        const { id, resourceId, expiration } = response.data;
        if (!id || !resourceId || !expiration) {
            throw new Error('Unexpected API response: Missing required fields.');
        }

        const channelData = {
            id: response.data.id,
            resourceId: response.data.resourceId,
            expiration: new Date(parseInt(response.data.expiration, 10)).toISOString(),
        };

        console.log('Watch channel created:', response.data);
        saveChannelData(channelData);

        return channelData.expiration;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.error('Quota issue: Rate limit exceeded or quota reached.');
        } else {
            console.error('Error creating watch channel:', error);
        }
        throw error;
    }
};

module.exports = { watchSheet };