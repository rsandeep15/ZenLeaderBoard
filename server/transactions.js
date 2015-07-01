  Meteor.publish("transactions", function(options, criteria, searchString){
  	// Counts.publish(this, 'numberOfTransactions',
  	// 	Transactions.find({}), {noReady: true});
  	// if (searchString == null)
  	// {
  	// 	searchString = "";
  	// }
  	// return Transactions.find({"items.acctId": {'$regex' : ".*" + 
   //  	searchString || '' + '.*', '$options': 'i'}}, options); 
  	var criteriaMap = {"Account ID":"items.acctId", "Transaction Code":"items.tranCode", "Base Currency":"baseCurrency", 
  	"Currency":"items.currency", "Amount":"items.amount", "Time Stamp":"timeStamp"};
  	var field = criteriaMap[criteria]; 
  	var doc = {};
  	if (criteria == "Account ID")
  	{
  		doc[field] = parseInt(searchString);
  	}
  	else
  	{
  		doc[field] = searchString;
  	}
  	console.log(doc);
  	if (searchString == "")
  	{
  		return Transactions.find({}, options);
  	}
  	else
  	{
  		return Transactions.find(doc, options);
  	}
  	// console.log(searchString);

  }); 