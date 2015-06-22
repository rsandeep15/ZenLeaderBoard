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
      console.log(sortBy);
      return Transactions.find({}, {sort:{sortBy:1}}); 
    },
    criteria: function()
    {
      return Session.get("cursor"); 
    },
    counter: function(){
      return Transactions.find().count();
    },
    isBlank: function(entry){
      console.log(entry);
      return entry === ''; 
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
    }
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
      }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}
