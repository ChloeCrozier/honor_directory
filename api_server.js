const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const db = new sqlite3.Database('student_data.db');

app.use(express.static('public'));

app.get('/api/honorData/:name', (req, res) => {
    const { year } = req.query;
    const { name } = req.params;

    let query = 'SELECT id, name, year, fall, spring FROM student_data';

    // Add conditions based on query parameters
    if (name) {
        // Use SQL LIKE operator to match names containing the route parameter
        query += ` WHERE name LIKE '%${name}%'`;
    }

    if (year) {
        query += `${name ? ' AND' : ' WHERE'} year = ${year}`;
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
