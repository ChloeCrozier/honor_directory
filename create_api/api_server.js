const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

const dbPath = path.join(__dirname, '../create_db/student_data.db');
const db = new sqlite3.Database(dbPath);

app.use(express.static(path.join(__dirname, '../user_Search/public')));

// Update your API endpoint to handle tokenized search and pagination
app.get('/api/honorsData/:name/:page', (req, res) => {
    const { name, page } = req.params;
    const currentPage = parseInt(page, 10) || 1; // Parse the page parameter as an integer, default to 1 if not provided

    // Tokenize the input name
    const searchTokens = name.toLowerCase().split(' ');

    // Calculate the offset based on the current page and items per page (e.g., 15)
    const itemsPerPage = 10;
    const offset = (currentPage - 1) * itemsPerPage;

    // Use prepared statements to prevent SQL injection
    const query = `
        SELECT name, year, 
               COALESCE(fall, 'N/A') AS fall, 
               COALESCE(spring, 'N/A') AS spring 
        FROM student_data 
        WHERE ${searchTokens.map(token => `LOWER(name) LIKE '%${token}%'`).join(' AND ')}
        LIMIT ${itemsPerPage} OFFSET ${offset}
    `;
    // console.log('Query:', query);

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