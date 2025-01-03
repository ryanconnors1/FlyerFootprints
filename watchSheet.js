const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const e = require('express');
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

// Save channel data to a JSON file
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

// Schedule a channel renewal before it expires
const scheduleChannelRenewal = (expiration) => {
    const now = Date.now();
    // Renew 1 hour before expiration
    const renewalTime = expiration - now - 1 * 60 * 60 * 1000;
    if (renewalTime > 0) {
        console.log(`Scheduling channel renewal in ${Math.round(renewalTime / 1000 / 60)} minutes.`);
        setTimeout(async () => {
            console.log('Renewing watch channel...');
            await watchSheet();
        }, renewalTime);
    } else {
        console.warn('Expiration time has already passed. Creating a new watch channel immediately.');
        watchSheet();
    }
};

// Create a watch channel to receive notifications when the Google Sheet changes
const watchSheet = async () => {
    const drive = google.drive({ version: 'v3', auth: await auth.getClient() });

    try {
        // Set expiration time to 24 hours from now
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000

        const response = await drive.files.watch({
            fileId: SHEET_ID,
            requestBody: {
                id: `flyerfootprints-webhook-${Date.now()}`,
                type: 'web_hook',
                address: WEBHOOK_URL,
                expiration: expirationTime,
            }
        });

        const { id, resourceId, expiration } = response.data;
        if (!id || !resourceId || !expiration) {
            throw new Error('Unexpected API response: Missing required fields.');
        }

        const channelData = {
            id,
            resourceId,
            expiration,
        };

        console.log('Watch channel created:', response.data);
        saveChannelData(channelData);

        return expiration;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.error('Quota issue: Rate limit exceeded or quota reached.');
        } else {
            console.error('Error creating watch channel:', error);
        }
        throw error;
    }
};

// Initialize the watch channel
const initializeWatch = async () => {
    try {
        let validChannel = null;

        // Check if the channel file exists and read its data
        if (fs.existsSync(channelFile)) {
            const channelData = JSON.parse(fs.readFileSync(channelFile));
            const now = Date.now();

            // Check all channels in the file for validity
            for (const channel of channelData) {
                if (channel.expiration > now) {
                    console.log('Found existing watch channel:', channel.expiration);
                    validChannel = channel; // Found a valid channel
                    break;
                }
            }

            if (validChannel) {
                console.log('Existing watch channel is still valid:', validChannel);
                scheduleChannelRenewal(validChannel.expiration);
                return;
            } else {
                console.log('Existing watch channels have expired. Creating a new one.');
            }
        } else {
            console.log('No existing watch channel found. Creating a new one.');
        }

        const newExpiration = await watchSheet();
        scheduleChannelRenewal(newExpiration);
    } catch (error) {
        console.error('Error initializing watch:', error);
    }
};


module.exports = { initializeWatch };