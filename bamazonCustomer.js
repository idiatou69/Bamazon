var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",


  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Fatimatou96",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  menu();
});

function menu() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);

    inquire(res)

  });
}

function inquire(res) {
  inquirer.prompt([{
    type: "list",
    message: "Do you want to exit?",
    name: "quit",
    choices: ["exit", "continue"]
  }]).then(function (userInput) {

    if (userInput.quit === "exit") {
      connection.end()
    }
    else {
      // Create a "Prompt" with a series of questions.
      inquirer
        .prompt([

          // Here we give the user a list to choose from.
          {
            type: "input",
            message: "Enter item id:",
            validate: function (value) {
              if (isNaN(value)) {
                return false;
              }
              else {
                return true;
              }
            },
            name: "itemID"
          },
          // Here we ask the user to confirm.
          {
            type: "input",
            message: "how many do you want to buy",
            validate: function (value) {
              if (isNaN(value)) {
                return false;
              }
              else {
                return true;
              }
            },
            name: "quantity",

          }
        ])
        .then(function (inquirerResponse) {

          var query = connection.query("select * from products where id = ? ", [inquirerResponse.itemID],
            function (err, res) {

              var userQuantity = parseInt(inquirerResponse.quantity);

              var tableQuantity = res[0].stock_quantity

              var updateQty = tableQuantity - userQuantity



              if (userQuantity <= res[0].stock_quantity) {
                // console.log("yes" ,"yes")
                // quantity -= amount
                // var updateIndex = index + 1;
                // console.log("quantity",quantity, 'index', index)
                connection.query(`UPDATE bamazon.products SET  stock_quantity=${updateQty} WHERE id=${inquirerResponse.itemID}`, function (err, res) {
                  if (err) throw err
                  // console.log("updated!");
                   
                  menu();



                })




              }
              else {
                console.log("insufficient")
                menu();
              }


            }
            )

          console.log(query.sql)
          // for(var i=0; i<res.length; i++){

          //   if(inquirerResponse.products===res[i].product_name){
          //     console.log(res);
          //     quantity=parseInt(res[i].stock_quantity);
          //     index=i;

          //   }
          // };


        });

    }
  })

}

