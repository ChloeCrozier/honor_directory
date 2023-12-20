function updateTable() {
    const searchInput = document.getElementById("search");
    const searchTerm = searchInput.value.trim();

    // Fetch data from the server
    fetch(`http://localhost:3000/api/honorData`)
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

            // Filter and populate the table
            const filteredData = data.filter(entry =>
                entry.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const tableBody = document.querySelector("#resultTable tbody");
            tableBody.innerHTML = ""; // Clear previous content

            filteredData.forEach(entry => {
                const row = tableBody.insertRow();
                const nameCell = row.insertCell(0);
                const yearCell = row.insertCell(1);
                const fallAwardsCell = row.insertCell(2);
                const springAwardsCell = row.insertCell(3);

                nameCell.textContent = entry.name;
                yearCell.textContent = entry.year;

                // Check for null or undefined values before setting textContent
                fallAwardsCell.textContent = entry.fall !== null ? entry.fall : "N/A";
                springAwardsCell.textContent = entry.spring !== null ? entry.spring : "N/A";
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again.');
        });
}

document.getElementById("search").addEventListener("input", updateTable);

// Initial table update
updateTable();