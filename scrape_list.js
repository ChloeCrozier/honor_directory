const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeList(url) {
  try {
    // Fetch the HTML content of the page using axios
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract student names using a more specific selector
    const studentNames = $('.wp-block-column ul li')
      .map((index, element) => $(element).text().trim())
      .get();

    // Return the list of student names
    return studentNames;
  } catch (error) {
    // Handle errors
    console.error(`Error scraping list from ${url}:`, error.message);
    return [];
  }
};

// // Example usage
// const targetUrl = 'https://news.clemson.edu/spring-of-2023-presidents-list/';
// scrapeList(targetUrl).then((studentNames) => {
//   console.log(studentNames);
// });
  
module.exports = scrapeList;