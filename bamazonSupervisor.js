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
    "FROM ?? as d, ?? as p " +
    "WHERE d.?? = p.??" +
    "GROUP BY d.??";
  var inserts = ['departments', 'products', 'department_name', 'department_name', 'department_name'];
  sql = Mysql.format(sql, inserts);
  connection.query(sql, function(error, results) {
    if (error) throw error;
    console.log(results);
  });
};

var createNewDepartment = function() {
  console.log("Working in progress");
};


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
