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

var productsForSale = function() {
  connection.query({
    sql: 'SELECT * FROM products',
  }, function(error, results) {
    if (error) throw error;
    var table = new Table({
      head: ['Product ID', 'Product Name', 'Price', 'Stock Quantity'],
      colWidths: [15, 60, 10, 20]
    });
    for (var product in results) {
      var product_info = [results[product].item_id, results[product].product_name, results[product].price, results[product].stock_quantity];
      table.push(product_info);
    }
    console.log(table.toString());
  });
};

var viewLowInventory = function() {
  connection.query({
    sql: 'SELECT * FROM `products` WHERE `stock_quantity` < ?',
    values: [5]
  }, function(error, results) {
    if (error) throw error;
    var table = new Table({
      head: ['Product ID', 'Product Name', 'Price', 'Stock Quantity'],
      colWidths: [15, 60, 10, 20]
    });
    for (var product in results) {
      var product_info = [results[product].item_id, results[product].product_name, results[product].price, results[product].stock_quantity];
      table.push(product_info);
    }
    console.log(table.toString());
  });
};

var addToInventory = function() {
  var questions = [{
      type: 'input',
      name: 'item_id',
      message: 'What is the ID of the product you would add more quantity?',
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
      message: 'How many units would you like to add?',
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ];

  Inquirer.prompt(questions).then(function(answers) {
    var item_id = parseInt(answers.item_id);
    var units = parseInt(answers.units);
    connection.query({
      sql: 'UPDATE `products` SET `stock_quantity` = `stock_quantity` + ? WHERE `item_id` = ?',
      values: [units, item_id]
    }, function(error, results) {
      if (error) throw error;
      console.log("Inventory updated!");
    });
  });
};

var addNewProduct = function() {
  var questions = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of the product?'
    },
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?'
    },
    {
      type: 'input',
      name: 'price',
      message: 'What is the price?',
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'How many would you like to add to the inventory?',
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
      sql: 'INSERT INTO `products` SET product_name = ?, department_name = ?, price  = ?, stock_quantity = ?',
      values: [answers.name, answers.department, answers.price, answers.quantity]
    }, function(error, results) {
      if (error) throw error;
      console.log("New Product Added!");
    });
  });
};

var managerInquirer = function() {
  Inquirer.prompt([{
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [
      '* View Products for Sale',
      '* View Low Inventory',
      '* Add to Inventory',
      '* Add New Product'
    ]
  }]).then(function(answers) {
    switch (answers.choice) {
      case '* View Products for Sale':
        productsForSale();
        break;
      case '* View Low Inventory':
        viewLowInventory();
        break;
      case '* Add to Inventory':
        addToInventory();
        break;
      case '* Add New Product':
        addNewProduct();
        break;
      default:
        console.log("Choice not found!");
    }
  });
};

managerInquirer();
