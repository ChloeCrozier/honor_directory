const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Add CORS middleware

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Connect to SQLite database (replace 'your_database.db' with your actual database file)
const db = new sqlite3.Database('student_data.db');

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to retrieve honor data from the database
// Endpoint to retrieve honor data from the database
app.get('/api/honorData', (req, res) => {
    const { search, year } = req.query;
    let query = 'SELECT id, name, year, fall, spring FROM student_data';

    // Add conditions based on query parameters
    if (search) {
        query += ` WHERE name = '${search}'`;
    }

    if (year) {
        query += `${search ? ' AND' : ' WHERE'} year = ${year}`;
    }

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error executing database query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});