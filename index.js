const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { watchSheet } = require('./watchSheet');
const { fetchDataFromSheet } = require('./syncInternshipData');
require('dotenv').config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Flyer Footprints API!');
});

app.post('/webhook', (req, res) => {
  console.log('Received a webhook request:', req.body);
  res.status(200).send('OK'); // Respond to the Google Sheets

  fetchDataFromSheet()
    .then(() => console.log('Data successfully fetched from Google Sheets'))
    .catch(err => console.error('Error fetching data from Google Sheets:', err));
});

app.get('/api/test', async (req, res) => {
  try {
    console.log('Received a request to /api/test');
    const result = await pool.query('SELECT NOW()');
    console.log('Query successful:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /api/test:', err); // Log the full error object
    res.status(500).send(`Server error: ${err.message || 'Unknown error'}`); // Send detailed error to client
  }
});

(async () => {
  try {
      console.log('Fetching initial data...');
      await fetchDataFromSheet();
      console.log('Initial data fetch complete.');

      console.log('Setting up watch channel...');
      await watchSheet();
      console.log('Watch channel setup complete.');
  } catch (error) {
      console.error('Error during startup:', error);
  }
})();

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));