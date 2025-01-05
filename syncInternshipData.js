// Description: This script fetches data from a Google Sheet and syncs it with a PostgreSQL database.

const { google } = require('googleapis')
const pool = require('./db')


const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
const SHEET_ID = '1yLOt-6REcHH5Sbjl4E_YyDutU665Vrg0xLwmrrcsXWg'
const RANGE = 'Database!A:G' // Read all rows, columns A-G

const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

// Fetch data from the Google Sheet and sync it with the database
const fetchDataFromSheet = async () => {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    try {
        response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: RANGE
        });
        const rows = response.data.values;
        // Make sure there is more than just the header row
        if (rows && rows.length > 1) {
            //console.log('Fetched rows:', rows);

            // Map the Google Sheet data to a format for comparison
            const sheetRows = rows.slice(1).map(row => ({
                company: row[0],
                moreInfo: row[1],
                location: row[2],
                industry: row[3],
                term: row[4],
                year: row[5],
                major: row[6]
            }));

            // Insert rows into database that are not already present
            for (let i = 0; i < sheetRows.length; i++) {
                const { company, moreInfo, location, industry, term, year, major } = sheetRows[i];
                // Trim and validate year
                const trimmedYear = year ? year.trim() : null;
                const parsedYear = parseInt(trimmedYear, 10);
        
                if (isNaN(parsedYear)) {
                    console.warn(`Skipping row ${i + 1}: Invalid year value "${year}"`);
                    continue; // Skip rows with invalid year values
                }

                try {
                    const result = await pool.query(
                        `INSERT INTO internships (company, moreInfo, location, industry, term, year, major) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7)
                         ON CONFLICT (company, moreInfo, location, industry, term, year, major) DO NOTHING`,
                        [company, moreInfo, location, industry, term, parsedYear, major]
                    );
                    if (result.rowCount > 0) {
                        console.log(`Inserted row: ${company}, ${moreInfo}, ${location}, ${industry}, ${term}, ${parsedYear}, ${major}`);
                    }            
                } catch (dbError) {
                    console.error(`Error inserting row ${i + 1}:`, dbError);
                }
            }

            // Logic to delete rows no longer present in the Google Sheet
            const dbRows = await pool.query('SELECT * FROM internships');
            // console.log('Fetched rows from the database:', dbRows.rows);
            // Find rows in the database that are not in the sheet
            const rowsToDelete = dbRows.rows.filter(dbRow =>
                !sheetRows.some(sheetRow =>
                    sheetRow.company === dbRow.company &&
                    sheetRow.moreInfo === dbRow.moreinfo &&
                    sheetRow.location === dbRow.location &&
                    sheetRow.industry === dbRow.industry &&
                    sheetRow.term === dbRow.term &&
                    parseInt(sheetRow.year, 10) === dbRow.year &&
                    sheetRow.major === dbRow.major
                )
            );
            // Delete rows no longer present in the sheet
            for (const row of rowsToDelete) {
                const result = await pool.query('DELETE FROM internships WHERE id = $1', [row.id]);
                if (result.rowCount > 0) {
                    console.log(`Deleted row: ${row.company}, ${row.moreInfo}, ${row.location}, ${row.industry}, ${row.term}, ${row.year}, ${row.major}`);
                }
            }

            console.log('Sheet data succcessfully synced with the database');
        } else {
            console.log('No data found in the sheet');
        }
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
    }
}

module.exports = { fetchDataFromSheet };
