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
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
  });
  
  function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
     
      var productsArray=[];
      for(var i =0; i<res.length; i++){
       productsArray.push(res[i].product_name)
      }
      inquire( productsArray,res)

      // connection.end();
    });
  }

  function inquire(products,res){
// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    
    // Here we give the user a list to choose from.
    {
      type: "list",
      message: "Which product do you choose?",
      choices: products,
      name: "products"
    },
    // Here we ask the user to confirm.
    {
      type: "text",
      message: "how many ",
      name: "quantity",
   
    }
  ])
  .then(function(inquirerResponse) {
    var amount=parseInt(inquirerResponse.quantity);
var quantity
var index
for(var i=0; i<res.length; i++){

  if(inquirerResponse.products===res[i].product_name){
    console.log(res);
    quantity=parseInt(res[i].stock_quantity);
    index=i;
    
  }
};
console.log(amount, quantity)
if(amount<= quantity){
  console.log("yes" ,"yes")
  quantity-=amount
  console.log("your total cost is "+ res[index].price*amount)

}

    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
   console.log(inquirerResponse )
  });
}

