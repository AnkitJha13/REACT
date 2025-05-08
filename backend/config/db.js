const mysql = require('mysql2'); // Correctly importing mysql2
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Immortalsoul@69',
  database: 'practiceReactNodeNavbar'
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit if there's a connection error
  }
  console.log("Connected to the MySQL database");
});

module.exports = connection; // Export the connection object for use in other files
