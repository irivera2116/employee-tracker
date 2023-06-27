// link mysql, inquirer, console table
const mysql = require('mysql12');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;

const data = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'business_db'
  });

  db.connect((err) => {
    if (err) throw err;
    console.log(`Connected to business_db`);
    initialPrompt();
  });

  const viewDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
      console.log('');
      console.table(results);
      initialPrompt();
    });
  }

  