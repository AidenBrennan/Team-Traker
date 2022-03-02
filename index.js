const mysql2 = require("mysql2");
const inquirer = require("inquirer");

var connection = mysql2.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Scarecrow1!!",
  database: "teamtrackerdb"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  Greeting();
});

function Greeting() {

    inquirer
      .prompt({
        type: "list",
        name: "task",
        message: "Would you like to do?",
        choices: [
          "View Employees",
          "View Employees by Department",
          "Add Employee",
          "Remove Employees",
          "Update Employee Role",
          "Add Role",
          "Add Department",
          "Finish"]
      })
      .then(function ({ task }) {
        switch (task) {
          case "View Employees":
            viewEmployee();
            break;
          case "View Employees by Department":
            viewEmployeeByDepartment();
            break;
          case "Add Employee":
            addEmployee();
            break;
          case "Remove Employees":
            removeEmployees();
            break;
          case "Update Employee Role":
            updateEmployeeRole();
            break;
          case "Add Role":
            console.log("test")
            addRole();
            break;
          case "Add Department":
            addDepartment();
            break;
          case "Finish":
            connection.end();
            Finish();
            break;
        }
      });
  }

  function viewEmployee() {
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
    console.table(res);
    Greeting();
  });
  };

  function viewEmployeeByDepartment() {
    inquirer.prompt([{
      name: "department_id",
      message: "what is the id of the department would you like to view",
      type: "input"
    }])
    .then(function (answer) {
      var department_id = answer.department_id
      var departmentquery = "Select * FROM role WHERE department_id= ?";
      connection.query(departmentquery, department_id, function(err,res) {
        if (err) throw err;
        console.log(res);
      for (let i = 0; i <res.length; i++) {
      var roles = res[i].id;
      var employeequery = "Select * FROM employee WHERE role_id= ?";
      connection.query(employeequery, roles, function(err,res) {
        if (err) throw err;
    console.table(res);
      });
      }
    Greeting();
  });
})
};

  function addEmployee() {
  inquirer.prompt([{
    name: "first_name",
    message: "Enter first name",
    type: "input"
    }, 
    {
    name: "last_name",
    message: "Enter last name",
    type: "input"
    },
    {
    name: "role_id",
    message: "what is this employees role id number",
    type: "input"
    },
    {
      name: "manager_id",
      message: "what is this employees manager's id number",
      type: "input"
    }])
    .then(function (answer) {
      var manager_id = answer.manager_id
      var managerquery = "Select first_name, last_name FROM employee WHERE manager_id= ?";
      connection.query(managerquery,manager_id, function(err,manager) {
        if (err) throw err;
        console.log("test1")
        console.log(manager[0].first_name)
      var role_id = answer.role_id
      var rolequery = "Select title FROM role WHERE id= ?";
      connection.query(rolequery,role_id, function(err,title) {
        if (err) throw err;
        console.log(title[0].title)
      var role_id = answer.role_id
      var salaryquery = "Select salary FROM role WHERE id= ?";
      connection.query(salaryquery,role_id, function(err,salary) {
        if (err) throw err;
        console.log(salary[0].salary)
      connection.query("INSERT INTO employee SET ?"),
       {
        first_name: answer.first_name,
        last_name: answer.last_name,
        manager: manager.first_name,
        role: title,
        salary:salary
      },
        function (err, res) {
          if (err) throw err;
          console.log("employee added!");
        };
      });
      }),
    Greeting();
  });
})
};
              
                        

function removeEmployees() {
  inquirer.prompt([{
    type: "input",
    message: "What is the id of the employee you are removing",
    name: "employee_id"
  }]).then(function (answer) {
    var employee_id = answer.employee_id
    var removequery = "DELETE FROM employee WHERE id= ?;"
    connection.query(removequery,employee_id, function(err,res) {
        if (err) throw err;
        console.log("employee removed :(");
        Greeting();
      });
  });
}

function updateEmployeeRole() {
  inquirer.prompt([{
    type: "input",
    message: "enter the id of the employee you would like to update",
    name: "employee_id"
  },{
    type: "input",
    message: "what is this new employees role_id",
    name: "role_id"
  }])    .then(function (answer) {

    var employee_id = answer.employee_id
    var employeequery = "Select * FROM employee WHERE id= ?";
    connection.query(employeequery, employee_id, function(err, res) {
    if (err) throw err;
    var updatequery = "UPDATE employee SET role_id= ?";
    var role_id = answer.role_id
    connection.query(updatequery, role_id, function(err,res) {
      if (err) throw err;
      console.log(res);
        Greeting();
      });
    })
  });
}

function addRole() {
    inquirer.prompt([{
        type: "input",
        message: "What's the name of the role?",
        name: "title"
      },
      {
        type: "input",
        message: "What is this Roles Salary?",
        name: "salary"
      },
    {
      type: "input",
      message: "what is this deparments id",
      name: "department_id"
    }])
    .then(function (answer) {

      connection.query("INSERT INTO role SET ?",
       {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id
      },
        function (err, res) {
          if (err) throw err;
          console.log("Role Inserted!");
          Greeting();
        });

    });
  }

function addDepartment() {
    inquirer.prompt([{
      type: "input",
      message: "What's the name of this deparment?",
      name: "department_name"
    }])
      .then(function (answer) {
        connection.query("INSERT INTO department SET ?",
        {
          department_name: answer.department_name
        },
        function (err, res) {
          if (err) throw err;
          console.log("Department inserted");
          Greeting();
        });
    });
  }

function Finish() {
  console.log("enjoy your day")
}