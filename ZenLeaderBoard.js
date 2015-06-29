Transactions = new Mongo.Collection("Transactions");

var currencies = ["CAD", "USD", "HKD", "SGD" , "AUD", "GBP", "EUR", "YEN", "INR"];
var currencyMap = {"CAD": "Canadian Dollars", "USD":"US Dollars", "HKD":"Hong Kong Dollars", "SGD":"Singapore Dollars" 
, "AUD":"Australian Dollars", "GBP":"British Pounds", "EUR": "Euros", "YEN":"Japanese Yen", "INR":"Indian Rupees"};

var criteria = 'items.acctId'; 

if (Meteor.isClient) {
  Meteor.subscribe("Transactions");

  Template.sortBoard.created = function()
  {
      Session.setDefault("cursor", "items.acctId");
  }
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
        var currencyCount = Transactions.find({"items.currency":currency}).count(); 
        var percentage = ((currencyCount/totalTransactions)* 100 ).toFixed(1) + "%";
        percentages.push({'currency':currencyMap[currency], 'count': currencyCount, 'percentage': percentage});
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
      "click .delete":function(){

       var thisTrans = "Account ID: " + this["items.acctId"] + " Transaction Code: " + this["items.tranCode"] +  " Base Currency: " 
        + this["baseCurrency"] + " Currency: " + this["items.currency"] + " Amount: " + this["items.amount"]
        + " Time Stamp: " + this["timeStamp"];  
       var deleted =  confirm("Confirm Delete: " + this._id);
       if (deleted == true)
       {
          Transactions.remove(this._id); 
       } 
//        Transactions.find({"_id":"this._id"}); 

      },
      'click .hit':function ()
      {

        // Retrive User Entered info from the form  

        var form = document.forms["transaction"];
        var accountID = form["Account ID"].value;
        var transactionCode = form["Transaction Code"].value; 
        var baseCurrency = form["Base Currency"].value;
        var currency = form["Currency"].value; 
        var amount = form["Amount"].value; 
        var date = form["Date"].value;
        var time = form["Time"].value;
        var jsDT = date + "T" + time; 
        var transInfo = [accountID, transactionCode, baseCurrency, currency, amount, date, time]
        
        var internalJSON = {"acctId":accountID, "amount":amount, "tranCode": transactionCode, "currency": currency}; 
        if(accountID == "")
        {
          delete internalJSON["acctId"]; 
        }
        if (transactionCode == "")
        {
          delete internalJSON["tranCode"];
        }
        if(currency == "")
        {
          delete internalJSON["currency"];  
        }
        if(amount == "")
        {
          delete internalJSON["amount"]; 
        }
        var myJSON = {"items": [internalJSON], 
          baseCurrency: baseCurrency, timeStamp: jsDT }; 
        
        if (baseCurrency == "")
        {
          delete myJSON["baseCurrency"];
        }    
        if(date = "" && time == "")
        {
          delete myJSON["timeStamp"]; 
        }
        var finalTransaction = "Account ID: " + accountID + " Transaction Code: " + transactionCode +  " Base Currency: " 
        + baseCurrency + " Currency: " + currency + " Amount: " + amount + " Date: " 
        + date + " Time: " + time;  

        var ok = confirm("Confirm Add: \n" + finalTransaction); 

        // Adds a transaction with the user specified information from the form to Mongo Collection
        if(ok == true)
        {
          Transactions.insert(myJSON);
          console.log(myJSON); 
          // Clear Form

          form["Account ID"].value=""; 
          form["Transaction Code"].value=""; 
          form["Base Currency"].value="";
          form["Currency"].value=""; 
          form["Amount"].value="";
          form["Date"].value="";
          form["Time"].value=""; 
        }



        return false;  
      }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    // import data only when Products collection is empty
    //var fh = fopen (Assets.getText('simple.json'), 0);  
    Meteor.publish("Transactions", function()
    {
        return Transactions.find(); 
    }); 

  });
}
