const axios = require('axios');
const cheerio = require('cheerio');

// Use function declaration instead of assignment for getArchives
async function getArchives(url) {
  try {
    // Make an HTTP request to fetch the HTML content
    const response = await axios.get(url);
    const html = response.data;

    // Use Cheerio to load the HTML content for manipulation
    const $ = cheerio.load(html);

    // Select all anchor elements with the class 'entry-alt-block'
    const anchorElements = $('.entry-alt-block');

    // Extract URLs, semesters, and years
    const archives = anchorElements.map((index, element) => {
      const url = $(element).attr('href'); // Corrected to find 'a' tag
      const title = $(element).find('h3.entry-title').text();

      // Extract semester and year from the title using a regular expression
      const matches = title.match(/(Spring|Fall) of (\d{4})/i);
      const semester = matches ? matches[1] : 'unknown';
      const year = matches ? parseInt(matches[2], 10) : 0;

      return { url, semester, year };
    }).get();

    return archives;
  } catch (error) {
    // Handle errors
    console.error(`Error fetching and parsing archives from ${url}:`, error.message);
    return [];
  }
}

// // Example usage
// const targetUrl = 'https://news.clemson.edu/tag/presidents-list/';
// getArchives(targetUrl).then((archives) => {
//   console.log(archives);
// });

module.exports = getArchives;