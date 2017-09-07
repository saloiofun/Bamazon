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

var showAllProducts = new Promise(
  function(resolve, reject) {
    connection.query('SELECT `item_id`, `product_name`, `price` FROM `products`', function(error, results) {
      if (error) {
        reject(error);
      } else {
        var table = new Table({
          head: ['Product ID', 'Product Name', 'Price'],
          colWidths: [15, 60, 10]
        });
        for (var product in results) {
          var product_info = [results[product].item_id, results[product].product_name, results[product].price];
          table.push(product_info);
        }
        resolve(table.toString() + "\n");
      }
    });
  });

var fulfillOrder = function(itemId, stockQuantity, units) {
  connection.query({
    sql: 'UPDATE `products` SET `stock_quantity` = ? WHERE item_id = ?',
    values: [stockQuantity - units, itemId]
  }, function(error, results) {
    if (error) throw error;
    console.log("\n THANK YOU! ORDER WAS COMPLETED!");
  });
};

var updateTotalRevenue = function(itemId, total) {
  connection.query({
    sql: 'UPDATE `products` SET `product_sales` = ifnull(`product_sales`, 0) + ? WHERE item_id = ?',
    values: [total, itemId]
  }, function(error, results) {
    if (error) throw error;
  });
  connection.end();
};

var orderTotal = function(itemId, units) {
  connection.query({
    sql: 'SELECT `price` from `products` WHERE item_id = ?',
    values: [itemId]
  }, function(error, results) {
    if (error) throw error;
    var unitPrice = results[0].price;
    var total = unitPrice * units;
    console.log(" YOUR TOTAL IS: $" + total);
    updateTotalRevenue(itemId, total);
  });
};

var customerInquirer = function() {
  showAllProducts.then(function(displayProducts) {
      console.log("\n" + displayProducts + "\n");
      var questions = [{
          type: 'input',
          name: 'itemId',
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
      Inquirer.prompt(questions).then(function(answers) {
        var itemId = parseInt(answers.itemId);
        var units = parseInt(answers.units);
        if (units > 0) {
          var stockQuantity;
          connection.query({
            sql: 'SELECT `stock_quantity` FROM `products` WHERE `item_id` = ?',
            values: [itemId]
          }, function(error, results) {
            if (error) throw error;
            stockQuantity = results[0].stock_quantity;
            if (stockQuantity >= units) {
              fulfillOrder(itemId, stockQuantity, units);
              orderTotal(itemId, units);
            } else {
              console.log("Insufficient quantity!");
            }
          });
        } else {
          console.log("ORDER NOT COMPLETED");
        }
      });
    })
    .catch(function(error) {
      console.log(error.message);
    });
};

customerInquirer();
