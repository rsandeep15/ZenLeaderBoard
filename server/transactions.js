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
      // Sugar.js takes human readable date and parses it to a javascript Date() object 
      var dateTime = Date.create(searchString).format('{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}') + "";
      
      console.log("Before: " + dateTime)
      
      // Only Date
      var seconds = dateTime.substring(dateTime.lastIndexOf(":"), dateTime.length);
      var minutes = dateTime.substring(13, 16);
      var hours = dateTime.substring(10, 13);
      var day = dateTime.substring(7,10);
      var month = dateTime.substring(4,7);
      var year = dateTime.substring(0,4); 

      console.log(year + " " + month + " " + day + " " + hours + " " + minutes + " " + seconds); 

      if (hours == 'T00' && minutes == ':00' && seconds == ':00' && searchString.search("00:00:00") == -1)
      {
        dateTime = dateTime.substring(0, 10); 
      }
      else if (seconds == ':00' && minutes == ':00' && searchString.search(":00") < 1)
      {
        dateTime = dateTime.substring(0,13)
      } 
      else if (seconds == ':00' && searchString.lastIndexOf(":00") < 3 )
      {
        dateTime = dateTime.substring(0, 16);
      }
      var monthYearRegex = new RegExp("[a-z]+ [0-9]+");
      var monthRegex = new RegExp("jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec", 'i')
      if (day == "-01")
      {
        if (month == "-01"  && searchString.search(/^jan/i) == -1)
        {
          dateTime = dateTime.substring(0, dateTime.indexOf("-")); 
        }
        else if (monthYearRegex.test(searchString))
        {
          dateTime = dateTime.substring(0, dateTime.lastIndexOf("-")); 
        }
        else if (searchString.match(monthRegex))
        {
          console.log("monthRegex!");
          dateTime = dateTime.substring(dateTime.indexOf("-"), dateTime.lastIndexOf("-") + 1); 
        }
      }
      //console.log("After 1: " + dateTime);
      
      console.log(dateTime);
      // Only Time 
      if (searchString.search(":") >= 0 && searchString.search(/[a-z]/i) == -1)
      {
        console.log("Time only");
        dateTime = dateTime.substring(dateTime.indexOf('T'), searchString.length + dateTime.indexOf('T') + 2);
        console.log(dateTime);
      }
      else if(searchString.search(/am|pm/i) != -1)
      {
        dateTime = dateTime.substring(dateTime.indexOf('T')); 
      }
      //console.log("After 2: " + dateTime); 
      searchString = new RegExp(dateTime); 
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