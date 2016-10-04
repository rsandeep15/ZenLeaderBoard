Meteor.methods({
  // Inserts a single JSON Transaction document to the Mongo Database 
  addTransaction: function(myJson)
  {
    Transactions.insert(myJson, function(err, inserted){
    if (err)
    {
      console.error("File upload failed"); 
    }
    }); 
  },
  // Gets contents of a JSON file and inserts all Transaction documents to the Mongo Database
  addTransactions: function(JSONFile)
  {
    var docArray = JSONFile.split("\n");
    if (Meteor.isClient)
    {
      var progress = document.getElementById("uploadStatus");
      if (progress.value > 99)
      {
        // reset 
        progress.value = 0; 
      }
    }
    for (index = 0; index < docArray.length; index++){
      var doc = docArray[index];
      if (doc != "")
      {
        var newTransactionDoc = Meteor.call('formatJSON', JSON.parse(doc)); 
        if(Meteor.isClient)
        {
          var progress = document.getElementById("uploadStatus"); 
          progress.value = (index/(docArray.length))*100; 
          console.log(progress.value);
        }
        Meteor.call('addTransaction', newTransactionDoc); 
      }
    } 

  },
  formatJSON: function(JSONDoc)
  {
    var newJSON = {};
    if( typeof JSONDoc["items"] != 'undefined' && typeof JSONDoc["items"][0]["acctId"] != 'undefined')
    {
      newJSON["acctId"] = JSONDoc["items"][0]["acctId"].toString(); 
    }
    else if (typeof JSONDoc["acctId"] != 'undefined')
    {
      newJSON["acctId"] = JSONDoc["acctId"].toString(); 
    }
    else
    {
      newJSON["acctId"] = "Unknown"; 
    }

    if( typeof JSONDoc["items"] != 'undefined' && typeof JSONDoc["items"][0]["tranCode"] != 'undefined')
    {
      newJSON['tranCode'] = JSONDoc["items"][0]["tranCode"]; 
    }
    else if (typeof JSONDoc["tranCode"] != 'undefined')
    {
      newJSON['tranCode'] = JSONDoc['tranCode']; 
    }
    else
    {
      newJSON['tranCode'] = "Unknown"; 
    }

    if( typeof JSONDoc["items"] != 'undefined' && typeof JSONDoc['baseCurrency'] != 'undefined')
    {
      newJSON['baseCurrency'] = JSONDoc['baseCurrency']; 
    }
    else if (typeof JSONDoc['currency'] != 'undefined')
    {
      newJSON['baseCurrency'] = JSONDoc['currency']; 
    }
    else
    {
      newJSON['baseCurrency'] = "Unknown"; 
    }

    if (typeof JSONDoc["items"] != 'undefined' && typeof JSONDoc['items'][0]['currency'] != 'undefined')
    {
      newJSON['currency'] = JSONDoc['items'][0]['currency']; 
    }
    else if (typeof JSONDoc['currency'] != 'undefined')
    {
      newJSON['currency'] = JSONDoc['currency']; 
    }
    else
    {
      newJSON['currency'] = "Unknown"; 
    }

    if ( typeof JSONDoc["items"] != 'undefined' && typeof JSONDoc['items'][0]['amount'] != 'undefined' )
    {
      newJSON['amount'] = JSONDoc['items'][0]['amount'].toString();
    }
    else if (typeof JSONDoc['amount'] != 'undefined')
    {
      newJSON['amount'] = JSONDoc['amount'].toString(); 
    }
    else
    {
      newJSON['amount'] = "Unknown"; 
    }

    if ( typeof JSONDoc['timeStamp'] != 'undefined')
    {
      newJSON['timeStamp'] = JSONDoc['timeStamp']; 
    }
    else if (typeof JSONDoc['hostDate'] != 'undefined')
    {
      newJSON['timeStamp'] = JSONDoc['hostDate']; 
    }
    else
    {
      newJSON['timeStamp'] = "Unknown"; 
    }
    return newJSON; 
  },
  removeAll: function()
  {
    if  (! Meteor.userId())
    {
      throw new Meteor.Error("not-authorized"); 
    }
    Transactions.remove({}); 
  },
  timeStringFormatter: function(searchString)
  {
      // Sugar.js takes human readable date and parses it to a javascript Date() object 
      var dateTime = Date.create(searchString).format('{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}') + "";
      
      //console.log("Before: " + dateTime)
      
      // Only Date
      var seconds = dateTime.substring(dateTime.lastIndexOf(":"), dateTime.length);
      var minutes = dateTime.substring(13, 16);
      var hours = dateTime.substring(10, 13);
      var day = dateTime.substring(7,10);
      var month = dateTime.substring(4,7);
      var year = dateTime.substring(0,4); 

      //console.log(year + " " + month + " " + day + " " + hours + " " + minutes + " " + seconds); 

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
        // Year only search
        if (month == "-01"  && searchString.search(/^jan/i) == -1)
        {
          dateTime = dateTime.substring(0, dateTime.indexOf("-")); 
        }
        // Month year search
        else if (monthYearRegex.test(searchString))
        {
          dateTime = dateTime.substring(0, dateTime.lastIndexOf("-")); 
        }
        // Month search
        else if (searchString.match(monthRegex))
        {
          dateTime = dateTime.substring(dateTime.indexOf("-"), dateTime.lastIndexOf("-") + 1); 
        }
      }
      // Only Time 
      if (searchString.search(":") >= 0 && searchString.search(/[a-z]/i) == -1)
      {
        //console.log("Time only");
        dateTime = dateTime.substring(dateTime.indexOf('T'), searchString.length + dateTime.indexOf('T') + 2);
        //console.log(dateTime);
      }
      else if(searchString.search(/am|pm/i) != -1)
      {
        dateTime = dateTime.substring(dateTime.indexOf('T')); 
      }
      var newSearchString = new RegExp(dateTime); 
      return newSearchString; 
  }

});