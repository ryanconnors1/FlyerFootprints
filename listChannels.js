const { google } = require('googleapis');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const stopChannel = async (channelId, resourceId) => {
    const drive = google.drive({ version: 'v3', auth: await auth.getClient() });

    try {
        await drive.channels.stop({
            requestBody: {
                id: channelId,
                resourceId: resourceId,
            },
        });
        console.log(`Channel ${channelId} stopped successfully.`);
    } catch (error) {
        console.error('Error stopping channel:', error);
    }
};

// Replace with the channel ID and resource ID you want to stop
stopChannel('flyerfootprints-webhook', '1yLOt-6REcHH5Sbjl4E_YyDutU665Vrg0xLwmrrcsXWg');
