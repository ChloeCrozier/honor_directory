function updateTable() {
    const searchInput = document.getElementById("search");
    const searchTerm = searchInput.value.trim();

    // Fetch data from the server
    fetch(`http://localhost:3000/api/honorData/${encodeURIComponent(searchTerm)}`)
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
            tableBody.innerHTML = ""; // Clear previous content

            // Iterate through the data and create rows
            data.forEach(entry => {
                const row = tableBody.insertRow();
                const nameCell = row.insertCell(0);
                const yearCell = row.insertCell(1);
                const fallAwardsCell = row.insertCell(2);
                const springAwardsCell = row.insertCell(3);

                // Populate cells with data
                nameCell.textContent = entry.Name; // Note the capital 'N' in 'Name'
                yearCell.textContent = entry.Year;
                fallAwardsCell.textContent = entry.Fall !== "N/A" ? entry.Fall : "N/A";
                springAwardsCell.textContent = entry.Spring !== "N/A" ? entry.Spring : "N/A";
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again.');
        });
}

function debounce(callback, delay) {
    let timer
    return function() {
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback();
        }, delay)
    }
}
// debounce by wating 250 ms for each updateTable call
const debouncedUpdate = debounce(updateTable, 250);

document.getElementById("search").addEventListener("input", debouncedUpdate);