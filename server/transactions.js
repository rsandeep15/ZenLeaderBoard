  Meteor.publish("transactions", function(options, criteria, searchString){
  	// Counts.publish(this, 'numberOfTransactions',
  	// 	Transactions.find({}), {noReady: true});
  	if (searchString == null || searchString == '')
  	{
  		searchString = "";
      return Transactions.find({}, options);
  	}
  	// return Transactions.find({"items.acctId": {'$regex' : ".*" + 
   //  	searchString || '' + '.*', '$options': 'i'}}, options); 
  	var criteriaMap = {"Account ID":"items.acctId", "Transaction Code":"items.tranCode", "Base Currency":"baseCurrency", 
  	"Currency":"items.currency", "Amount":"items.amount", "Time Stamp":"timeStamp"};
  	var field = criteriaMap[criteria]; 
  	var doc = {};
    
    // Handles search for null fields
    var nullRegex = new RegExp("^" + searchString, 'i');
    var nullString = "unknown"; 
    if (nullRegex.test(nullString) ){
      doc[field] = null; 
      return Transactions.find(doc, options); 
    }

    //Requires Exact Match 
    if (field == "items.acctId")
    {
      searchString = parseInt(searchString); 
    }
    else if (field == "items.amount")
    {
      searchString = parseFloat(searchString);
    }

    else if (field == "timeStamp")
    {
      searchString = new RegExp(searchString); 
    }
    else
    {
      searchString = new RegExp( "^" + searchString, 'i');
    }
    doc[field] = searchString;
    console.log(doc);
    // console.log(Transactions.find(doc, options).count());
  	return Transactions.find( doc , options);
  }); 