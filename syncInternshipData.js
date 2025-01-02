// Description: This script fetches data from a Google Sheet and syncs it with a PostgreSQL database.

const { google } = require('googleapis')
const pool = require('./db')


const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
const SHEET_ID = '1yLOt-6REcHH5Sbjl4E_YyDutU665Vrg0xLwmrrcsXWg'
const RANGE = 'Database!A:F' // Read all rows, columns A-F

const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

const fetchDataFromSheet = async () => {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    try {
        response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: RANGE
        });
        const rows = response.data.values;
        if (rows.length) {
            console.log('Fetched rows:', rows);
            // Insert rows into database, starting from index 1 to skip the header
            for (let i = 1; i < rows.length; i++) {
                const [company, location, industry, term, year, major] = rows[i];
                await pool.query(
                    'INSERT INTO internships (company, location, industry, term, year, major) VALUES ($1, $2, $3, $4, $5, $6)',
                    [company, location, industry, term, parseInt(year), major]
                );
            }
            console.log('Sheet data succcessfully synced with the database');
        } else {
            console.log('No data found in the sheet');
        }
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
    }
}

fetchDataFromSheet();