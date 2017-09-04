var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: "bamazon_db"
});

connection.connect();

connection.query('SELECT `item_id`, `product_name`, `price` FROM `products`', function(error, results) {
  if (error) throw error;
  for (var product in results) {
    var product_info =
      "ITEM ID: " + results[product].item_id + "\n" +
      "PRODUCT: " + results[product].product_name + "\n" +
      "PRICE: " + results[product].price + "\n";
    console.log(product_info);
  }
});

var questions = [{
    type: 'input',
    name: 'item_id',
    message: 'What is the ID of the product you would like to buy?',
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  },
  {
    type: 'input',
    name: 'stock',
    message: 'How many units would you like to buy?',
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }
];

inquirer.prompt(questions).then(function(answers) {
  //console.log(JSON.stringify(answers, null, '  '));
  connection.query('SELECT `stock_quantity` FROM `products` WHERE `item_id` = ?', [parseInt(answers.item_id)], function(error, results) {
    if (error) throw error;
    console.log(results[0].stock_quantity);
  });
  connection.end();
});
