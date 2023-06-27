INSERT INTO department (name)
VALUES ("Sales"),
       ("Marketing"),
       ("Human Resources"),
       ("Management"),
       ("Production");

INSERT INTO role (title, department_id, salary)
VALUES
    ("Site Manager", 250000, 4),
    ("Production Manager", 175000, 4),
    ("Human Resources Manager", 100000, 3),
    ("Human Resources Administator", 80000, 3),
    ("Sales Manager", 75000, 1),
    ("Sales Representative", 65000, 1),
    ("Marketing Management", 65000, 2),
    ("Marketing Officer", 60000, 2),
    ("Packer/Palletizer", 40000, 5),
    ("Seasoning Operator", 42000, 5),
    ("Cooking Operator", 47000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Doe", 5, NULL),
    ("Jane", "Smith", 7, NULL),
    ("Steven", "Chavez", 1, NULL),
    ("Lisa", "James", 6, 1);