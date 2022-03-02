USE teamtrackerdb;


INSERT INTO department (name)
VALUES ("Research"),("Legal"),("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Researcher", 180000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Aiden", "Brennan", 1, 1);