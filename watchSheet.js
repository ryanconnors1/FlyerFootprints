const { google } = require('googleapis')
require('dotenv').config();

const SHEET_ID = '1yLOt-6REcHH5Sbjl4E_YyDutU665Vrg0xLwmrrcsXWg'
const WEBHOOK_URL = 'https://flyerfootprints.onrender.com/webhook'

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const watchSheet = async () => {
    const drive = google.drive({ version: 'v3', auth: await auth.getClient() });

    try {
        const response = await drive.files.watch({
            fileId: SHEET_ID,
            requestBody: {
                id: 'flyerfootprints-webhook',
                type: 'web_hook',
                address: WEBHOOK_URL
            }
        });
        console.log('Watch channel created:', response.data);
    } catch (error) {
        console.error('Error creating watch channel:', error);
    }

    watchFile();
}