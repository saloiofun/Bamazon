var Mysql = require('mysql');
var Inquirer = require('inquirer');
var Table = require('cli-table');

var connection = Mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: "bamazon_db"
});

connection.connect();

var viewProductSalesByDepartment = function() {
  var sql =
    "SELECT d.*, SUM(ifnull(p.`product_sales`,0)) 'product_sales', ifnull(SUM(p.`product_sales` - d.`over_head_costs`),0) as 'total_profit'" +
    "FROM ?? as d LEFT JOIN ?? as p " +
    "ON d.?? = p.??" +
    "GROUP BY d.??" +
    "ORDER BY d.??;";
  var inserts = ['departments', 'products', 'department_name', 'department_name', 'department_name', 'department_id'];
  sql = Mysql.format(sql, inserts);
  connection.query(sql, function(error, results) {
    if (error) throw error;
    // instantiate
    var table = new Table({
      head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit'],
      colWidths: [20, 20, 20, 20, 20]
    });
    for (var key in results) {
      if (results.hasOwnProperty(key)) {
        var productArray = [results[key].department_id, results[key].department_name, results[key].over_head_costs, results[key].product_sales, results[key].total_profit];
        table.push(productArray);
      }
    }
    console.log(table.toString());
  });
};

var createNewDepartment = function() {
  var questions = [{
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?'
    },
    {
      type: 'input',
      name: 'cost',
      message: 'What is the Over Head Cost?',
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ];
  Inquirer.prompt(questions).then(function(answers) {
    connection.query({
      sql: 'INSERT INTO `departments` SET department_name = ?, over_head_costs  = ?',
      values: [answers.department, answers.cost]
    }, function(error, results) {
      if (error) throw error;
      console.log("New Department Added!");
    });
  });
};

var supervisorInquirer = function() {
  Inquirer.prompt([{
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [
      '* View Product Sales by Department',
      '* Create New Department'
    ]
  }]).then(function(answer) {
    switch (answer.choice) {
      case '* View Product Sales by Department':
        viewProductSalesByDepartment();
        break;
      case '* Create New Department':
        createNewDepartment();
        break;
      default:

    }
  });
};

supervisorInquirer();
