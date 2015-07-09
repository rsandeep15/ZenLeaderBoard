if (Meteor.isClient) {
  var currencies = ["CAD", "USD", "HKD", "SGD" , "AUD", "GBP", "EUR", "YEN", "INR"];
  var currencyMap = {"CAD": "Canadian Dollars", "USD":"US Dollars", "HKD":"Hong Kong Dollars", "SGD":"Singapore Dollars" 
, "AUD":"Australian Dollars", "GBP":"British Pounds", "EUR": "Euros", "YEN":"Japanese Yen", "INR":"Indian Rupees"};
  //The vital stats table needs access to the whole colleciton
  //Meteor.subscribe("transactions");
  
  Template.sortBoard.helpers({
    counter: function(){
      return Transactions.find().count();
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
    }
  });

Template.sortBoard.events({
      'click .add':function ()
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
        if (time.length <= 5)
        {
          time = time + ":00";
        }
        var jsDT = date + "T" + time; 
        var transInfo = [accountID, transactionCode, baseCurrency, currency, amount, date, time];
        
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
        if(date == "" && time == "")
        {
          delete myJSON["timeStamp"]; 
        }
        var finalTransaction = "Account ID: " + accountID + " Transaction Code: " + transactionCode +  " Base Currency: " 
        + baseCurrency + " Currency: " + currency + " Amount: " + amount + " Date: " + date + " Time: " + time;  

        var ok = confirm("Confirm Add: \n" + finalTransaction); 

        // Adds a transaction with the user specified information from the form to Mongo Collection
        if(ok == true)
        {
          Meteor.call("addTransaction", myJSON); 
          
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
Meteor.methods({
  addTransaction: function(myJson)
  {
    if(! Meteor.userId())
    {
      throw new Meteor.Error("not-authorized");
    }
    Transactions.insert(myJson); 
  }
});
