var Mysql = require("mysql");
var Inquirer = require("inquirer");
var Table = require('cli-table');

var connection = Mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: "bamazon_db"
});

connection.connect();

var showAllProducts = function() {
  connection.query('SELECT `item_id`, `product_name`, `price` FROM `products`', function(error, results) {
    if (error) throw error;
    var table = new Table({
      head: ['Product ID', 'Product Name', 'Price'],
      colWidths: [15, 60, 10]
    });
    for (var product in results) {
      var product_info = [results[product].item_id, results[product].product_name, results[product].price];
      table.push(product_info);
    }
    console.log(table.toString());
  });
};

var fulfillOrder = function(item_id, stock_quantity, units) {
  connection.query({
    sql: 'UPDATE `products` SET `stock_quantity` = ? WHERE item_id = ?',
    values: [stock_quantity - units, item_id]
  }, function(error, results) {
    if (error) throw error;
    console.log("ORDER COMPLETED!");
  });
};

var updateTotalRevenue = function(item_id, total) {
  connection.query({
    sql: 'UPDATE `products` SET `product_sales` = ifnull(`product_sales`, 0) + ? WHERE item_id = ?',
    values: [total, item_id]
  }, function(error, results) {
    if (error) throw error;
  });
};

var orderTotal = function(item_id, units) {
  connection.query({
    sql: 'SELECT `price` from `products` WHERE item_id = ?',
    values: [item_id]
  }, function(error, results) {
    var unitPrice = results[0].price;
    var total = unitPrice * units;
    console.log("YOUR TOTAL IS: $" + total);
    updateTotalRevenue(item_id, total);
  });
};

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
    name: 'units',
    message: 'How many units would you like to buy?',
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }
];

var customerInquirer = function(questions) {
  Inquirer.prompt(questions).then(function(answers) {
    var item_id = parseInt(answers.item_id);
    var units = parseInt(answers.units);
    connection.query({
      sql: 'SELECT `stock_quantity` FROM `products` WHERE `item_id` = ?',
      values: [item_id]
    }, function(error, results) {
      if (error) throw error;
      var stock_quantity = results[0].stock_quantity;
      if (stock_quantity >= units) {
        fulfillOrder(item_id, stock_quantity, units);
        orderTotal(item_id, units);
        // connection.end();
      } else {
        console.log("Insufficient quantity!");
      }
    });
  });
};

showAllProducts();
customerInquirer(questions);
