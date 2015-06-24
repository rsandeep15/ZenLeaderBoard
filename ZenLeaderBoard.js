Transactions = new Mongo.Collection("Transactions");

var currencies = ["CAD", "USD", "HKD", "SGD" , "AUD", "GBP", "EUR", "YEN", "RUP"];
var currencyMap = {"CAD": "Canadian Dollars", "USD":"US Dollars", "HKD":"Hong Kong Dollars", "SGD":"Singapore Dollars" 
, "AUD":"Australian Dollars", "GBP":"British Pounds", "EUR": "Euros", "YEN":"Japanese Yen", "RUP":"Indian Rupees"};

var criteria = 'items.acctId'; 

if (Meteor.isClient) {
  Session.setDefault("cursor", "items.acctId");
  Template.sortBoard.helpers({

    sortedTable: function()
    {
      var sortBy = Session.get("cursor");
      return Transactions.find({}, {sort:{sortBy:1}}); 
    },
    criteria: function()
    {
      return Session.get("cursor"); 
    },
    counter: function(){
      return Transactions.find().count();
    },

    fixAmount: function(amount){
      var amount = amount + ""; 
      var index = amount.indexOf("#");
      if (amount !== "Unknown" && index >= 0)
      {
        return amount.substring(0, index);
      }
      else
      {
        if (amount !== "Unknown")
        {
          return parseFloat(amount).toFixed(2); 
        }
        else
        {
          return amount; 
        }
      }
    },
    formatDate: function(date){
      return moment(date).format('MMM Do, YYYY h:mm:ss a'); 
    },
    distribution: function(){
      var percentages = [];
      for (var i =0; i < currencies.length; i++)
      {
        var currency = currencies[i];
        var totalTransactions = Transactions.find().count();
        var percentage = ((Transactions.find({"items.currency":currency}).count()/totalTransactions)* 100 ).toFixed(1) + "%";
        percentages.push({'currency':currencyMap[currency], 'percentage': percentage});
      }
      return percentages; 
    },
  });
Template.sortBoard.events({
  'click':function(event){
    event.preventDefault();
    var elem = document.getElementById("Sorted Table");

    var sortCriteria = document.getElementById("criteria").value; 

        //console.log(sortCriteria);
        var criteriaMap = {"Account ID":"items.acctId", "Base Currency":"baseCurrency", 
        "Currency":"items.currency", "Amount":"items.amount", "Time Stamp":"timeStamp"}; 
        
        criteria = criteriaMap[sortCriteria];
        Session.set("cursor", criteria);
      },
      'click .hit':function (event)
      {
        var form = document.forms["transaction"];
        var accountID = form["Account ID"].value;
        var baseCurrency = form["Base Currency"].value;
        var currency = form["Currency"].value; 
        var amount = form["Amount"].value; 
        var date = form["Date"].value;
        var time = form["Time"].value;
        var jsDT = date + "T" + time; 
        
        var finalTransaction = "Account ID: " + accountID + " Base Currency: " 
        + baseCurrency + " Currency: " + currency + " Amount: " + amount + " Date: " 
        + date + " Time: " + time;  

        alert("Confirm Add: \n" + finalTransaction + " ?"); 
        var transInfo = [];

        // Adds a transaction with the user specified information from the form to Mongo Collection
        
        alert(jsDT); 
        Transactions.insert({"items": [{"acctId":accountID, "amount":amount, "currency": currency}], 
        baseCurrency: baseCurrency, timeStamp: jsDT });
        
        return false;  
      }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}
