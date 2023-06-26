// Access inquirer for the question prompt
const inquirer = require('inquirer');

inquirer
    .createPromptModule([
        {
            type: 'list',
            message: 'What do you need?',
            choices: ['View Employees', 'View all Roles', 'View all Departments', 'Add Employee', 'Add Role', 'Add Departmnet', 'Update Role', 'Quit'],
        },
    ]);
    