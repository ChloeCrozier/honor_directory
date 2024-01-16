// http-server -c-1 .
// cd create_api ; lsof -i :3000 ; kill -9 $(lsof -t -i:3000) ; node api_server.js
# Honors Directory

**Honor Directory** is a simple project that automates the process of updating a student database with honors listings from various sources. The project uses web scraping to gather information and updates a SQLite database with details of students who have received honors.

## Usage

1. **Clone the repository:**

    ```bash
    git clone https://github.com/ChloeCrozier/honor_directory.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd honor_directory
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Update the student database with honors listings:**

    ```bash
    node index.js
    ```

   This command will scrape honors listings from specified URLs and update the SQLite database accordingly.
