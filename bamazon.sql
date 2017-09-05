DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price  DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  product_sales DECIMAL(10,2),
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT(10) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO
  departments
SET
  department_name = "Electronics",
  over_head_costs = 1000.00
;

INSERT INTO
  departments
SET
  department_name = "Card Games",
  over_head_costs = 10.00
;

INSERT INTO
  departments
SET
  department_name = "Stacking Games",
  over_head_costs = 50.00
;

INSERT INTO
  departments
SET
  department_name = "Books",
  over_head_costs = 50.00
;

INSERT INTO
  departments
SET
  department_name = "Video Games",
  over_head_costs = 100.00
;

INSERT INTO
  products
SET
  product_name = "Fire TV Stick with Alexa Voice Remote | Streaming Media Player",
  department_name = "Electronics",
  price  = 34.99,
  stock_quantity = 10
;

INSERT INTO
  products
SET
  product_name = "PlayStation 4 Slim 500GB Console - Uncharted 4 Bundle",
  department_name = "Electronics",
  price  = 269.99,
  stock_quantity = 10
;

INSERT INTO
  products
SET
  product_name = "Cards Against Humanity",
  department_name = "Card Games",
  price  = 25.00,
  stock_quantity = 5
;

INSERT INTO
  products
SET
  product_name = "Jenga Classic Game",
  department_name = "Stacking Games",
  price  = 10.27,
  stock_quantity = 8
;

INSERT INTO
  products
SET
  product_name = "The Subtle Art of Not Giving a F*ck: A Counterintuitive Approach to Living a Good Life",
  department_name = "Books",
  price  = 14.99,
  stock_quantity = 10
;

INSERT INTO
  products
SET
  product_name = "The Official SAT Study Guide, 2018 Edition (Official Study Guide for the New Sat)",
  department_name = "Books",
  price  = 12.60,
  stock_quantity = 3
;

INSERT INTO
  products
SET
  product_name = "$20 PlayStation Store Gift Card - PS3/ PS4/ PS Vita [Digital Code]",
  department_name = "Video Games",
  price  = 19.99,
  stock_quantity = 10
;

INSERT INTO
  products
SET
  product_name = "Destiny 2 - Xbox One Standard Edition",
  department_name = "Video Games",
  price  = 59.96,
  stock_quantity = 10
;

INSERT INTO
  products
SET
  product_name = "Roku Streaming Stick (3600R) - HD Streaming Player with Quad-Core Processor",
  department_name = "Electronics",
  price  = 39.98,
  stock_quantity = 8
;
