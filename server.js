// links express and mysql
const express = require('express');
const mysql = require('mysql2');

// Using localhost 3001
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: ''
    },
    console.log(`Connected!`)
  );
  
  // Query database
  db.query('SELECT * FROM ', function (err, results) {
    console.log(results);
  });
  
  // listen for incoming connections on the specified port
  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
  });
  