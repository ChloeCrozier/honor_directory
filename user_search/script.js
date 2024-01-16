// Global variable to keep track of the current page
let sortColumn = '';
let currentPage = 1;
let entriesCount = 0;

function updateEntriesCount() {
    const entriesCountElement = document.getElementById("entriesShowing");
    entriesCountElement.textContent = entriesCount;
}

function resetEntriesCount() {
    entriesCount = 0;
}

function sortTable(column) {
    // Toggle sorting direction if clicking on the same column
    if (sortColumn === column) {
        sortDirection *= -1;
    } else {
        sortColumn = column;
        sortDirection = 1;
    }

    // Remove sorting indicators from all columns
    document.querySelectorAll('th.sortable').forEach(th => {
        th.classList.remove('desc');
    });

    // Add sorting indicator to the clicked column
    const clickedColumn = document.querySelector(`th.sortable[onclick="sortTable('${column}')"]`);
    if (clickedColumn) {
        clickedColumn.classList.toggle('desc', sortDirection === -1);
    }

    // Call the updateTable function with the current search term and page
    const searchInput = document.getElementById("search");
    const searchTerm = searchInput.value.trim();
    updateTable(searchTerm, currentPage);
}

function updateTable(searchTerm, page) {
    // Log to check if the function is being called
    console.log('Update Table called with page:', page);

    // Fetch data from the server with pagination
    const apiUrl = `http://localhost:3000/api/honorsData/${encodeURIComponent(searchTerm)}/${page}`;

    // Check if the search term is empty
    const isSearchTermEmpty = searchTerm.trim() === '';

    // If the search term is empty and it's the first page, don't make the API call
    if (isSearchTermEmpty && page === 1) {
        console.log('Search term is empty on the first page. No API call made.');
        return;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Check if data is an array
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format received from the server');
            }

            // Reference to the table body
            const tableBody = document.querySelector("#resultTable tbody");

            // Clear previous content if it's the first page
            if (page === 1) {
                tableBody.innerHTML = "";
                resetEntriesCount();
            }

            // Iterate through the data and create rows
            data.forEach(entry => {
                const row = tableBody.insertRow();
                const nameCell = row.insertCell(0);
                const yearCell = row.insertCell(1);
                const fallAwardsCell = row.insertCell(2);
                const springAwardsCell = row.insertCell(3);

                // Populate cells with data
                nameCell.textContent = entry.Name;
                yearCell.textContent = entry.Year;
                fallAwardsCell.textContent = entry.fall !== "N/A" ? entry.fall : "N/A";
                springAwardsCell.textContent = entry.spring !== "N/A" ? entry.spring : "N/A";
                entriesCount++;
            });

            // Update entries count after the table is updated
            updateEntriesCount();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again.');
        });
}

// Function to load more results
function loadMore() {
    console.log('Load More button clicked');
    // Increment the current page
    currentPage++;

    // Call the updateTable function with the current search term
    const searchInput = document.getElementById("search");
    const searchTerm = searchInput.value.trim();
    updateTable(searchTerm, currentPage);
}

// Debounce function
function debounce(callback, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, arguments);
        }, delay);
    };
}

// debounce by waiting 250 ms for each updateTable call
const debouncedUpdate = debounce(function (searchTerm) {
    // Reset the current page when a new search term is entered
    currentPage = 1;
    updateTable(searchTerm, currentPage);
}, 250);

// Attach the debouncedUpdate function to the input event
document.getElementById("search").addEventListener("input", function () {
    debouncedUpdate(this.value.trim());
});

// Attach the loadMore function to the click event of the "Load More" button
document.getElementById("loadMoreBtn").addEventListener("click", loadMore);

// Initial load without specifying a search term
updateTable('', currentPage);