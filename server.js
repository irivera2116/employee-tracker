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

const viewRoles = () => {
  db.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id', function (err, results) {
    console.log('');
    console.table(results);
    initialPrompt();
  });
}

const viewEmployees = () => {
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, "", manager.last_name) AS manager FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id ORDER BY employee.id ASC;', function (err, results) {
    console.log('');
    console.table(results);
    initialPrompt;
  });
}

const addDept = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department being added?'
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      let newDept = answers.departmentName;
      console.log(newDept);
      db.query(sql, newDept, function (err, result) {
        if (err) throw err;
        console.log('');
        console.log(`Added ${newDept} to the database`);
        initialPrompt;
      });
    })
}

function addRole() {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    const departments = results.map(({ id, name }) => ({
      name: name,
      value: id
    }));
    inquirer
      .prompt([
        {
          type: 'input',
          name: "role",
          message: "What is the name of the new role?"
        },
        {
          type: "list",
          name: "departmentRole",
          message: "What department does this new role fall under?",
          choices: departments
        },
        {

          type: "input",
          name: "salaryRole",
          message: "What is the annual salary associated with this position?"
        }
      ])
      .then((answers) => {
        const newRole = Object.values(answers);
        console.log(newRole);
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        db.query(sql, newRole, function (err, results) {
          if (err) throw err;
          console.log('');
          console.log(`Added ${newRole} to the database`);
          initialPrompt();
        });
      })
  })
}

