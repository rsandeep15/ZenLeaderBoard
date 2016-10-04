if (Meteor.isClient)
{
var currencies = ["CAD", "USD", "HKD", "SGD" , "AUD", "GBP", "EUR", "YEN", "INR"];
var currencyMap = {"CAD": "Canadian Dollars", "USD":"US Dollars", "HKD":"Hong Kong Dollars", "SGD":"Singapore Dollars" 
, "AUD":"Australian Dollars", "GBP":"British Pounds", "EUR": "Euros", "YEN":"Japanese Yen", "INR":"Indian Rupees"};

Template.sortBoard.helpers({
    counter: function(){
      return Counts.get('numberOfTransactions');
    },
    distribution: function(){
      var percentages = [];
      for (var i =0; i < currencies.length; i++)
      {
        var currency = currencies[i].toString();
        var totalTransactions = Counts.get('numberOfTransactions');
        var currencyCount = Counts.get(currency); 
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
        if (time.length <= 5 && time != "")
        {
          time = time + ":00";
        }
        var jsDT = date + "T" + time; 
        var transInfo = [accountID, transactionCode, baseCurrency, currency, amount, date, time];

        var myJSON = {"acctId":accountID,  "tranCode": transactionCode, "baseCurrency": baseCurrency, "currency": currency, 
"amount":amount, "timeStamp": jsDT }; 

        for (var key in myJSON)
        {
          if(myJSON.hasOwnProperty(key))
          {
            if (myJSON[key] == "")
            {
              myJSON[key] = "Unknown";
            }
          }
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
      },
      'click .clear': function(event){
          event.preventDefault(); 
          var form = document.forms["transaction"];
          form["Account ID"].value=""; 
          form["Transaction Code"].value=""; 
          form["Base Currency"].value="";
          form["Currency"].value=""; 
          form["Amount"].value="";
          form["Date"].value="";
          form["Time"].value=""; 
      },
      'change .myFileInput': function(event, template){
        FS.Utility.eachFile(event, function(file){
              var reader = new FileReader();
              reader.readAsText(file);
              // FileReader is asynchronous http://stackoverflow.com/questions/6792030/html5-filereader-problems
              reader.onload = function()
              {
                var NewTransactionsData = reader['result'];
                Meteor.call("addTransactions", NewTransactionsData); 
                //alert("New transactions have been loaded"); 
                document.getElementById("fileUploader").value=""; 
              } 
        });
      }

    });
}