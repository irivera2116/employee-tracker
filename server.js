const inquirer = require('inquirer');
const sql = require('mysql2');

// Connection to mysql
const connecting =  sql.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "",
  database: "business_db",
});

connecting.connect((err) => {
  if (err) throw err;
  console.log('connected to database');
  start();
})

function start() {
  inquirer
      .prompt({
          type: "list",
          name: "selection",
          message: "What are you looking for?",
          choices: [
              "View departments",
              "View roles",
              "View all employees",
              "Add a department",
              "Add a role",
              "Add an employee",
              "Add a manager",
              "Update an employee role",
              "View Employees by Manager",
              "View Employees by Department",
              "Delete Departments | Roles | Employees",
              "Exit",
          ],
      }) .then((result) => {
          switch (result.action) {
              case "View departments":
                  viewDept();
                  break;
              case "View roles":
                  viewRoles();
                  break;
              case "View employees":
                  viewEmployees();
                  break;
              case "Add a department":
                  addDept();
                  break;
              case "Add a role":
                  addRole();
                  break;
              case "Add an employee":
                  addEmployee();
                  break;
              case "Add a manager":
                  addManager();
                  break;
              case "Update an employee role":
                  updateEmployeeRole();
                  break;
              case "View Employees by Manager":
                  viewEmployeesByManager();
                  break;
              case "View Employees by Department":
                  viewEmployeesByDepartment();
                  break;
              case "Delete Departments | Roles | Employees":
                  deleteDepartmentsRolesEmployees();
                  break;
              case "Exit":
                  connection.end();
                  console.log("Thank You!");
                  break;
          }
      })
}

function viewDept() {
  const query = 'SELECT * FROM departments';
  connecting.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      start()
  })
}

function viewRoles() {
  const query = `
  SELECT roles.title, roles.id, departments.department_name, roles.salary 
  FROM roles 
  JOIN departments ON roles.department_id = departments.id`;

  connecting.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
  });
}

function viewEmployees() {
  const query = ` SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
  FROM employee e
  LEFT JOIN roles r ON e.role_id = r.id
  LEFT JOIN departments d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id;`;

  connecting.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
  })
}

function addDept() {
  inquirer
      .prompt({
          type: 'input',
          name: "name",
          message: 'Enter the new department name: ',
      }) .then((result) => {
          console.log(result.name);
          const query = `INSERT INTO departments (department_name) VALUES ("${result.name}")`;

          connecting.query(query, (err, res) => {
              if(err) throw err;
              console.log(`added the new department ${result.name} to the database`);
              start();
              console.log(result.name);
          })
      })
}

function addRole() {
  const query = `SELECT * FROM departments`;
  connecting.query(query, (err, res) => {
      if(err) throw err;
      inquirer
          .prompt([
              {
                  type: "input",
                  name: "title",
                  message: "What is the new role being created?",
              },
              {
                  type: "input",
                  name: "salary",
                  message: "What is the salary?",
              },
              {
                  type: "list",
                  name: "department",
                  message: "What department is the new role associated with?",
                  choices: res.map(
                      (department) => department.department_name
                  ),
              },
          ]) .then((result) => {
              const department = res.find(
                  (department) => department.name === result.department
              );
              const query = `INSERT INTO roles SET ?`;
              connecting.query(query, 
                  {
                      title: result.title,
                      salary: result.salary,
                      department_id: department,
                  }, 
                  (err, res) => {
                      if(err) throw err;
                      console.log( `Added role ${result.title} with salary ${result.salary} to the ${result.department} department in the database!`
                      );
                      start();
                  })
          })
  })
}

function addEmployee() {
  connecting.query(`SELECT id, title FROM roles`, (error, results) => {
      if(error) {
          console.error(error);
          return;
      }

      const roles = results.map(({ id, title }) => ({
          name: 'title',
          value: 'id',
      }));

      connecting.query(
          `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`, (error, results) => {
              if(error) {
                  console.log(error);
                  return;
              }
      
              const managers = results.map(({ id, name }) => ({
                  name,
                  value: id,
              }));

              inquirer
                  .prompt([
                      {
                          type: "input",
                          name: "firstName",
                          message: "What is the employee's first name?",
                      },
                      {
                          type: "input",
                          name: "lastName",
                          message: "What is the employee's last name?",
                      },
                      {
                          type: "list",
                          name: "roleId",
                          message: "Choose a role for the new employee.",
                          choices: roles,
                      },
                      {
                          type: "list",
                          name: "managerId",
                          message: "Who is the manager?",
                          choices: [
                              { name: "None", value: null },
                              ...managers,
                          ],
                      },
                  ]) .then((result) => {
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                      const values = [
                          result.firstName,
                          result.lastName,
                          result.roleId,
                          result.managerId,
                      ];
                      connecting.query(sql, values, (error) => {
                          if(error) {
                              console.log(error);
                              return;
                          }

                          console.log('Employee added')
                          start();
                      })
                  })
                  .catch((error) => {
                      console.log(error);
                  })
          }
      )
  })
}

function addManager() {
  const queryDepart = "SELECT * FROM departments";
  const queryEmpl = "SELECT * FROM employee";

  connecting.query(queryDepart, (err, resDepart) => {
      if (err) throw err;
      connecting.query(queryEmpl, (err, resEmpl) => {
          if (err) throw err;
          inquirer
              .prompt([
                  {
                      type: "list",
                      name: "department",
                      message: "Select the department:",
                      choices: resDepart.map(
                          (department) => department.department_name
                      ),
                  },
                  {
                      type: "list",
                      name: "employee",
                      message: "Select the employee to add a manager to:",
                      choices: resEmpl.map(
                          (employee) =>
                              `${employee.first_name} ${employee.last_name}`
                      ),
                  },
                  {
                      type: "list",
                      name: "manager",
                      message: "Select the employee's manager:",
                      choices: resEmpl.map(
                          (employee) =>
                              `${employee.first_name} ${employee.last_name}`
                      ),
                  },
              ])
              .then((result) => {
                  const department = resDepart.find(
                      (department) =>
                          department.department_name === result.department
                  );
                  const employee = resEmpl.find(
                      (employee) =>
                          `${employee.first_name} ${employee.last_name}` ===
                          result.employee
                  );
                  const manager = resEmpl.find(
                      (employee) =>
                          `${employee.first_name} ${employee.last_name}` ===
                          result.manager
                  );
                  const query =
                      "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
                  connecting.query(query,
                      [manager.id, employee.id, department.id],
                      (err, res) => {
                          if (err) throw err;
                          console.log(
                              `Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.department_name}!`
                          );
                          start();
                      }
                  );
              });
      });
  });
}