  Meteor.publish("transactions", function(options, criteria, searchString){

  	if (searchString == null || searchString == '')
  	{
  		searchString = "";
  	}
  	var criteriaMap = {"Account ID":"acctId", "Transaction Code":"tranCode", "Base Currency":"baseCurrency", 
  	"Currency":"currency", "Amount":"amount", "Time Stamp":"timeStamp"};
  	var field = criteriaMap[criteria]; 
  	var doc = {};
    if (field == "timeStamp" && searchString != "")
    {
      searchString = Meteor.call('timeStringFormatter', searchString); 
    }
    else
    {
      searchString = new RegExp( "^" + searchString, 'i');
    }
    doc[field] = searchString;
    Counts.publish(this, 'numberOfTransactions', Transactions.find(doc), {noReady: true});

    var currencies = ["CAD", "USD", "HKD", "SGD" , "AUD", "GBP", "EUR", "YEN", "INR"];
    for (var i = 0; i < currencies.length; i++)
    {
      var currency = currencies[i];
      //console.log(currency); 
      var copyOfDoc = {};
      copyOfDoc[field] = searchString;

      switch(field)
      {
        case "currency":
          copyOfDoc["baseCurrency"] = currency; 
          break;
        case "baseCurrency": 
          copyOfDoc["currency"] = currency;
          break;
        default:
          copyOfDoc["currency"] = currency; 

      }
      Counts.publish(this, currencies[i].toString(), Transactions.find(copyOfDoc), {noReady: true}); 
    }
  	return Transactions.find( doc , options);
  }); 