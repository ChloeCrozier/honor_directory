const sqlite3 = require('sqlite3').verbose();
const scrapeList = require('./scrape_list');
const getArchives = require('./get_list_archive');

// Open a SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('student_data.db');

// Create the student_data table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS student_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Year INTEGER,
    Fall TEXT,
    Spring TEXT
  )
`);

// Function to check if a name already exists for a given year and semester
const checkIfEntryExists = (name, year) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM student_data WHERE name = ? AND year = ?', [name, year], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Function to insert data into the database
const insertData = async (name, year, semester, listType) => {
  const existingData = await checkIfEntryExists(name, year);

  if (existingData) {
    // Entry exists, update the corresponding column based on semester
    const { fall, spring } = existingData;

    if (semester === 'Fall') {
      db.run('UPDATE student_data SET fall = ? WHERE name = ? AND year = ?', [listType, name, year]);
    } else if (semester === 'Spring') {
      db.run('UPDATE student_data SET spring = ? WHERE name = ? AND year = ?', [listType, name, year]);
    }
  } else {
    // Entry doesn't exist, insert a new row
    const stmt = db.prepare('INSERT INTO student_data (name, year, fall, spring) VALUES (?, ?, ?, ?)');

    if (semester === 'Fall') {
      stmt.run(name, year, listType, 'N/A');
    } else if (semester === 'Spring') {
      stmt.run(name, year, 'N/A', listType);
    }

    stmt.finalize();
  }
};

// Function to update the database based on the scraped list
const updateDatabase = async (url, listType) => {
  try {
    const archives = await getArchives(url);

    for (const archive of archives) {
      const { url: listUrl, semester, year } = archive;

      console.log(`Scraping ${listType} for ${semester} of ${year}`);
      const names = await scrapeList(listUrl);

      for (const name of names) {
        // Update the corresponding column based on semester
        await insertData(name, year, semester, listType);
      }
    }
  } catch (error) {
    console.error('Error updating database:', error.message);
  }
};

// Example usage
(async () => {
  // Update for Presidents List
  await updateDatabase('https://news.clemson.edu/tag/presidents-list/', 'President\'s List');

  // Update for Deans List
  await updateDatabase('https://news.clemson.edu/tag/deans-list/', 'Dean\'s List');

  // Close the database connection after all operations are completed
  db.close();
})();