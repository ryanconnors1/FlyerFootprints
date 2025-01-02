const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Flyer Footprints API!');
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



// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));