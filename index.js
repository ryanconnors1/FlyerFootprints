const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');
const { initializeWatch } = require('./watchSheet');
const { fetchDataFromSheet } = require('./syncInternshipData');
require('dotenv').config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// Webhook route for Google Sheets
let isFetching = false;
app.post('/webhook', async (req, res) => {
    if (isFetching) return res.status(200).send('Already processing');
    isFetching = true;
    try {
        await fetchDataFromSheet();
        console.log('Data successfully fetched from Google Sheets');
    } catch (err) {
        console.error('Error fetching data from Google Sheets:', err);
    } finally {
        isFetching = false;
        res.status(200).send('OK');
    }
});

// Backend API route for searching and filtering internships
app.get('/internships', async (req, res) => {
  const { company, location, industry, term, major } = req.query;

  // Where clause conditions and values
  const conditions = [];
  const values = [];

  if (company) {
      const sanitizedCompany = company.replace(/,/g, '');
      conditions.push(`REPLACE(company, ',', '') ILIKE $${conditions.length + 1}`);
      values.push(`%${sanitizedCompany}%`);
  }
  if (location) {
      const sanitizedLocation = location.replace(/,/g, '');
      conditions.push(`REPLACE(location, ',', '') ILIKE $${conditions.length + 1}`);
      values.push(`%${sanitizedLocation}%`);
  }
  if (industry) {
      conditions.push(`industry ILIKE $${conditions.length + 1}`);
      values.push(`%${industry}%`);
  }
  if (term) {
      conditions.push(`term ILIKE $${conditions.length + 1}`);
      values.push(`%${term}%`);
  }
  if (major) {
      conditions.push(`major ILIKE $${conditions.length + 1}`);
      values.push(`%${major}%`);
  }

  const query = `
      SELECT * FROM internships
      ${conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''}
  `;

  try {
      const result = await pool.query(query, values);
      res.json(result.rows);
  } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Backend API route for fetching distinct values of a column
app.get('/attributes/:column', async (req, res) => {
    const { column } = req.params;
    const allowedColumns = ['industry', 'major', 'term', 'company', 'location'];
  
    if (!allowedColumns.includes(column)) {
      return res.status(400).json({ error: 'Invalid column' });
    }
  
    try {
      const query = `SELECT DISTINCT ${column} FROM internships ORDER BY ${column}`;
      const result = await pool.query(query);
      const uniqueValues = result.rows.map((row) => row[column]);
      res.json(uniqueValues);
    } catch (error) {
      console.error(`Error fetching distinct ${column}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

(async () => {
  try {
      console.log('Fetching initial data...');
      await fetchDataFromSheet();
      console.log('Initial data fetch complete.');

      console.log('Setting up watch channel...');
      await initializeWatch();
      console.log('Watch channel setup complete.');
  } catch (error) {
      console.error('Error during startup:', error);
  }
})();

// Start server
const PORT = process.env.PORT || 8000;
console.log(`Configured PORT: ${PORT}`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));